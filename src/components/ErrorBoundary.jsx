import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                We're sorry, but there was an error loading this page. Please try refreshing or go back to the home page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-pokemon-blue text-white px-6 py-2 rounded-lg hover:bg-pokemon-blue/90 transition-colors duration-200 mr-4"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 