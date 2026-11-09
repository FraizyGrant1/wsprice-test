const EmptyState = ({ message, className = '' }) => (
  <div
    className={`mt-4 ${className}`}
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <div className="alert alert-warning mb-0">
      <span className="visually-hidden">Нет результатов.</span>
      {message}
    </div>
  </div>
)

export default EmptyState
