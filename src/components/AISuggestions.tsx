import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Droplets, Sun, Thermometer, AlertCircle } from 'lucide-react';
import { Plant } from '@/types/plant';

interface AISuggestionsProps {
  plant: Plant;
}

const AISuggestions = ({ plant }: AISuggestionsProps) => {
  // AI-powered suggestions based on plant data
  const generateSuggestions = () => {
    const suggestions = [];
    const latestRecord = plant.growthRecords[plant.growthRecords.length - 1];

    if (!latestRecord) {
      return [{
        icon: AlertCircle,
        title: "Start Tracking",
        description: "Add your first growth record to get personalized AI suggestions",
        priority: "medium"
      }];
    }

    // Water level suggestions
    if (latestRecord.waterLevel < 30) {
      suggestions.push({
        icon: Droplets,
        title: "Water Alert",
        description: `${plant.name} needs watering! Current level: ${latestRecord.waterLevel}%. Optimal: 60-80%`,
        priority: "high"
      });
    } else if (latestRecord.waterLevel > 85) {
      suggestions.push({
        icon: Droplets,
        title: "Overwatering Risk",
        description: `Water level is high (${latestRecord.waterLevel}%). Consider reducing watering frequency to prevent root rot.`,
        priority: "medium"
      });
    }

    // Sunlight suggestions
    if (latestRecord.sunlightHours < 4) {
      suggestions.push({
        icon: Sun,
        title: "More Sunlight Needed",
        description: `${plant.species} typically needs 6-8 hours of sunlight. Currently getting ${latestRecord.sunlightHours}h.`,
        priority: "high"
      });
    } else if (latestRecord.sunlightHours > 10) {
      suggestions.push({
        icon: Sun,
        title: "Sun Exposure Warning",
        description: `High sun exposure (${latestRecord.sunlightHours}h). Watch for leaf burn or wilting.`,
        priority: "medium"
      });
    }

    // Temperature suggestions
    if (latestRecord.temperature < 15) {
      suggestions.push({
        icon: Thermometer,
        title: "Temperature Too Low",
        description: `Current: ${latestRecord.temperature}°C. Most plants prefer 18-24°C. Consider moving to a warmer location.`,
        priority: "high"
      });
    } else if (latestRecord.temperature > 30) {
      suggestions.push({
        icon: Thermometer,
        title: "Temperature Too High",
        description: `Current: ${latestRecord.temperature}°C. High temperature stress detected. Increase humidity and ensure adequate watering.`,
        priority: "medium"
      });
    }

    // Growth rate suggestions
    const growthRecords = plant.growthRecords;
    if (growthRecords.length >= 2) {
      const recent = growthRecords.slice(-2);
      const growthRate = recent[1].height - recent[0].height;
      
      if (growthRate < 0.5) {
        suggestions.push({
          icon: Lightbulb,
          title: "Slow Growth Detected",
          description: "Growth rate is below average. Consider checking nutrient levels and soil quality.",
          priority: "low"
        });
      }
    }

    // Health-based suggestions
    if (plant.health < 40) {
      suggestions.push({
        icon: AlertCircle,
        title: "Health Critical",
        description: "Immediate attention needed! Review all environmental factors and consider pest inspection.",
        priority: "high"
      });
    }

    // Default suggestion if everything is good
    if (suggestions.length === 0) {
      suggestions.push({
        icon: Lightbulb,
        title: "Optimal Conditions",
        description: `${plant.name} is thriving! Keep maintaining current care routine.`,
        priority: "low"
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI Care Suggestions
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on your plant's data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                  <Badge variant={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
