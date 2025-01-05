'use client'

import { TaskCategory, TaskPriority } from '@/types/task'

interface TaskStatisticsProps {
  stats: {
    categoryDistribution: Record<TaskCategory, number>
    priorityDistribution: Record<TaskPriority, number>
  }
}

export default function TaskStatistics({ stats }: TaskStatisticsProps) {
  const categoryColors = {
    personal: 'bg-blue-200 dark:bg-blue-900',
    work: 'bg-green-200 dark:bg-green-900',
    shopping: 'bg-yellow-200 dark:bg-yellow-900',
    health: 'bg-red-200 dark:bg-red-900',
    other: 'bg-purple-200 dark:bg-purple-900'
  }

  const priorityColors = {
    low: 'bg-green-200 dark:bg-green-900',
    medium: 'bg-yellow-200 dark:bg-yellow-900',
    high: 'bg-red-200 dark:bg-red-900'
  }

  const total = Object.values(stats.categoryDistribution).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Task Distribution</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">By Category</h3>
          <div className="space-y-2">
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                  <span className="text-gray-600 dark:text-gray-400">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${categoryColors[category as TaskCategory]} h-2 rounded-full`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">By Priority</h3>
          <div className="space-y-2">
            {Object.entries(stats.priorityDistribution).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{priority}</span>
                  <span className="text-gray-600 dark:text-gray-400">{count}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${priorityColors[priority as TaskPriority]} h-2 rounded-full`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 