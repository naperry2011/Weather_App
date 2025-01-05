import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import { ThemeProvider } from '@/context/ThemeContext'
import { TemperatureProvider } from '@/context/TemperatureContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WeatherTask Dashboard',
  description: 'Your personal weather and task management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <ThemeProvider>
          <TemperatureProvider>
            <Navigation />
            <main className="flex-grow pt-16">
              {children}
            </main>
          </TemperatureProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 