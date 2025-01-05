'use client'

import { useState, useEffect } from 'react'
import { taskService } from '@/utils/taskService'
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

interface TaskStats {
  total: number
  completed: number
  inProgress: number
  todo: number
}

interface TaskProgress {
  labels: string[]
  data: number[]
}

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>({
    sortOrder: 'desc'
  })
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0
  })
  const [progress, setProgress] = useState<TaskProgress>({
    labels: [],
    data: []
  })

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [filteredTasks, taskStats, taskProgress] = await Promise.all([
          taskService.getTasksWithFilters(filters),
          taskService.getTaskStatistics(),
          taskService.getTaskProgress('week')
        ])

        setTasks(filteredTasks)
        setStats(taskStats)
        setProgress(taskProgress)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [filters])

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {/* Add your filter UI components here */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
          <p className="text-2xl">{stats.total}</p>
        </div>
        {/* Add other stat cards */}
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <div className="space-y-2">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {task.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 