import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Task, TaskCategory, TaskStatus, TaskPriority } from '@/types/task'

interface TaskFilters {
  category?: TaskCategory
  status?: TaskStatus
  priority?: TaskPriority
  startDate?: string
  endDate?: string
  sortBy?: 'due_date' | 'priority' | 'status'
  sortOrder: 'asc' | 'desc'
  search?: string
}

const supabase = createClientComponentClient()

export const taskService = {
  async createTask(task: NewTask): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        user_id: user.id,
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) throw error
  },

  async getTasks(): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTasksByCategory(category: Task['category']): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getTasksByDueDate(startDate: string, endDate: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getTasksWithFilters(filters: TaskFilters): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)

    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority)
    }
    if (filters.startDate) {
      query = query.gte('due_date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('due_date', filters.endDate)
    }
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  },

  async getTaskStatistics(): Promise<{
    totalTasks: number;
    completedTasks: number;
    upcomingTasks: number;
    overdueTasks: number;
    categoryDistribution: Record<TaskCategory, number>;
    priorityDistribution: Record<TaskPriority, number>;
  }> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')

    if (error) throw error

    const now = new Date()
    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      upcomingTasks: tasks.filter(t => t.due_date && new Date(t.due_date) > now).length,
      overdueTasks: tasks.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== 'completed').length,
      categoryDistribution: tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      }, {} as Record<TaskCategory, number>),
      priorityDistribution: tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      }, {} as Record<TaskPriority, number>)
    }

    return stats
  },

  async getTaskProgress(timeframe: 'week' | 'month' | 'year'): Promise<{
    labels: string[];
    completed: number[];
    added: number[];
  }> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')

    if (error) throw error

    // Implementation depends on your specific requirements
    // This is a basic example for weekly progress
    const progress = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      completed: [0, 0, 0, 0, 0, 0, 0],
      added: [0, 0, 0, 0, 0, 0, 0]
    }

    // Process tasks and populate the progress object
    // ... implementation details

    return progress
  }
} 