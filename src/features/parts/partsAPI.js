import { ERROR_MESSAGES } from '../../constants/errorMessages'

const API_KEY = '00000000-0000-0000-0000-000000000001'
const API_URL = 'https://api.favorit-parts.ru/hs/hsprice/'

const normalizeBrandList = (payload) => {
  const data = Array.isArray(payload?.goods) ? payload.goods : []

  const brands = data
    .map((item) => item?.brand || item?.manufacturer || item?.vendor || item?.producer || item?.name)
    .filter(Boolean)

  return [...new Set(brands)]
}

const normalizeGoodsResponse = (payload) => {
  const goods = Array.isArray(payload?.goods) ? payload.goods : []

  const originals = goods.map((item) => ({
    goodsID: item?.goodsID || null,
    name: item?.name || '—',
    brand: item?.brand || '—',
    price: Number(item?.price || 0),
    count: Number(item?.count || 0),
    isOriginal: true,
  }))

  const analogues = goods.flatMap((item) => Array.isArray(item?.analogues)
    ? item.analogues.map((analogue) => ({
        goodsID: analogue?.goodsID || null,
        name: analogue?.name || '—',
        brand: analogue?.brand || '—',
        price: Number(analogue?.price || 0),
        count: Number(analogue?.count || 0),
        isOriginal: false,
      }))
    : [])

  return {
    originals,
    analogues,
  }
}

const requestPartsApi = async ({ number, brand, signal, withAnalogues = false, fallbackError }) => {
  const normalizedNumber = String(number ?? '').trim()

  if (!normalizedNumber) {
    return null
  }

  const url = new URL(API_URL)
  url.searchParams.set('key', API_KEY)
  url.searchParams.set('number', normalizedNumber)

  if (brand) {
    url.searchParams.set('brand', String(brand).trim())
  }

  if (withAnalogues) {
    url.searchParams.set('analogues', 'on')
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    if (payload?.error) {
      throw new Error(String(payload.error))
    }

    throw new Error(fallbackError || ERROR_MESSAGES.BRAND_LOAD_FAILED)
  }

  if (payload?.error) {
    throw new Error(String(payload.error))
  }

  return payload
}

export const fetchBrandsByNumber = async (number, signal) => {
  const payload = await requestPartsApi({
    number,
    signal,
    fallbackError: ERROR_MESSAGES.BRAND_LOAD_FAILED,
  })

  if (!payload) {
    return []
  }

  return normalizeBrandList(payload)
}

export const fetchAnalogueGoodsByNumberAndBrand = async (number, brand, signal) => {
  const normalizedBrand = String(brand ?? '').trim()

  if (!number || !normalizedBrand) {
    return { originals: [], analogues: [] }
  }

  const payload = await requestPartsApi({
    number,
    brand: normalizedBrand,
    signal,
    withAnalogues: true,
    fallbackError: ERROR_MESSAGES.ANALOGUE_LOAD_FAILED,
  })

  if (!payload) {
    return { originals: [], analogues: [] }
  }

  return normalizeGoodsResponse(payload)
}
