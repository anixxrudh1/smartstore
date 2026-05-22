import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-2xl bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{String(this.state.error)}</pre>
            <div className="mt-4">
              <button onClick={() => location.reload()} className="px-4 py-2 bg-emerald-600 text-white rounded">
                Reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
