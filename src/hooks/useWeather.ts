import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pressure: number;
}

const WEATHER_API_KEY = 'demo'; // Users should add their own key

export const useWeather = (city: string = 'London') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (WEATHER_API_KEY === 'demo') {
        // Mock data for demo mode
        setWeather({
          temperature: 22,
          humidity: 65,
          description: 'Partly Cloudy',
          icon: '02d',
          windSpeed: 5.2,
          pressure: 1013
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to mock data on error
        setWeather({
          temperature: 22,
          humidity: 65,
          description: 'Demo Mode',
          icon: '01d',
          windSpeed: 5.0,
          pressure: 1013
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, [city]);

  return { weather, loading, error };
};
