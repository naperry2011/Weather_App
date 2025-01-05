import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TaskCalendar from '@/components/tasks/TaskCalendar'

export default async function CalendarPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskCalendar 
        onNoteSelect={() => {}}
        selectedNote={null}
      />
    </div>
  )
} 