'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'

interface Chapter {
  id: string
  title: string
  description?: string
  order: number
  video_url?: string
  content?: string
}

interface ChapterViewProps {
  chapter: Chapter
  user: User
}

export default function ChapterView({ chapter, user }: ChapterViewProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { addToast } = useToast()

  useEffect(() => {
    checkCompletionStatus()
  }, [])

  const checkCompletionStatus = async () => {
    try {
      const { data } = await supabase
        .from('progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('chapter_id', chapter.id)
        .single()

      setIsCompleted(data?.completed || false)
    } catch (error) {
      console.error('Error checking completion status:', error)
    }
  }

  const handleCompleteChapter = async () => {
    if (isCompleted) return

    setLoading(true)
    setError('')

    try {
      console.log('Completing chapter:', chapter.id) // Debug log
      
      // Insert progress directly via Supabase client
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          chapter_id: chapter.id,
          completed: true,
          completed_at: new Date().toISOString()
        })

      console.log('Progress insert result:', data) // Debug log
      console.log('Progress insert error:', error) // Debug log

      if (error) {
        throw new Error(error.message)
      }

      setIsCompleted(true)
      console.log('Chapter completed successfully!') // Debug log
      
      addToast({
        type: 'success',
        title: 'Hoofdstuk voltooid!',
        message: `Je hebt "${chapter.title}" succesvol afgerond.`,
        duration: 4000
      })
    } catch (err) {
      console.error('Error completing chapter:', err) // Debug log
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{chapter.title}</h1>
              <p className="text-dark-400">Hoofdstuk {chapter.order}</p>
            </div>
            {isCompleted && (
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Voltooid
              </div>
            )}
          </div>
          
          {chapter.description && (
            <p className="text-dark-300 text-lg">{chapter.description}</p>
          )}
        </div>

        {/* Video Section */}
        <div className="bg-dark-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Video</h2>
          
          {chapter.video_url && chapter.video_url.includes('vimeo.com') ? (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-primary-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.711 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Vimeo Video</h3>
                <p className="text-dark-400 mb-4">Video wordt binnenkort toegevoegd</p>
                <p className="text-dark-500 text-sm">Placeholder voor Vimeo private embed</p>
                <p className="text-primary-400 text-sm mt-2">URL: {chapter.video_url}</p>
              </div>
            </div>
          ) : chapter.video_url ? (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Video Content</h3>
                <p className="text-dark-400 mb-4">Video wordt binnenkort toegevoegd</p>
                <p className="text-dark-500 text-sm">Placeholder voor video content</p>
                <p className="text-primary-400 text-sm mt-2">URL: {chapter.video_url}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-dark-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-dark-400">Video wordt binnenkort toegevoegd</p>
                <p className="text-dark-500 text-sm mt-2">Placeholder voor Vimeo private embed</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {chapter.content && (
          <div className="bg-dark-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Inhoud</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="text-dark-300"
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-dark-300 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-dark-300 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-dark-300 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-dark-300">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-dark-200">{children}</em>,
                  code: ({ children }) => <code className="bg-dark-700 text-primary-400 px-2 py-1 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-dark-700 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary-500 pl-4 italic text-dark-300 mb-4">{children}</blockquote>,
                  a: ({ children, href }) => <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {chapter.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Complete Chapter Button */}
        <div className="bg-dark-800 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isCompleted ? 'Hoofdstuk voltooid!' : 'Klaar met dit hoofdstuk?'}
              </h3>
              <p className="text-dark-400">
                {isCompleted 
                  ? 'Je hebt dit hoofdstuk succesvol afgerond. Ga terug naar het dashboard om het volgende hoofdstuk te starten.'
                  : 'Klik op de knop hieronder om dit hoofdstuk als voltooid te markeren.'
                }
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {!isCompleted && (
                <button
                  onClick={handleCompleteChapter}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Voltooien...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Voltooi hoofdstuk
                    </>
                  )}
                </button>
              )}
              
              <Link
                href="/dashboard"
                className="text-primary-400 hover:text-primary-300 transition-colors text-sm"
              >
                Terug naar Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
