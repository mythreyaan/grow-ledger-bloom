import { useWeather } from '@/hooks/useWeather';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Cloud, Droplets, Wind, Gauge } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export const WeatherWidget = () => {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Weather Conditions
            </CardTitle>
            <CardDescription className="capitalize mt-1">
              {weather.description}
              {error && ' (Demo Mode)'}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-semibold">{weather.windSpeed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-sm font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        </div>
        {error && (
          <p className="text-xs text-muted-foreground mt-3">
            💡 Add your OpenWeather API key in src/hooks/useWeather.ts for live data
          </p>
        )}
      </CardContent>
    </Card>
  );
};
