'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths
} from 'date-fns'
import { getHolidaysForMonth } from '@/utils/holidays'
import { CalendarEvent } from '@/types/calendar'

interface TaskCalendarProps {
  onNoteSelect?: (note: string | null) => void
  selectedNote?: string | null
}

export default function TaskCalendar({ 
  onNoteSelect = () => {}, 
  selectedNote = null 
}: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [tasks, setTasks] = useState<any[]>([])
  const supabase = createClientComponentClient()

  // Get calendar dates including padding for full weeks
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const holidays = getHolidaysForMonth(currentDate.getFullYear(), currentDate.getMonth())

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  const fetchCalendarData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = format(monthStart, 'yyyy-MM-dd')
    const endDate = format(monthEnd, 'yyyy-MM-dd')
    
    // Fetch tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('due_date', startDate)
      .lte('due_date', endDate)

    if (tasksData) {
      setTasks(tasksData)
    }

    // Fetch notes
    const { data: notesData } = await supabase
      .from('calendar_notes')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)

    if (notesData) {
      const noteMap = notesData.reduce((acc, note) => ({
        ...acc,
        [note.date]: note.content
      }), {})
      setNotes(noteMap)
    }
  }

  const handleAddNote = async (date: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('calendar_notes')
      .upsert({
        user_id: user.id,
        date,
        content
      })

    if (!error) {
      setNotes(prev => ({
        ...prev,
        [date]: content
      }))
    }
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
            className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 sm:px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
            className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-400 pb-1 sm:pb-2 text-xs sm:text-sm">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const holiday = holidays.find(h => h.date === dateStr)
          const dayTasks = tasks.filter(task => task.due_date === dateStr)
          const hasNote = notes[dateStr]
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={dateStr}
              onClick={() => onNoteSelect(dateStr)}
              className={`
                min-h-[60px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg cursor-pointer border border-gray-700
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${isToday(day) ? 'bg-blue-900/20 border-blue-500' : 'hover:bg-gray-700/50'}
                ${selectedNote === dateStr ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className={`
                text-right text-xs sm:text-sm mb-1
                ${isToday(day) ? 'text-blue-400 font-bold' : 'text-gray-400'}
              `}>
                {format(day, 'd')}
              </div>
              
              {holiday && (
                <div className="text-[10px] sm:text-xs text-red-400 font-semibold mb-1 truncate">
                  {holiday.name}
                </div>
              )}

              {dayTasks.map(task => (
                <div 
                  key={task.id} 
                  className="text-[10px] sm:text-xs bg-blue-900/30 text-blue-300 p-1 rounded mb-1 truncate"
                >
                  {task.title}
                </div>
              ))}

              {hasNote && (
                <div className="text-[10px] sm:text-xs bg-green-900/30 text-green-300 p-1 rounded truncate">
                  Note
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedNote && (
        <div className="mt-4 sm:mt-6">
          <textarea
            value={notes[selectedNote] || ''}
            onChange={(e) => handleAddNote(selectedNote, e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
            placeholder="Add a note..."
            rows={3}
            style={{ minHeight: '80px' }}
          />
        </div>
      )}
    </div>
  )
} 