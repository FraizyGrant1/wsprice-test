import DataTable from './DataTable'
import { ERROR_MESSAGES } from '../constants/errorMessages'

const OffersList = ({ originals = [], analogues = [] }) => (
  <>
    <DataTable
      title="Оригинальная деталь"
      rows={originals}
      variant="primary"
      showZeroPrice
    />
    <DataTable
      title="Аналоги"
      rows={analogues}
      emptyMessage={ERROR_MESSAGES.NO_ANALOGUES_FOUND}
    />
  </>
)

export default OffersList
