'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ResourcesView from '@/components/ResourcesView'
import { User } from '@supabase/supabase-js'

interface Resource {
  id: string
  title: string
  url: string
  description?: string
  category: string
}

export default function ResourcesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
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
        
        // Load resources data
        const { data: resourcesData } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: true })

        setResources(resourcesData || [])
      } catch (err) {
        console.error('Error loading resources:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Resources laden...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <ResourcesView resources={resources} />
}
