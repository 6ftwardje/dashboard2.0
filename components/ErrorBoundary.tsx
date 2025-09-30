'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-900 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-primary-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Oeps! Er is iets misgegaan
          </h1>
          
          <p className="text-dark-400 mb-6">
            Er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Probeer opnieuw
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-dark-800 hover:bg-dark-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Terug naar Dashboard
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-dark-400 cursor-pointer text-sm">
                Technische details
              </summary>
              <pre className="mt-2 text-xs text-dark-500 bg-dark-800 p-3 rounded overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
