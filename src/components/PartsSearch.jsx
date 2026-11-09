import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearBrands, loadBrandsByNumber, setSearch } from '../features/parts/partsSlice'
import { selectSearch } from '../features/parts/partsSelectors'
import { ERROR_MESSAGES } from '../constants/errorMessages'

const PART_REGEX = /^[A-Za-z0-9]*$/

const PartsSearch = () => {
  const dispatch = useDispatch()
  const search = useSelector(selectSearch)
  const timerRef = useRef(null)
  const abortControllerRef = useRef(null)
  const [isInputInvalid, setIsInputInvalid] = useState(false)

  const cancelDebouncedSearch = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  useEffect(() => {
    const normalizedSearch = search.trim()

    cancelDebouncedSearch()

    if (!normalizedSearch) {
      cancelRequest()
      dispatch(clearBrands())
      return undefined
    }

    if (!PART_REGEX.test(normalizedSearch)) {
      cancelRequest()
      return undefined
    }

    abortControllerRef.current = new AbortController()

    timerRef.current = setTimeout(() => {
      dispatch(loadBrandsByNumber({ number: normalizedSearch, signal: abortControllerRef.current.signal }))
      timerRef.current = null
    }, 500)

    return () => {
      cancelDebouncedSearch()
      cancelRequest()
    }
  }, [dispatch, search])

  const handleChange = (event) => {
    const value = event.target.value
    const isInvalid = !PART_REGEX.test(value)

    if (isInvalid) {
      setIsInputInvalid(true)
      event.target.setCustomValidity(ERROR_MESSAGES.INVALID_PART_NUMBER)
      event.target.reportValidity()
      return
    }

    setIsInputInvalid(false)
    event.target.setCustomValidity('')
    dispatch(setSearch(value))
  }

  return (
    <div className="mb-4">
      <label htmlFor="article-search" className="form-label fw-semibold d-block mb-2">
        Номер детали:
      </label>

      <input
        id="article-search"
        type="text"
        inputMode="text"
        pattern="[A-Za-z0-9]*"
        className="form-control"
        value={search}
        onChange={handleChange}
        placeholder="Введите номер детали"
        aria-label="Поиск запчасти по номеру"
        aria-invalid={isInputInvalid}
        aria-describedby={isInputInvalid ? 'article-search-error' : 'article-search-help'}
        aria-live="polite"
      />

      <div id="article-search-help" className="form-text mt-2" aria-live="polite">
        Используйте цифры и латинские буквы.
      </div>

      {isInputInvalid && (
        <div
          id="article-search-error"
          className="mt-2 alert alert-danger py-2 px-3 mb-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {ERROR_MESSAGES.INVALID_PART_NUMBER}
        </div>
      )}
    </div>
  )
}

export default PartsSearch