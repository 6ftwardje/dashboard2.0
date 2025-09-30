'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Dashboard from '@/components/Dashboard'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Dashboard - Checking user session...') // Debug log
        
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log('Dashboard - User check result:', user ? `User: ${user.email}` : 'No user') // Debug log
        console.log('Dashboard - Error:', error) // Debug log
        
        if (error) {
          console.error('Dashboard - Auth error:', error) // Debug log
          router.push('/login')
          return
        }
        
        if (!user) {
          console.log('Dashboard - No user, redirecting to login') // Debug log
          router.push('/login')
          return
        }
        
        console.log('Dashboard - User found, setting user state') // Debug log
        setUser(user)
      } catch (err) {
        console.error('Dashboard - Exception:', err) // Debug log
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

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

  if (!user) {
    return null // Will redirect to login
  }

  return <Dashboard user={user} />
}
