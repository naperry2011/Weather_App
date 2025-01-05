import axios from 'axios';
import { WeatherData, LocationData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const weatherService = {
  getCurrentWeather: async (location: string): Promise<WeatherData> => {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  },

  searchLocations: async (query: string): Promise<LocationData[]> => {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query
      }
    });
    return response.data;
  },

  reverseGeocode: async (lat: number, lon: number): Promise<LocationData> => {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${lat},${lon}`
    );
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    const data = await response.json();
    return data[0];
  }
}; 