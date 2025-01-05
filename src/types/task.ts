export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  category: TaskCategory
  due_date?: string
  status: TaskStatus
  progress: number
  user_id: string
  created_at: string
  updated_at: string
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'> 