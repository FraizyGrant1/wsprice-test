import { describe, it, expect } from 'vitest'
import { filterVisibleRows, sortByStockThenPrice } from '../src/features/parts/partsUtils'

describe('partsUtils', () => {
  it('filters out rows with zero or negative price', () => {
    const rows = [
      { name: 'A', price: 0, count: 2 },
      { name: 'B', price: 100, count: 0 },
      { name: 'C', price: -100, count: 5 },
      { name: 'D', price: 50, count: 1 },
    ]

    expect(filterVisibleRows(rows)).toEqual([{ name: 'B', price: 100, count: 0 }, { name: 'D', price: 50, count: 1 }])
  })

  it('sorts rows by stock first, then by price asc', () => {
    const rows = [
      { name: 'A', price: 120, count: 0 },
      { name: 'B', price: 40, count: 5 },
      { name: 'C', price: 80, count: 2 },
      { name: 'D', price: 30, count: 0 },
    ]

    expect(sortByStockThenPrice(rows)).toEqual([
      { name: 'B', price: 40, count: 5 },
      { name: 'C', price: 80, count: 2 },
      { name: 'D', price: 30, count: 0 },
      { name: 'A', price: 120, count: 0 },
    ])
  })
})

