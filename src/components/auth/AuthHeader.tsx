'use client'

import { Session } from '@supabase/supabase-js'
import SignOutButton from './SignOutButton'
import SignIn from '../SignIn'
import ThemeToggle from '../theme/ThemeToggle'

export default function AuthHeader({ session }: { session: Session | null }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white">Weather & Task Manager</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <div className="flex items-center gap-2">
                <img 
                  src={session.user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {session.user.user_metadata.full_name || session.user.email}
                </span>
              </div>
              <SignOutButton />
            </>
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </header>
  )
} 