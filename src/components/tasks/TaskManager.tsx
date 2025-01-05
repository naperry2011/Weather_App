'use client'

import { useState } from 'react'
import TaskList from './TaskList'
import TaskDashboard from './TaskDashboard'
import TaskCalendar from './TaskCalendar'
import TaskReminders from './TaskReminders'

type TabType = 'list' | 'dashboard' | 'calendar' | 'reminders'

export default function TaskManager() {
  const [activeTab, setActiveTab] = useState<TabType>('list')

  const tabs = [
    { id: 'list', label: 'Task List', icon: '📝' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'reminders', label: 'Reminders', icon: '🔔' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {tab.icon} {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {activeTab === 'list' && <TaskList />}
        {activeTab === 'dashboard' && <TaskDashboard />}
        {activeTab === 'calendar' && <TaskCalendar />}
        {activeTab === 'reminders' && <TaskReminders />}
      </div>
    </div>
  )
} 