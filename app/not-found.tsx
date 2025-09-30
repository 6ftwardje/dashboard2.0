import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-dark-900 rounded-2xl shadow-2xl p-8">
          <div className="text-primary-500 mb-6">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-dark-300 mb-4">
            Pagina niet gevonden
          </h2>
          
          <p className="text-dark-400 mb-8">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Ga naar Dashboard
            </Link>
            
            <Link
              href="/login"
              className="block w-full bg-dark-800 hover:bg-dark-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Terug naar Login
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dark-800">
            <p className="text-dark-500 text-sm">
              Cryptoriez Dashboard v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
