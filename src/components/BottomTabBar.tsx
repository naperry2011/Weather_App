'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Cloud, ListTodo } from 'lucide-react'

export default function BottomTabBar() {
  const pathname = usePathname()

  const tabs = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="w-6 h-6" />,
    },
    {
      href: '/tasks',
      label: 'Tasks',
      icon: <ListTodo className="w-6 h-6" />,
    },
    {
      href: '/calendar',
      label: 'Calendar',
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      href: '/weather',
      label: 'Weather',
      icon: <Cloud className="w-6 h-6" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:hidden">
      <nav className="flex justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center py-2 px-3 ${
              pathname === tab.href
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
