import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { loadAnalogueGoods, setSelectedBrand } from '../features/parts/partsSlice'
import {
  selectBrandError,
  selectBrands,
  selectHasEmptyGoods,
  selectHasServerError,
  selectIsBrandLoading,
  selectSearch,
  selectSelectedBrand,
} from '../features/parts/partsSelectors'
import Loader from './Loader'
import { ERROR_MESSAGES } from '../constants/errorMessages'

const BrandsList = () => {
  const dispatch = useDispatch()
  const brands = useSelector(selectBrands)
  const selectedBrand = useSelector(selectSelectedBrand)
  const error = useSelector(selectBrandError)
  const search = useSelector(selectSearch)
  const hasEmptyGoods = useSelector(selectHasEmptyGoods)
  const hasServerError = useSelector(selectHasServerError)
  const isLoading = useSelector(selectIsBrandLoading)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  const cancelCurrentRequest = () => {
    if (!abortControllerRef.current) return

    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }

  const handleBrandClick = (brand) => {
    cancelCurrentRequest()
    abortControllerRef.current = new AbortController()

    dispatch(setSelectedBrand(brand))
    dispatch(
      loadAnalogueGoods({
        number: search,
        brand,
        signal: abortControllerRef.current.signal,
      }),
    )
  }

  const hasBrands = brands.length > 0

  return (
    <div className="mb-4" aria-live="polite">
      {isLoading && <Loader />}

      {hasServerError && (
        <div
          className="alert alert-danger py-3 px-4 mb-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {error}
        </div>
      )}

      {hasEmptyGoods && (
        <div role="status" aria-live="polite" aria-atomic="true">
          <div className="alert alert-warning text-center py-3 fw-semibold mb-0">
            <span className="visually-hidden">Нет результатов.</span>
            {ERROR_MESSAGES.NO_BRANDS_FOUND}
          </div>
        </div>
      )}

      {hasBrands && (
        <>
          <div className="fw-semibold mb-3">Бренды</div>
          <div className="d-flex flex-wrap gap-2">
            {brands.map((brand) => {
              const isSelected = selectedBrand === brand

              return (
                <button
                  key={brand}
                  type="button"
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleBrandClick(brand)}
                  aria-pressed={isSelected}
                  aria-label={`Выбрать бренд ${brand}`}
                >
                  {brand}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default BrandsList