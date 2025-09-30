'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DebugLogin() {
  const [email, setEmail] = useState('demo@cryptoriez.com')
  const [password, setPassword] = useState('demo123')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      console.log('Environment check:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
      })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setResult(`Error: ${error.message}`)
        console.error('Login error:', error)
      } else {
        setResult(`Success! User: ${data.user?.email}`)
        console.log('Login success:', data)
      }
    } catch (err) {
      setResult(`Exception: ${err}`)
      console.error('Login exception:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="bg-dark-900 rounded-2xl p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Debug Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-white"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white py-2 px-4 rounded"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Test Redirect to Dashboard
          </button>
          
          {result && (
            <div className="bg-dark-800 p-3 rounded text-sm">
              <pre className="text-white whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
