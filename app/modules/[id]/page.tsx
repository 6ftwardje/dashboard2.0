'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ModuleView from '@/components/ModuleView'
import { User } from '@supabase/supabase-js'
import { Module, Lesson } from '@/lib/types'

interface ModulePageProps {
  params: {
    id: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
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
        
        // Load module data
        const { data: moduleData } = await supabase
          .from('modules')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!moduleData) {
          router.push('/modules')
          return
        }

        setModule(moduleData)
        
        // Load lessons for this module
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', params.id)
          .order('order')

        setLessons(lessonsData || [])
      } catch (err) {
        console.error('Error loading module:', err)
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
          <p className="text-dark-400">Module laden...</p>
        </div>
      </div>
    )
  }

  if (!user || !module) {
    return null
  }

  return <ModuleView module={module} lessons={lessons} user={user} />
}
