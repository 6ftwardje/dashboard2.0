'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Module, ModuleProgress } from '@/lib/types'

interface NavigationProps {
  userEmail?: string
}

export default function Navigation({ userEmail }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    fetchModulesData()
  }, [])

  const fetchModulesData = async () => {
    try {
      // Fetch modules
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .order('order')

      setModules(modulesData || [])

      // Fetch user progress
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('completed', true)

        const completedLessonIds = new Set(progressData?.map(p => p.lesson_id) || [])

        // Calculate progress for each module
        const moduleProgressData: ModuleProgress[] = []
        let totalLessons = 0
        let completedLessons = 0

        for (const module of modulesData || []) {
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', module.id)

          const moduleLessons = lessonsData || []
          const moduleCompletedLessons = moduleLessons.filter(lesson => 
            completedLessonIds.has(lesson.id)
          ).length

          const progressPercentage = moduleLessons.length > 0 
            ? (moduleCompletedLessons / moduleLessons.length) * 100 
            : 0

          moduleProgressData.push({
            module_id: module.id,
            total_lessons: moduleLessons.length,
            completed_lessons: moduleCompletedLessons,
            progress_percentage: progressPercentage
          })

          totalLessons += moduleLessons.length
          completedLessons += moduleCompletedLessons
        }

        setModuleProgress(moduleProgressData)

        // Calculate overall progress
        const overallProgressPercentage = totalLessons > 0 
          ? (completedLessons / totalLessons) * 100 
          : 0

        setOverallProgress(overallProgressPercentage)
      }
    } catch (error) {
      console.error('Error fetching modules data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress.find(mp => mp.module_id === moduleId)
  }

  const isActive = (href: string) => pathname === href

  const navigation = [
    { name: 'Dashboard', href: '/modules', icon: '📊' },
    { name: 'Resources', href: '/resources', icon: '🔗' },
  ]

  const closeDrawer = () => setIsOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors touch-target"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {/* Hamburger icon */}
          <svg
            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-200`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Close icon */}
          <svg
            className={`${isOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-200`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Slide-in drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-dark-900 shadow-xl transform drawer-transition lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-800">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Cryptoriez</h1>
                <p className="text-xs text-dark-400">Cursus Dashboard</p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-md text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Section */}
          <div className="p-6 border-b border-dark-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">Voortgang</h2>
              <span className="text-primary-400 font-bold text-lg">{Math.round(overallProgress)}%</span>
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-dark-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary-500 progress-ring"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${overallProgress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{Math.round(overallProgress)}%</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-dark-400">
              {moduleProgress.reduce((acc, mp) => acc + mp.completed_lessons, 0)} van {moduleProgress.reduce((acc, mp) => acc + mp.total_lessons, 0)} lessen voltooid
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {/* Dashboard */}
              <Link
                href="/modules"
                onClick={closeDrawer}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive('/modules')
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">📊</span>
                Dashboard
              </Link>

              {/* Modules Section */}
              <div className="mt-6">
                <h3 className="px-4 py-2 text-sm font-semibold text-dark-400 uppercase tracking-wider">
                  Mijn Modules
                </h3>
                <div className="mt-2 space-y-1">
                  {modules.map((module, index) => {
                    const progress = getModuleProgress(module.id)
                    const isCompleted = progress ? progress.progress_percentage === 100 : false
                    
                    return (
                      <Link
                        key={module.id}
                        href={`/modules/${module.id}`}
                        onClick={closeDrawer}
                        className="flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors hover:bg-dark-800 group"
                      >
                        <div className="flex items-center flex-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : progress && progress.completed_lessons > 0
                              ? 'bg-primary-500 text-white'
                              : 'bg-dark-700 text-dark-400'
                          }`}>
                            {isCompleted ? '✓' : progress ? progress.completed_lessons : '0'}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium group-hover:text-primary-300">
                              Module {module.order}
                            </p>
                            <p className="text-xs text-dark-400 truncate">
                              {module.title}
                            </p>
                          </div>
                        </div>
                        
                        {/* Mini progress bar */}
                        {progress && progress.total_lessons > 0 && (
                          <div className="w-12 h-1 bg-dark-700 rounded-full ml-2">
                            <div 
                              className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progress_percentage}%` }}
                            ></div>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Resources */}
              <Link
                href="/resources"
                onClick={closeDrawer}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive('/resources')
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">🔗</span>
                Resources
              </Link>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-dark-800">
            <div className="mb-4">
              <p className="text-sm text-dark-400">Ingelogd als:</p>
              <p className="text-sm font-medium text-white truncate">{userEmail}</p>
            </div>
            <Link
              href="/logout"
              onClick={closeDrawer}
              className="flex items-center justify-center w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <span className="mr-2">🚪</span>
              Uitloggen
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:items-center lg:space-x-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              isActive(item.href)
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
            } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </Link>
        ))}
        
        {/* Desktop user menu */}
        <div className="ml-4 flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-dark-400">Voortgang</p>
            <p className="text-sm font-medium text-white">{Math.round(overallProgress)}%</p>
          </div>
          <span className="text-sm text-dark-400">{userEmail}</span>
          <Link
            href="/logout"
            className="bg-dark-800 hover:bg-dark-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Uitloggen
          </Link>
        </div>
      </div>
    </>
  )
}