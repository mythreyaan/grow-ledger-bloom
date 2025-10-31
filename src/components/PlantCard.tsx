import { Plant } from "@/types/plant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, TrendingUp, Activity, Radio } from "lucide-react";
import { shortenHash } from "@/utils/blockchain";

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
}

export const PlantCard = ({ plant, onClick }: PlantCardProps) => {
  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-primary";
    if (health >= 50) return "bg-chart-4";
    return "bg-destructive";
  };

  const growthRate = plant.growthRecords.length > 1
    ? ((plant.currentHeight / plant.growthRecords[0].height - 1) * 100).toFixed(1)
    : "0";

  return (
    <Card
      className="glass-card hover:shadow-blockchain cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden group"
      onClick={onClick}
    >
      <div className="h-48 bg-gradient-nature relative overflow-hidden">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sprout className="w-20 h-20 text-white/80 animate-float" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge className={`${getHealthColor(plant.health)} text-white`}>
            {plant.health}% Health
          </Badge>
          {plant.automaticRecording && (
            <Badge className="bg-chart-2 text-white flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              Auto Recording
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">{plant.name}</span>
          <Activity className="w-5 h-5 text-primary animate-pulse-glow" />
        </CardTitle>
        <p className="text-sm text-muted-foreground">{plant.species}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            Growth Rate
          </span>
          <span className="font-semibold text-primary">+{growthRate}%</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Height</span>
          <span className="font-semibold">{plant.currentHeight} cm</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Records</span>
          <Badge variant="secondary">{plant.growthRecords.length}</Badge>
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">
            Genesis: {shortenHash(plant.genesisHash)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
