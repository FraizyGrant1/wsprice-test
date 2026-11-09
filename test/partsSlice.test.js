import { describe, expect, it } from 'vitest'
import reducer, {
  clearBrands,
  loadAnalogueGoods,
  loadBrandsByNumber,
  setSearch,
  setSelectedBrand,
} from '../src/features/parts/partsSlice'

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

describe('partsSlice', () => {
  it('sets search and clears selected brand and analogue data', () => {
    const state = reducer(
      {
        ...initialState,
        selectedBrand: 'HOFFER',
        originals: [{ name: 'A' }],
        analogues: [{ name: 'B' }],
        analogueStatus: 'succeeded',
      },
      setSearch('ABC123'),
    )

    expect(state.search).toBe('ABC123')
    expect(state.selectedBrand).toBe('')
    expect(state.originals).toEqual([])
    expect(state.analogues).toEqual([])
    expect(state.analogueStatus).toBe('idle')
  })

  it('clears brands and analogue state when clearBrands is dispatched', () => {
    const state = reducer(
      {
        ...initialState,
        brandStatus: 'succeeded',
        brandError: 'boom',
        brands: ['HOFFER', 'ASAM'],
        selectedBrand: 'HOFFER',
        originals: [{ name: 'A' }],
        analogues: [{ name: 'B' }],
        analogueStatus: 'succeeded',
        analogueError: 'fail',
      },
      clearBrands(),
    )

    expect(state.brands).toEqual([])
    expect(state.brandStatus).toBe('idle')
    expect(state.brandError).toBeNull()
    expect(state.selectedBrand).toBe('')
    expect(state.originals).toEqual([])
    expect(state.analogues).toEqual([])
  })

  it('sets selected brand', () => {
    const state = reducer(initialState, setSelectedBrand('HOFFER'))
    expect(state.selectedBrand).toBe('HOFFER')
  })

  it('handles loadBrandsByNumber pending and fulfilled states', () => {
    const pendingState = reducer(
      initialState,
      loadBrandsByNumber.pending('request', { number: 'ABC123', signal: new AbortController().signal }),
    )
    expect(pendingState.brandStatus).toBe('loading')
    expect(pendingState.brandError).toBeNull()
    expect(pendingState.brands).toEqual([])

    const fulfilledState = reducer(
      pendingState,
      loadBrandsByNumber.fulfilled(['HOFFER', 'ASAM'], 'request', { number: 'ABC123', signal: new AbortController().signal }),
    )

    expect(fulfilledState.brandStatus).toBe('succeeded')
    expect(fulfilledState.brands).toEqual(['HOFFER', 'ASAM'])
  })

  it('handles loadBrandsByNumber rejection with error message', () => {
    const state = reducer(
      initialState,
      loadBrandsByNumber.rejected(new Error('Network failed'), 'request', { number: 'ABC123', signal: new AbortController().signal }, 'Network failed'),
    )

    expect(state.brandStatus).toBe('failed')
    expect(state.brandError).toBe('Network failed')
  })

  it('handles cancelled brand request without leaving error state', () => {
    const state = reducer(
      {
        ...initialState,
        brandStatus: 'loading',
        brandError: 'old error',
      },
      loadBrandsByNumber.rejected(
        { name: 'AbortError', message: 'Aborted' },
        'request',
        { number: 'ABC123', signal: { aborted: true } },
        'Aborted',
      ),
    )

    expect(state.brandStatus).toBe('idle')
    expect(state.brandError).toBeNull()
  })

  it('handles loadAnalogueGoods pending and fulfilled states', () => {
    const pendingState = reducer(
      initialState,
      loadAnalogueGoods.pending('request', { number: 'ABC123', brand: 'HOFFER', signal: new AbortController().signal }),
    )

    expect(pendingState.analogueStatus).toBe('loading')
    expect(pendingState.originals).toEqual([])
    expect(pendingState.analogues).toEqual([])

    const fulfilledState = reducer(
      pendingState,
      loadAnalogueGoods.fulfilled(
        {
          originals: [{ name: 'Original', price: 100, count: 5 }],
          analogues: [{ name: 'Analog', price: 80, count: 2 }],
        },
        'request',
        { number: 'ABC123', brand: 'HOFFER', signal: new AbortController().signal },
      ),
    )

    expect(fulfilledState.analogueStatus).toBe('succeeded')
    expect(fulfilledState.originals).toHaveLength(1)
    expect(fulfilledState.analogues).toHaveLength(1)
  })

  it('handles analogue rejection with payload error message', () => {
    const state = reducer(
      initialState,
      loadAnalogueGoods.rejected(
        new Error('Bad analogues'),
        'request',
        { number: 'ABC123', brand: 'HOFFER', signal: new AbortController().signal },
        'Bad analogues',
      ),
    )

    expect(state.analogueStatus).toBe('failed')
    expect(state.analogueError).toBe('Bad analogues')
  })
})
