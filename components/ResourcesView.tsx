'use client'

import Link from 'next/link'

interface Resource {
  id: string
  title: string
  url: string
  description?: string
  category: string
}

interface ResourcesViewProps {
  resources: Resource[]
}

export default function ResourcesView({ resources }: ResourcesViewProps) {
  // Group resources by category
  const groupedResources = resources.reduce((acc, resource) => {
    const category = resource.category || 'general'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  const categoryLabels: Record<string, string> = {
    general: 'Algemeen',
    trading: 'Trading Tools',
    analysis: 'Analyse',
    news: 'Nieuws',
    education: 'Educatie',
    community: 'Community',
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Terug naar Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/logout"
                className="bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Uitloggen
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Belangrijke Links</h1>
          <p className="text-dark-400">
            Handige tools, websites en resources voor je cryptocurrency trading journey
          </p>
        </div>

        {/* Resources by Category */}
        {Object.keys(groupedResources).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedResources).map(([category, categoryResources]) => (
              <div key={category} className="bg-dark-900 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
                  <span className="ml-2 text-sm text-dark-400 font-normal">
                    ({categoryResources.length})
                  </span>
                </h2>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryResources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-dark-800 hover:bg-dark-700 rounded-lg p-4 transition-colors duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white group-hover:text-primary-300 transition-colors mb-1">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="text-dark-400 text-sm line-clamp-2">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Geen links beschikbaar</h3>
            <p className="text-dark-400">Er zijn momenteel geen belangrijke links beschikbaar. Neem contact op met de beheerder.</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-dark-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Snelle Acties</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/dashboard"
              className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="font-medium">Dashboard</div>
              <div className="text-sm text-primary-200">Ga terug naar je leerpad</div>
            </Link>
            
            <a
              href="mailto:support@cryptoriez.com"
              className="bg-dark-700 hover:bg-dark-600 text-white p-4 rounded-lg transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">Support</div>
              <div className="text-sm text-dark-300">Neem contact op</div>
            </a>
            
            <a
              href="https://discord.gg/cryptoriez"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-700 hover:bg-dark-600 text-white p-4 rounded-lg transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <div className="font-medium">Discord</div>
              <div className="text-sm text-dark-300">Join de community</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
