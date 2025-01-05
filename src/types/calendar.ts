export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'task' | 'holiday' | 'note'
  content?: string
  status?: string
  priority?: string
}

export interface CalendarNote {
  id: string
  date: string
  content: string
  user_id: string
} 