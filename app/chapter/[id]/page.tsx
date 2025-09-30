'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ChapterView from '@/components/ChapterView'
import { User } from '@supabase/supabase-js'

interface Chapter {
  id: string
  title: string
  description?: string
  order: number
  video_url?: string
  content?: string
}

interface ChapterPageProps {
  params: {
    id: string
  }
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check authentication
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/login')
          return
        }
        
        setUser(user)
        
        // Load chapter data
        const { data: chapterData } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!chapterData) {
          router.push('/dashboard')
          return
        }

        setChapter(chapterData)
      } catch (err) {
        console.error('Error loading chapter:', err)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Hoofdstuk laden...</p>
        </div>
      </div>
    )
  }

  if (!user || !chapter) {
    return null
  }

  return <ChapterView chapter={chapter} user={user} />
}
