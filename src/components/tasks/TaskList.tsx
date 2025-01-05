'use client'

import { useState } from 'react'
import { Task } from '@/types/task'

interface TaskListProps {
  tasks?: Task[]
  showFilters?: boolean
}

export default function TaskList({ tasks = [], showFilters = false }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {filteredTasks.map(task => (
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

      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {searchQuery ? 'No tasks found matching your search' : 'No tasks found'}
        </div>
      )}
    </div>
  )
} 