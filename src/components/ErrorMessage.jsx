export default function ErrorMessage({ 
  error, 
  onRetry, 
  className = '',
  showRetry = true 
}) {
  const getErrorMessage = (error) => {
    if (error?.response?.status === 404) {
      return 'The requested Pokemon was not found.'
    }
    if (error?.response?.status === 429) {
      return 'Too many requests. Please try again later.'
    }
    if (error?.message) {
      return error.message
    }
    return 'An unexpected error occurred. Please try again.'
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="text-red-500 mb-4">
        <svg 
          className="w-12 h-12 mx-auto" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Error
      </h3>
      <p className="text-gray-600 mb-4">
        {getErrorMessage(error)}
      </p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="bg-pokemon-blue text-white px-6 py-2 rounded-lg hover:bg-pokemon-blue/90 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  )
} 