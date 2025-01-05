import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Dashboard from '@/components/Dashboard'
import SignIn from '@/components/SignIn'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Weather and Tasks,{' '}
            <span className="text-blue-600 dark:text-blue-400">All in One Place</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Stay organized and weather-ready with our all-in-one platform.
          </p>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sign in to access your dashboard
            </p>
          </div>
          
          <SignIn />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:text-blue-600">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-2">🌤️</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Weather Forecasts</h3>
            <p className="text-gray-600 dark:text-gray-300">Real-time weather updates and 5-day forecasts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Task Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Organize tasks with priorities and due dates</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Calendar Integration</h3>
            <p className="text-gray-600 dark:text-gray-300">View tasks and weather in calendar format</p>
          </div>
        </div>
      </div>

      <footer className="bg-white dark:bg-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © 2024 WeatherTask. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 