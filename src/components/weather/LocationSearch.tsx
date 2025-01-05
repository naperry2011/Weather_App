'use client'

import { useState, useEffect, useRef } from 'react'
import { weatherService } from '@/utils/weatherService'
import { useTheme } from '@/context/ThemeContext'

interface Location {
  name: string
  region: string
  country: string
  lat: number
  lon: number
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [geolocating, setGeolocating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 3) {
        setLocations([])
        return
      }

      setIsLoading(true)
      try {
        const results = await weatherService.searchLocations(query)
        setLocations(results)
        setShowDropdown(true)
      } catch (error) {
        console.error('Error searching locations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchLocations, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleLocationClick = (location: Location) => {
    const locationString = `${location.name}${location.region ? `, ${location.region}` : ''}, ${location.country}`
    setQuery(locationString)
    onLocationSelect(locationString)
    setShowDropdown(false)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const locationData = await weatherService.reverseGeocode(latitude, longitude)
          if (locationData) {
            const locationString = `${locationData.name}${locationData.region ? `, ${locationData.region}` : ''}, ${locationData.country}`
            setQuery(locationString)
            onLocationSelect(locationString)
          }
        } catch (error) {
          console.error('Error getting location:', error)
          alert('Failed to get your location. Please try again.')
        } finally {
          setGeolocating(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please check your permissions.')
        setGeolocating(false)
      }
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <button
          onClick={getCurrentLocation}
          disabled={geolocating}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use my location"
        >
          {geolocating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {showDropdown && locations.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {locations.map((location, index) => (
            <button
              key={`${location.lat}-${location.lon}-${index}`}
              onClick={() => handleLocationClick(location)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 dark:text-white"
            >
              <div className="font-medium">
                {location.name}
                {location.region && <span className="text-gray-600 dark:text-gray-300">, {location.region}</span>}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{location.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 