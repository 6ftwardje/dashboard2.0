import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { chapterId } = await request.json()
  
  // Get user from Authorization header
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  // Verify token and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  
  // Check if chapter is already completed
  const { data: existingProgress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('chapter_id', chapterId)
    .single()
  
  if (existingProgress) {
    return NextResponse.json({ message: 'Chapter already completed' })
  }
  
  // Mark chapter as completed
  const { error } = await supabase
    .from('progress')
    .insert({
      user_id: user.id,
      chapter_id: chapterId,
      completed: true,
      completed_at: new Date().toISOString()
    })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Chapter completed successfully' })
}
