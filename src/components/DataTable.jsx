import EmptyState from './EmptyState'
import { filterVisibleRows, sortByStockThenPrice } from '../features/parts/partsUtils'

const DataTable = ({ title, rows = [], variant = 'default', emptyMessage = null, showZeroPrice = false }) => {
  const isPrimary = variant === 'primary'

  if (!rows.length && isPrimary) {
    return null
  }

  const sortedRows = sortByStockThenPrice(rows)
  const displayRows = showZeroPrice ? sortedRows : filterVisibleRows(sortedRows)

  if (!rows.length && !isPrimary) {
    return emptyMessage ? <EmptyState message={emptyMessage} /> : null
  }

  if (!displayRows.length && !isPrimary) {
    return emptyMessage ? <EmptyState message={emptyMessage} /> : null
  }

  return (
    <div className="mt-4">
      <div className={`fw-semibold mb-2 ${isPrimary ? 'text-primary' : 'text-light'}`}>{title}</div>
      <div className={`table-responsive ${isPrimary ? 'table-responsive--primary' : 'table-responsive--secondary'}`}>
        <table className={`table align-middle mb-0 ${isPrimary ? 'table-original' : 'table-analogue'}`}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Бренд</th>
              <th>Стоимость</th>
              <th>Остаток</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, index) => (
              <tr key={`${row?.goodsID || row?.name || 'row'}-${index}`}>
                <td>{row?.name || '—'}</td>
                <td>{row?.brand || '—'}</td>
                <td>{Number(row?.price || 0).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽</td>
                <td>{Number(row?.count || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
