'use client'

import { useState } from 'react'
import { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [progress, setProgress] = useState(task.progress)

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const handleProgressChange = async (newProgress: number) => {
    setProgress(newProgress)
    await onUpdate(task.id, {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : task.status
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold dark:text-white">{task.title}</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-2">{task.description}</p>

      <div className="flex items-center gap-4 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Category: {task.category}
        </span>
        {task.dueDate && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => handleProgressChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {progress}%
        </span>
      </div>
    </div>
  )
} 