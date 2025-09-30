'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Lesson } from '@/lib/types'
import { useToast } from '@/components/ToastProvider'
import Navigation from '@/components/Navigation'

interface LessonViewProps {
  lesson: Lesson
  user: User
}

export default function LessonView({ lesson, user }: LessonViewProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { addToast } = useToast()

  useEffect(() => {
    checkCompletion()
  }, [lesson.id])

  const checkCompletion = async () => {
    try {
      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .eq('completed', true)
        .single()

      setIsCompleted(!!progressData)
    } catch (error) {
      console.error('Error checking completion:', error)
    }
  }

  const handleCompleteLesson = async () => {
    if (isCompleted) return

    setLoading(true)
    setError('')

    try {
      console.log('Completing lesson:', lesson.id)
      
      // Insert progress directly via Supabase client
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString()
        })

      console.log('Progress insert result:', data)
      console.log('Progress insert error:', error)

      if (error) {
        throw new Error(error.message)
      }

      setIsCompleted(true)
      console.log('Lesson completed successfully!')
      
      addToast({
        type: 'success',
        title: 'Les voltooid!',
        message: `Je hebt "${lesson.title}" succesvol afgerond.`,
        duration: 4000
      })
    } catch (err) {
      console.error('Error completing lesson:', err)
      const errorMessage = err instanceof Error ? err.message : 'Er is een fout opgetreden'
      setError(errorMessage)
      
      addToast({
        type: 'error',
        title: 'Fout bij voltooien',
        message: errorMessage,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
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
        {/* Lesson Header */}
        <div className="bg-dark-900 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
              isCompleted 
                ? 'bg-green-500 text-white' 
                : 'bg-primary-500 text-white'
            }`}>
              {isCompleted ? '✓' : lesson.order}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Les {lesson.order}: {lesson.title}
              </h1>
              {isCompleted && (
                <p className="text-green-400 text-sm font-medium">✓ Voltooid</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-dark-900 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Video</h2>
          
          {lesson.video_url && lesson.video_url.includes('vimeo.com') ? (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                {/* Vimeo SVG icon */}
                <svg className="w-16 h-16 text-primary-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.053 6.37-8.349 6.37-1.409 0-2.604-1.3-3.585-3.9L5.4 8.4C4.42 5.8 3.225 4.5 1.816 4.5c-.179 0-.408.05-.686.15-.279.1-.408.25-.408.45 0 .2.129.35.408.45.279.1.507.15.686.15 1.409 0 2.604 1.3 3.585 3.9l1.549 9.585c.981 2.6 2.176 3.9 3.585 3.9 2.296 0 5.081-2.123 8.349-6.37 3.155-4.066 4.789-7.271 4.894-9.609.105-2.338-.105-4.247-.63-5.725-.525-1.478-1.26-2.227-2.196-2.227-.179 0-.408.05-.686.15-.279.1-.408.25-.408.45 0 .2.129.35.408.45.279.1.507.15.686.15.936 0 1.671.749 2.196 2.227.525 1.478.735 3.387.63 5.725z"/>
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Vimeo Video</h3>
                <p className="text-dark-400 mb-4">Video wordt binnenkort toegevoegd</p>
                <p className="text-dark-500 text-sm">Placeholder voor Vimeo private embed</p>
                <p className="text-primary-400 text-sm mt-2">URL: {lesson.video_url}</p>
              </div>
            </div>
          ) : lesson.video_url ? (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-primary-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Video</h3>
                <p className="text-dark-400 mb-4">Video wordt binnenkort toegevoegd</p>
                <p className="text-primary-400 text-sm">URL: {lesson.video_url}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-dark-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Geen Video</h3>
                <p className="text-dark-400">Deze les heeft geen video</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {lesson.content && (
          <div className="bg-dark-900 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Inhoud</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="text-dark-300"
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-dark-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-dark-300 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-dark-300 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-dark-300">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  code: ({ children }) => <code className="bg-dark-800 text-primary-400 px-2 py-1 rounded text-sm">{children}</code>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-dark-400 mb-4">{children}</blockquote>,
                }}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Complete Lesson Button */}
        <div className="bg-dark-900 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {isCompleted ? (
            <div className="text-center">
              <div className="text-green-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Les Voltooid!</h3>
              <p className="text-dark-400 mb-4">
                Je hebt deze les succesvol afgerond. Ga door naar de volgende les!
              </p>
              <Link
                href="/modules"
                className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
              >
                Terug naar Modules
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleCompleteLesson}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Voltooi les...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Voltooi les
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
