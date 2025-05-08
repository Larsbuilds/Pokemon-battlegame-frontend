export default function LoadingSpinner({ size = 'medium', color = 'blue' }) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  }

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
    </div>
  )
} 