import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import PartsSearch from '../src/components/PartsSearch'
import partsReducer from '../src/features/parts/partsSlice'

const makeState = (search = '') => ({
  parts: {
    search,
    brands: [],
    selectedBrand: '',
    originals: [],
    analogues: [],
    brandStatus: 'idle',
    brandError: null,
    analogueStatus: 'idle',
    analogueError: null,
  },
})

const renderWithStore = (preloadedState = makeState()) => {
  const store = configureStore({
    reducer: { parts: partsReducer },
    preloadedState,
  })

  return { store, ...render(
    <Provider store={store}>
      <PartsSearch />
    </Provider>,
  ) }
}

describe('PartsSearch', () => {
  it('marks invalid input when a not correct symbol is entered', () => {
    renderWithStore(makeState())

    const input = screen.getByLabelText('Поиск запчасти по номеру')
    fireEvent.change(input, { target: { value: 'ABC-123' } })

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Номер детали может содержать только цифры и латинские буквы')).toBeInTheDocument()
  })

  it('updates search on valid input', async () => {
    const user = userEvent.setup()
    renderWithStore(makeState())

    const input = screen.getByLabelText('Поиск запчасти по номеру')
    await user.type(input, 'ABC123')

    expect(input).toHaveValue('ABC123')
  })
})
