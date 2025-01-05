'use client'

import { useTemperature } from '@/context/TemperatureContext'

export default function TemperatureToggle() {
  const { unit, toggleUnit } = useTemperature()

  return (
    <button
      onClick={toggleUnit}
      className="px-3 py-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm font-medium text-gray-700 border border-gray-200"
    >
      °{unit}
    </button>
  )
} 