// Types for the new modules/lessons structure
export interface Module {
  id: string
  title: string
  order: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  order: number
  video_url?: string
  content?: string
  created_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Resource {
  id: string
  title: string
  url: string
  created_at: string
}

export interface ModuleProgress {
  module_id: string
  total_lessons: number
  completed_lessons: number
  progress_percentage: number
}

export interface UserProgress {
  total_lessons: number
  completed_lessons: number
  progress_percentage: number
}
