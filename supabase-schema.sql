-- Supabase Database Schema voor Cryptoriez Dashboard
-- Run deze SQL in je Supabase SQL Editor

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL UNIQUE,
  video_url TEXT,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Chapters: Everyone can read active chapters
CREATE POLICY "Chapters are viewable by authenticated users" ON chapters
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Resources: Everyone can read active resources
CREATE POLICY "Resources are viewable by authenticated users" ON resources
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Functions for progress calculation
CREATE OR REPLACE FUNCTION get_user_progress(user_uuid UUID)
RETURNS TABLE (
  total_chapters INTEGER,
  completed_chapters INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(c.id)::INTEGER as total_chapters,
    COUNT(p.id)::INTEGER as completed_chapters,
    CASE 
      WHEN COUNT(c.id) = 0 THEN 0
      ELSE ROUND((COUNT(p.id)::NUMERIC / COUNT(c.id)::NUMERIC) * 100, 2)
    END as progress_percentage
  FROM chapters c
  LEFT JOIN progress p ON c.id = p.chapter_id AND p.user_id = user_uuid AND p.completed = true
  WHERE c.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next unlocked chapter
CREATE OR REPLACE FUNCTION get_next_unlocked_chapter(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  next_chapter_id UUID;
BEGIN
  SELECT c.id INTO next_chapter_id
  FROM chapters c
  LEFT JOIN progress p ON c.id = p.chapter_id AND p.user_id = user_uuid AND p.completed = true
  WHERE c.is_active = true
  AND p.id IS NULL
  ORDER BY c.order_index
  LIMIT 1;
  
  RETURN next_chapter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user_chapter ON progress(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(completed);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
