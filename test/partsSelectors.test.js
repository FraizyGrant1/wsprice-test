import { describe, it, expect } from 'vitest'
import {
  selectHasEmptyGoods,
  selectHasServerError,
  selectShouldShowBrandList,
} from '../src/features/parts/partsSelectors'

describe('partsSelectors', () => {
  it('shows brands list when search is not empty', () => {
    const state = { parts: { search: 'ABC123', brandStatus: 'idle', brands: [] } }
    expect(selectShouldShowBrandList(state)).toBe(true)
  })

  it('shows brands list when brand status is not idle', () => {
    const state = { parts: { search: '', brandStatus: 'loading', brands: [] } }
    expect(selectShouldShowBrandList(state)).toBe(true)
  })

  it('hides brands list when search is empty and status is idle', () => {
    const state = { parts: { search: '', brandStatus: 'idle', brands: [] } }
    expect(selectShouldShowBrandList(state)).toBe(false)
  })

  it('marks empty goods when brand request succeeded with no brands', () => {
    const state = { parts: { brandStatus: 'succeeded', brands: [] } }
    expect(selectHasEmptyGoods(state)).toBe(true)
  })

  it('does not mark empty goods when brands exist', () => {
    const state = { parts: { brandStatus: 'succeeded', brands: ['HOFFER'] } }
    expect(selectHasEmptyGoods(state)).toBe(false)
  })

  it('marks server error when status is failed and error exists', () => {
    const state = { parts: { brandStatus: 'failed', brandError: 'Boom' } }
    expect(selectHasServerError(state)).toBe(true)
  })

  it('does not mark server error for idle state', () => {
    const state = { parts: { brandStatus: 'idle', brandError: null } }
    expect(selectHasServerError(state)).toBe(false)
  })
})
