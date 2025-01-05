export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  isRecurring: boolean
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
    daysOfWeek?: number[]
  }
  location?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface WeatherIntegration {
  weatherAlert?: boolean
  minTemperature?: number
  maxTemperature?: number
  conditions?: string[]
}

export type CalendarView = 'month' | 'week' | 'day' | 'agenda' 