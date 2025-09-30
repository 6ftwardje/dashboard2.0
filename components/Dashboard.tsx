'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface Chapter {
  id: string
  title: string
  description?: string
  order: number
  video_url?: string
  content?: string
}

interface Progress {
  chapter_id: string
  completed: boolean
  completed_at?: string
}

interface UserProgress {
  total_chapters: number
  completed_chapters: number
  progress_percentage: number
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Dashboard - Fetching chapters...') // Debug log
      
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .order('order')

      console.log('Dashboard - Chapters result:', chaptersData) // Debug log
      console.log('Dashboard - Chapters error:', chaptersError) // Debug log

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select('chapter_id, completed, completed_at')
        .eq('user_id', user.id)

      console.log('Dashboard - Progress result:', progressData) // Debug log
      console.log('Dashboard - Progress error:', progressError) // Debug log

      // Calculate progress percentage
      const totalChapters = chaptersData?.length || 0
      const completedChapters = progressData?.filter(p => p.completed).length || 0
      const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

      setChapters(chaptersData || [])
      setProgress(progressData || [])
      setUserProgress({
        total_chapters: totalChapters,
        completed_chapters: completedChapters,
        progress_percentage: progressPercentage
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const isChapterCompleted = (chapterId: string) => {
    return progress.some(p => p.chapter_id === chapterId && p.completed)
  }

  const isChapterUnlocked = (chapterIndex: number) => {
    if (chapterIndex === 0) return true // First chapter is always unlocked
    const previousChapter = chapters[chapterIndex - 1]
    return previousChapter ? isChapterCompleted(previousChapter.id) : false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Cryptoriez Dashboard</h1>
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
                className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Uitloggen
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Jouw Voortgang</h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-400">
                {userProgress?.completed_chapters || 0}/{userProgress?.total_chapters || 0}
              </p>
              <p className="text-sm text-dark-400">Hoofdstukken voltooid</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-dark-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${userProgress?.progress_percentage || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-dark-400">
            {Math.round(userProgress?.progress_percentage || 0)}% voltooid
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter, index) => {
            const completed = isChapterCompleted(chapter.id)
            const unlocked = isChapterUnlocked(index)
            
            return (
              <div
                key={chapter.id}
                className={`bg-dark-800 rounded-2xl p-6 transition-all duration-200 ${
                  unlocked 
                    ? 'hover:bg-dark-750 hover:shadow-lg cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      completed 
                        ? 'bg-green-500 text-white' 
                        : unlocked 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-dark-600 text-dark-400'
                    }`}>
                      {completed ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{chapter.title}</h3>
                      <p className="text-sm text-dark-400">Hoofdstuk {chapter.order}</p>
                    </div>
                  </div>
                  
                  {completed && (
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      Voltooid
                    </div>
                  )}
                </div>

                {chapter.description && (
                  <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                    {chapter.description}
                  </p>
                )}

                {unlocked ? (
                  <Link
                    href={`/chapter/${chapter.id}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    {completed ? 'Bekijk opnieuw' : 'Start hoofdstuk'}
                  </Link>
                ) : (
                  <div className="w-full bg-dark-700 text-dark-400 text-center py-2 px-4 rounded-lg font-medium">
                    🔒 Vergrendeld
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {chapters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Geen hoofdstukken beschikbaar</h3>
            <p className="text-dark-400">Er zijn momenteel geen hoofdstukken beschikbaar. Neem contact op met de beheerder.</p>
          </div>
        )}
      </main>
    </div>
  )
}
