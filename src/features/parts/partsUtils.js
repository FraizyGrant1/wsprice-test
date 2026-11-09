export const filterVisibleRows = (rows = []) =>
  rows.filter((row) => Number(row?.price || 0) > 0)

export const sortByStockThenPrice = (rows = []) =>
  [...rows].sort((a, b) => {
    const aStock = Number(a?.count || 0)
    const bStock = Number(b?.count || 0)

    if (aStock === 0 && bStock > 0) {
      return 1
    }

    if (aStock > 0 && bStock === 0) {
      return -1
    }

    return Number(a?.price || 0) - Number(b?.price || 0)
  })

