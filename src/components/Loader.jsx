const Loader = () => {
  return (
    <div
      className="container py-5"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Загрузка данных"
    >
      <div className="d-flex justify-content-center align-items-center text-secondary">
        <div className="spinner-border me-3" aria-hidden="true" />
        <span>Загрузка данных...</span>
      </div>
    </div>
  )
}

export default Loader
