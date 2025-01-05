'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import { taskService } from '@/utils/taskService'

export default function TaskReminders() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUpcomingTasks()
  }, [])

  const loadUpcomingTasks = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const nextWeek = new Date(now.setDate(now.getDate() + 7))
      const tasks = await taskService.getTasksByDueDate(
        new Date().toISOString(),
        nextWeek.toISOString()
      )
      setUpcomingTasks(tasks)
    } catch (error) {
      console.error('Error loading upcoming tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Upcoming Tasks</h2>
      
      <div className="space-y-4">
        {upcomingTasks.map(task => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-700 rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold dark:text-white">{task.title}</h3>
              <span className={`
                px-2 py-1 rounded-full text-sm
                ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}
              `}>
                {task.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {task.description}
            </p>
            
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Due: {new Date(task.due_date!).toLocaleDateString()}</span>
              <span>Category: {task.category}</span>
              <span>Progress: {task.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 