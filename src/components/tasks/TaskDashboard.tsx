'use client'

import { useState, useEffect } from 'react'
import { taskService } from '@/utils/taskService'
import { Task } from '@/types/task'
import TaskStatistics from './TaskStatistics'
import TaskProgressChart from './TaskProgressChart'
import TaskFilters from './TaskFilters'
import TaskList from './TaskList'
import StatCard from './StatCard'

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: undefined,
    status: undefined,
    priority: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  useEffect(() => {
    loadDashboardData()
  }, [filters])

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Task Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon="📋"
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon="✅"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingTasks}
          icon="📅"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          icon="⚠️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskStatistics stats={stats} />
        <TaskProgressChart data={progress} />
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <TaskList tasks={tasks} />
    </div>
  )
} 