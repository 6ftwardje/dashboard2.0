'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import LessonView from '@/components/LessonView'
import { User } from '@supabase/supabase-js'
import { Lesson } from '@/lib/types'

interface LessonPageProps {
  params: {
    id: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
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
        
        // Load lesson data
        const { data: lessonData } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!lessonData) {
          router.push('/modules')
          return
        }

        setLesson(lessonData)
      } catch (err) {
        console.error('Error loading lesson:', err)
        router.push('/modules')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Les laden...</p>
        </div>
      </div>
    )
  }

  if (!user || !lesson) {
    return null
  }

  return <LessonView lesson={lesson} user={user} />
}
