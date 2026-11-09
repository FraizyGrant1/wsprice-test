import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAnalogueGoodsByNumberAndBrand, fetchBrandsByNumber } from './partsAPI'
import { ERROR_MESSAGES } from '../../constants/errorMessages'

const initialState = {
  brandStatus: 'idle',
  brandError: null,
  search: '',
  brands: [],
  selectedBrand: '',
  originals: [],
  analogues: [],
  analogueStatus: 'idle',
  analogueError: null,
}

const resetAnalogueState = (state) => {
  state.originals = []
  state.analogues = []
  state.analogueError = null
  state.analogueStatus = 'idle'
}

const resetBrandState = (state) => {
  state.brands = []
  state.brandError = null
  state.brandStatus = 'idle'
}

const isCancelledRequest = (action) => action?.meta?.arg?.signal?.aborted === true || action?.error?.name === 'AbortError'

const setRequestFailure = (state, action, statusKey) => {
  const statusField = `${statusKey}Status`
  const errorField = `${statusKey}Error`

  if (isCancelledRequest(action)) {
    state[statusField] = 'idle'
    state[errorField] = null
    return
  }

  state[statusField] = 'failed'
  state[errorField] =
    typeof action.payload === 'string'
      ? action.payload
      : action.error?.message || ERROR_MESSAGES[`${statusKey.toUpperCase()}_FETCH_ERROR`] || 'Неизвестная ошибка'
}

export const loadBrandsByNumber = createAsyncThunk(
  'parts/fetchBrandsByNumber',
  async ({ number, signal }, { rejectWithValue }) => {
    try {
      return await fetchBrandsByNumber(number, signal)
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue(error)
      }
      return rejectWithValue(error.message || ERROR_MESSAGES.BRAND_FETCH_ERROR)
    }
  },
)

export const loadAnalogueGoods = createAsyncThunk(
  'parts/fetchAnalogueGoods',
  async ({ number, brand, signal }, { rejectWithValue }) => {
    try {
      return await fetchAnalogueGoodsByNumberAndBrand(number, brand, signal)
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue(error)
      }
      return rejectWithValue(error.message || ERROR_MESSAGES.ANALOGUE_FETCH_ERROR)
    }
  },
)

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload
    },
    setSearch: (state, action) => {
      state.search = action.payload
      state.selectedBrand = ''
      resetAnalogueState(state)
    },
    clearBrands: (state) => {
      resetBrandState(state)
      state.selectedBrand = ''
      resetAnalogueState(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBrandsByNumber.pending, (state) => {
        state.brandStatus = 'loading'
        state.brandError = null
        state.brands = []
      })
      .addCase(loadBrandsByNumber.fulfilled, (state, action) => {
        if (action.meta.arg.signal?.aborted) return

        state.brandStatus = 'succeeded'
        state.brands = action.payload
      })
      .addCase(loadBrandsByNumber.rejected, (state, action) => {
        setRequestFailure(state, action, 'brand')
      })
      .addCase(loadAnalogueGoods.pending, (state) => {
        state.analogueStatus = 'loading'
        state.analogueError = null
        state.originals = []
        state.analogues = []
      })
      .addCase(loadAnalogueGoods.fulfilled, (state, action) => {
        if (action.meta.arg.signal?.aborted) return

        state.analogueStatus = 'succeeded'
        state.originals = action.payload.originals || []
        state.analogues = action.payload.analogues || []
      })
      .addCase(loadAnalogueGoods.rejected, (state, action) => {
        setRequestFailure(state, action, 'analogue')
      })
  },
})

export const { setSelectedBrand, setSearch, clearBrands } = partsSlice.actions
export default partsSlice.reducer
