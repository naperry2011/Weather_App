'use client'

interface TaskProgressChartProps {
  data: {
    labels: string[]
    completed: number[]
    added: number[]
  }
}

export default function TaskProgressChart({ data }: TaskProgressChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Task Progress</h2>
      <div className="h-64 flex items-end justify-between gap-2">
        {data.labels.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex flex-col gap-1">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(data.completed[index] / 10) * 100}px` }}
              />
              <div 
                className="w-full bg-gray-300 dark:bg-gray-600"
                style={{ height: `${(data.added[index] / 10) * 100}px` }}
              />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Added</span>
        </div>
      </div>
    </div>
  )
} 