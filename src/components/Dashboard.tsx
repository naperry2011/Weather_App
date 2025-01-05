'use client'

import { useState } from 'react'
import WeatherDisplay from './weather/WeatherDisplay'
import TaskManager from './tasks/TaskManager'
import TaskCalendar from './tasks/TaskCalendar'
import TaskReminders from './tasks/TaskReminders'

export default function Dashboard() {
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 space-y-4 sm:space-y-6">
      {/* Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="relative">
          <WeatherDisplay />
        </div>
        <div className="h-full">
          <TaskReminders />
        </div>
      </div>

      {/* Tasks and Calendar Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6">
        <TaskManager />
        <div className="space-y-3 sm:space-y-4">
          <TaskCalendar 
            onNoteSelect={setSelectedNote}
            selectedNote={selectedNote}
          />
        </div>
      </div>
    </div>
  )
} 