'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Module, ModuleProgress, UserProgress } from '@/lib/types'

interface ModulesViewProps {
  user: User
}

export default function ModulesView({ user }: ModulesViewProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModulesData()
  }, [])

  const fetchModulesData = async () => {
    try {
      console.log('ModulesView - Fetching modules...')
      
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('order')

      console.log('Modules data:', modulesData)
      console.log('Modules error:', modulesError)

      if (modulesError) {
        throw modulesError
      }

      setModules(modulesData || [])

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      console.log('Progress data:', progressData)
      console.log('Progress error:', progressError)

      if (progressError) {
        throw progressError
      }

      const completedLessonIds = new Set(progressData?.map(p => p.lesson_id) || [])

      // Calculate progress for each module
      const moduleProgressData: ModuleProgress[] = []
      let totalLessons = 0
      let completedLessons = 0

      for (const module of modulesData || []) {
        // Get lessons count for this module
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

      // Calculate overall user progress
      const overallProgressPercentage = totalLessons > 0 
        ? (completedLessons / totalLessons) * 100 
        : 0

      setUserProgress({
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        progress_percentage: overallProgressPercentage
      })

    } catch (error) {
      console.error('Error fetching modules data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress.find(mp => mp.module_id === moduleId)
  }

  const isModuleUnlocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return true // First module is always unlocked
    
    const previousModule = modules[moduleIndex - 1]
    if (!previousModule) return false
    
    const prevProgress = getModuleProgress(previousModule.id)
    return prevProgress ? prevProgress.progress_percentage > 0 : false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Modules laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Cryptoriez Cursus</h1>
              <p className="text-dark-400">Welkom terug, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/resources"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Belangrijke Links
              </Link>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-dark-900 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Jouw Voortgang</h2>
              <p className="text-sm text-dark-400">
                {userProgress?.completed_lessons || 0} van {userProgress?.total_lessons || 0} lessen voltooid
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-dark-800 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${userProgress?.progress_percentage || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-dark-400">
            {Math.round(userProgress?.progress_percentage || 0)}% voltooid
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module.id)
            const unlocked = isModuleUnlocked(index)
            const isCompleted = progress ? progress.progress_percentage === 100 : false
            
            return (
              <div
                key={module.id}
                className={`bg-dark-900 rounded-2xl p-6 transition-all duration-200 ${
                  unlocked 
                    ? 'hover:bg-dark-800 hover:shadow-lg cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : progress && progress.completed_lessons > 0
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-dark-400'
                    }`}>
                      {isCompleted ? '✓' : progress ? progress.completed_lessons : '0'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Module {module.order}: {module.title}
                      </h3>
                      <p className="text-sm text-dark-400">
                        {progress ? `${progress.completed_lessons}/${progress.total_lessons} lessen` : '0 lessen'}
                      </p>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="text-green-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Module Progress Bar */}
                {progress && progress.total_lessons > 0 && (
                  <div className="mb-4">
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress.progress_percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">
                      {Math.round(progress.progress_percentage)}% voltooid
                    </p>
                  </div>
                )}

                {unlocked ? (
                  <Link
                    href={`/modules/${module.id}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    {isCompleted ? 'Bekijk opnieuw' : 'Start module'}
                  </Link>
                ) : (
                  <div className="w-full bg-dark-800 text-dark-400 text-center py-2 px-4 rounded-lg font-medium">
                    🔒 Vergrendeld
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
