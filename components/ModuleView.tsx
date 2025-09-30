'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Module, Lesson } from '@/lib/types'
import Navigation from '@/components/Navigation'

interface ModuleViewProps {
  module: Module
  lessons: Lesson[]
  user: User
}

export default function ModuleView({ module, lessons, user }: ModuleViewProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const { data: progressData } = await supabase
        .from('progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      const completed = new Set(progressData?.map(p => p.lesson_id) || [])
      setCompletedLessons(completed)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.has(lessonId)
  }

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true // First lesson is always unlocked
    
    const previousLesson = lessons[lessonIndex - 1]
    if (!previousLesson) return false
    
    return isLessonCompleted(previousLesson.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Module laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/modules" className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Cryptoriez</h1>
                  <p className="text-xs text-dark-400">Cursus Dashboard</p>
                </div>
              </Link>
            </div>
            
            <Navigation userEmail={user.email} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <div className="bg-dark-900 rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Module {module.order}: {module.title}
          </h1>
          <p className="text-dark-400">
            {lessons.length} lessen beschikbaar
          </p>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id)
            const unlocked = isLessonUnlocked(index)
            
            return (
              <div
                key={lesson.id}
                className={`bg-dark-900 rounded-2xl p-6 transition-all duration-200 ${
                  unlocked 
                    ? 'hover:bg-dark-800 hover:shadow-lg cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      completed 
                        ? 'bg-green-500 text-white' 
                        : unlocked
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-dark-400'
                    }`}>
                      {completed ? '✓' : lesson.order}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Les {lesson.order}: {lesson.title}
                      </h3>
                      {lesson.content && (
                        <p className="text-dark-400 text-sm line-clamp-2">
                          {lesson.content.replace(/[#*`]/g, '').substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {completed && (
                      <div className="text-green-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {unlocked ? (
                      <Link
                        href={`/lessons/${lesson.id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        {completed ? 'Bekijk opnieuw' : 'Start les'}
                      </Link>
                    ) : (
                      <div className="bg-dark-800 text-dark-400 px-4 py-2 rounded-lg font-medium">
                        🔒 Vergrendeld
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Module Progress Summary */}
        <div className="mt-8 bg-dark-900 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Module Voortgang</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-dark-400">
                {Array.from(completedLessons).length} van {lessons.length} lessen voltooid
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                {lessons.length > 0 ? Math.round((Array.from(completedLessons).length / lessons.length) * 100) : 0}%
              </p>
            </div>
          </div>
          
          <div className="w-full bg-dark-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${lessons.length > 0 ? (Array.from(completedLessons).length / lessons.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  )
}
