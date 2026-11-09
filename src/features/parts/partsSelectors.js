const selectParts = (state) => state.parts

export const selectSearch = (state) => selectParts(state).search
export const selectBrands = (state) => selectParts(state).brands
export const selectBrandError = (state) => selectParts(state).brandError
export const selectSelectedBrand = (state) => selectParts(state).selectedBrand

export const selectOriginals = (state) => selectParts(state).originals
export const selectAnalogues = (state) => selectParts(state).analogues
export const selectAnalogueStatus = (state) => selectParts(state).analogueStatus
export const selectAnalogueError = (state) => selectParts(state).analogueError

export const selectShouldShowBrandList = (state) => {
  const { search, brandStatus } = selectParts(state)
  return search !== '' || brandStatus !== 'idle'
}

export const selectHasEmptyGoods = (state) => {
  const { brandStatus, brands } = selectParts(state)
  return brandStatus === 'succeeded' && brands.length === 0
}

export const selectHasServerError = (state) => {
  const { brandStatus, brandError } = selectParts(state)
  return brandStatus === 'failed' && Boolean(brandError)
}

export const selectIsBrandLoading = (state) => selectParts(state).brandStatus === 'loading'
