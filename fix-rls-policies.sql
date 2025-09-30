-- Fix RLS Policies voor Progress Table
-- Run deze SQL in je Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;

-- Create new policies
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Test the policies by checking if we can insert
-- This should work now for authenticated users
