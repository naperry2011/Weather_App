'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SignOutButton from '../auth/SignOutButton'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ThemeToggle from '../theme/ThemeToggle'

export default function Navigation() {
  const pathname = usePathname()
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

  const navItems = [
    { href: '/', label: 'Weather', icon: '🌤️' },
    { href: '/tasks', label: 'Tasks', icon: '📝' },
    { href: '/calendar', label: 'Calendar', icon: '📅' }
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
              WeatherTask
            </Link>
            {session && (
              <div className="flex space-x-4 ml-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors duration-200
                      ${pathname === item.href
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
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