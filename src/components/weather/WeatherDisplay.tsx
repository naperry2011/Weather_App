'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { weatherService } from '@/utils/weatherService';
import { format as dateFormat } from 'date-fns';
import LocationSearch from './LocationSearch';
import TemperatureToggle from './TemperatureToggle';
import { useTemperature } from '@/context/TemperatureContext';
import ThemeToggle from '../theme/ThemeToggle';

export default function WeatherDisplay() {
  const { convertTemp, unit } = useTemperature();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('London');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user's location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const locationData = await weatherService.reverseGeocode(latitude, longitude)
            if (locationData) {
              const locationString = `${locationData.name}${locationData.region ? `, ${locationData.region}` : ''}, ${locationData.country}`
              setLocation(locationString)
            }
          } catch (error) {
            console.error('Error getting initial location:', error)
            // Fallback to default location (London)
            fetchWeatherData()
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to default location (London)
          fetchWeatherData()
        }
      )
    } else {
      // Fallback to default location if geolocation is not supported
      fetchWeatherData()
    }
  }, []) // Empty dependency array for initial load only

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(location);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation);
  };

  if (loading) return <div className="text-center p-4 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!weather) return null;

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 sm:p-6 w-full h-full">
      {/* Location and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 space-y-3 sm:space-y-0">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <div className="flex gap-2 sm:gap-4">
          <TemperatureToggle />
        </div>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{location}</h2>
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl sm:text-6xl font-bold text-white">
            {Math.round(convertTemp(weather.current.temp_c))}°{unit}
          </span>
          <img 
            src={weather.current.condition.icon} 
            alt={weather.current.condition.text}
            className="w-12 h-12 sm:w-16 sm:h-16 ml-2 sm:ml-4"
          />
        </div>
        <p className="text-lg sm:text-xl text-gray-300">
          {weather.current.condition.text}
        </p>
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <WeatherStat label="Feels Like" value={`${Math.round(convertTemp(weather.current.feelslike_c))}°${unit}`} />
        <WeatherStat label="Humidity" value={`${weather.current.humidity}%`} />
        <WeatherStat label="Wind" value={`${weather.current.wind_kph} km/h`} />
        <WeatherStat label="UV Index" value={weather.current.uv} />
      </div>

      {/* Hourly Forecast */}
      <div className="mb-4 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Today's Forecast</h3>
        <div className="flex overflow-x-auto pb-4 gap-4 sm:gap-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {weather.forecast.forecastday[0].hour.map((hour) => (
            <div key={hour.time} className="flex-shrink-0 text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">
                {dateFormat(new Date(hour.time), 'HH:mm')}
              </p>
              <img 
                src={hour.condition.icon} 
                alt={hour.condition.text}
                className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1"
              />
              <p className="text-sm sm:text-base text-white font-semibold">
                {Math.round(convertTemp(hour.temp_c))}°
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">5-Day Forecast</h3>
        <div className="space-y-2 sm:space-y-3">
          {weather.forecast.forecastday.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <span className="text-sm sm:text-base text-gray-300">
                {dateFormat(new Date(day.date), 'EEE, MMM d')}
              </span>
              <div className="flex items-center gap-2 sm:gap-4">
                <img 
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text}
                  className="w-8 h-8"
                />
                <span className="text-sm sm:text-base text-white font-semibold">
                  {Math.round(convertTemp(day.day.maxtemp_c))}°/{Math.round(convertTemp(day.day.mintemp_c))}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for weather stats
function WeatherStat({ label, value }: { label: string, value: string | number }) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
} 