import { PlantStats } from "@/types/plant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Shield, Award } from "lucide-react";

interface StatsOverviewProps {
  stats: PlantStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-card hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.totalPlants}</div>
          <p className="text-xs text-muted-foreground mt-1">Active in your garden</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Records</CardTitle>
          <Shield className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary">{stats.totalGrowthRecords}</div>
          <p className="text-xs text-muted-foreground mt-1">Blockchain verified</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-chart-1" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-chart-1">+{stats.averageGrowthRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Across all plants</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:shadow-glow transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          <Award className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-chart-4 truncate">{stats.healthiestPlant}</div>
          <p className="text-xs text-muted-foreground mt-1">Healthiest plant</p>
        </CardContent>
      </Card>
    </div>
  );
};
