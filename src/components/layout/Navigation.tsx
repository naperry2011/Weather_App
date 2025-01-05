'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import SignOutButton from '../SignOutButton'
import ThemeToggle from '../theme/ThemeToggle'

export default function Navigation() {
  const [session, setSession] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              WeatherTask
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session && (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {session.user.email}
                  </span>
                </div>
                <SignOutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 