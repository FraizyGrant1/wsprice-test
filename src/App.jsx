import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import PartsSearch from './components/PartsSearch'
import BrandsList from './components/BrandsList'
import Loader from './components/Loader'
import OffersList from './components/OffersList'
import {
  selectAnalogueError,
  selectAnalogueStatus,
  selectAnalogues,
  selectOriginals,
  selectShouldShowBrandList,
} from './features/parts/partsSelectors'

const App = () => {
  const originals = useSelector(selectOriginals)
  const analogues = useSelector(selectAnalogues)
  const analogueStatus = useSelector(selectAnalogueStatus)
  const analogueError = useSelector(selectAnalogueError)
  const shouldShowBrandList = useSelector(selectShouldShowBrandList)

  useEffect(() => {
    document.title = 'Поиск запчастей'

    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      document.head.appendChild(descriptionMeta)
    }

    descriptionMeta.content =
      'Поиск оригинальных и аналоговых запчастей по номеру детали, бренду и остаткам.'
  }, [])

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <header className="mb-4 text-center">
                <p className="text-uppercase text-secondary mb-2" style={{ letterSpacing: '0.12em', fontSize: '0.74rem' }}>
                  Parts catalog
                </p>
                <h1 className="mb-0">Поиск запчастей</h1>
              </header>

              <PartsSearch />

              {shouldShowBrandList && <BrandsList />}

              {analogueStatus === 'loading' && <Loader />}

              {analogueError && (
                <div
                  className="mt-3 alert alert-danger py-3 px-4 mb-3"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">Ошибка</span>
                    <span className="opacity-75">•</span>
                    <span>{analogueError}</span>
                  </div>
                </div>
              )}

              {analogueStatus === 'succeeded' && (
                <OffersList originals={originals} analogues={analogues} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App