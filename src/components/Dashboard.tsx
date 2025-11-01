import { Plant } from '@/types/plant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Droplets, Sun, Thermometer, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface DashboardProps {
  plants: Plant[];
}

export const Dashboard = ({ plants }: DashboardProps) => {
  // Aggregate all growth records
  const allRecords = plants.flatMap(plant => 
    (plant.growthRecords || []).map(record => ({
      ...record,
      plantName: plant.name,
      date: new Date(record.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate summary statistics
  const stats = calculateStats(allRecords);
  const alerts = generateAlerts(allRecords);

  // Prepare chart data - group by date
  const chartData = allRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.date === record.date);
    if (existing) {
      existing.waterLevel = (existing.waterLevel + record.waterLevel) / 2;
      existing.temperature = (existing.temperature + record.temperature) / 2;
      existing.sunlightHours = (existing.sunlightHours + record.sunlightHours) / 2;
      existing.count++;
    } else {
      acc.push({
        date: record.date,
        waterLevel: record.waterLevel,
        temperature: record.temperature,
        sunlightHours: record.sunlightHours,
        height: record.height,
        count: 1
      });
    }
    return acc;
  }, [] as any[]);

  if (plants.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No plants added yet. Add your first plant to see dashboard analytics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Water Level</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgWaterLevel}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.waterTrend > 0 ? '+' : ''}{stats.waterTrend}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTemperature}°C</div>
            <p className="text-xs text-muted-foreground">
              {stats.tempTrend > 0 ? '+' : ''}{stats.tempTrend}°C from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sunlight</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSunlight}h/day</div>
            <p className="text-xs text-muted-foreground">
              {stats.sunlightTrend > 0 ? '+' : ''}{stats.sunlightTrend}h from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrowth}cm</div>
            <p className="text-xs text-muted-foreground">
              Across {plants.length} plant{plants.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive">
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Level Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level Trends</CardTitle>
            <CardDescription>Average water levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="waterLevel" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Trends</CardTitle>
            <CardDescription>Average temperature readings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sunlight Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Sunlight Exposure</CardTitle>
            <CardDescription>Daily sunlight hours tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sunlightHours" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Progress</CardTitle>
            <CardDescription>Plant height measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="height" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function calculateStats(records: any[]) {
  if (records.length === 0) {
    return {
      avgWaterLevel: 0,
      avgTemperature: 0,
      avgSunlight: 0,
      totalGrowth: 0,
      waterTrend: 0,
      tempTrend: 0,
      sunlightTrend: 0
    };
  }

  const now = Date.now();
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

  const recentRecords = records.filter(r => new Date(r.timestamp).getTime() > weekAgo);
  const olderRecords = records.filter(r => new Date(r.timestamp).getTime() <= weekAgo);

  const avgWaterLevel = Math.round(records.reduce((sum, r) => sum + r.waterLevel, 0) / records.length);
  const avgTemperature = Math.round(records.reduce((sum, r) => sum + r.temperature, 0) / records.length);
  const avgSunlight = Math.round(records.reduce((sum, r) => sum + r.sunlightHours, 0) / records.length * 10) / 10;

  const firstHeight = records[0]?.height || 0;
  const lastHeight = records[records.length - 1]?.height || 0;
  const totalGrowth = Math.round((lastHeight - firstHeight) * 10) / 10;

  const recentAvgWater = recentRecords.length ? recentRecords.reduce((sum, r) => sum + r.waterLevel, 0) / recentRecords.length : avgWaterLevel;
  const olderAvgWater = olderRecords.length ? olderRecords.reduce((sum, r) => sum + r.waterLevel, 0) / olderRecords.length : avgWaterLevel;
  const waterTrend = Math.round(recentAvgWater - olderAvgWater);

  const recentAvgTemp = recentRecords.length ? recentRecords.reduce((sum, r) => sum + r.temperature, 0) / recentRecords.length : avgTemperature;
  const olderAvgTemp = olderRecords.length ? olderRecords.reduce((sum, r) => sum + r.temperature, 0) / olderRecords.length : avgTemperature;
  const tempTrend = Math.round(recentAvgTemp - olderAvgTemp);

  const recentAvgSun = recentRecords.length ? recentRecords.reduce((sum, r) => sum + r.sunlightHours, 0) / recentRecords.length : avgSunlight;
  const olderAvgSun = olderRecords.length ? olderRecords.reduce((sum, r) => sum + r.sunlightHours, 0) / olderRecords.length : avgSunlight;
  const sunlightTrend = Math.round((recentAvgSun - olderAvgSun) * 10) / 10;

  return {
    avgWaterLevel,
    avgTemperature,
    avgSunlight,
    totalGrowth,
    waterTrend,
    tempTrend,
    sunlightTrend
  };
}

function generateAlerts(records: any[]): string[] {
  const alerts: string[] = [];
  const recent = records.slice(-5);

  if (recent.length === 0) return alerts;

  const avgWater = recent.reduce((sum, r) => sum + r.waterLevel, 0) / recent.length;
  const avgTemp = recent.reduce((sum, r) => sum + r.temperature, 0) / recent.length;
  const avgSun = recent.reduce((sum, r) => sum + r.sunlightHours, 0) / recent.length;

  if (avgWater < 25) {
    alerts.push('⚠️ Critical: Water level is very low across multiple plants. Water immediately!');
  } else if (avgWater > 85) {
    alerts.push('⚠️ Warning: Overwatering detected. Reduce watering frequency.');
  }

  if (avgTemp > 32) {
    alerts.push('⚠️ High temperature alert: Move plants to cooler location or increase ventilation.');
  } else if (avgTemp < 10) {
    alerts.push('⚠️ Low temperature alert: Protect plants from cold or move indoors.');
  }

  if (avgSun < 3) {
    alerts.push('⚠️ Insufficient sunlight: Plants need more light exposure.');
  }

  return alerts;
}
