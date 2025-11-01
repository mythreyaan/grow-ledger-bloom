import { Plant } from '@/types/plant';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Droplets, AlertTriangle, Brain } from 'lucide-react';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface AIPredictorProps {
  plant: Plant;
}

export const AIPredictor = ({ plant }: AIPredictorProps) => {
  const predictions = useAIPredictions(plant);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Predictions</CardTitle>
          </div>
          <CardDescription>
            Machine learning analysis based on {plant.growthRecords?.length || 0} data points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Prediction Confidence</span>
              <span className="text-sm text-muted-foreground">
                {(predictions.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={predictions.confidence * 100} className="h-2" />
          </div>

          {/* Watering Prediction */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Ideal Watering Schedule</h4>
              <p className="text-sm text-muted-foreground">{predictions.idealWateringTime}</p>
            </div>
          </div>

          {/* Growth Rate Prediction */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Expected Growth Rate</h4>
              <p className="text-sm text-muted-foreground">
                {predictions.expectedGrowthRate > 0 
                  ? `${predictions.expectedGrowthRate} cm per week`
                  : 'Insufficient data for prediction'}
              </p>
            </div>
          </div>

          {/* Stress Conditions */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h4 className="font-semibold text-sm">Detected Conditions</h4>
            </div>
            <div className="space-y-2">
              {predictions.stressConditions.map((condition, index) => {
                const isOptimal = condition.includes('optimal');
                return (
                  <Alert 
                    key={index}
                    variant={isOptimal ? "default" : "destructive"}
                    className={isOptimal ? "border-green-500/50 bg-green-500/10" : ""}
                  >
                    <AlertDescription className="text-sm">
                      {condition}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </div>

          {predictions.confidence < 0.5 && (
            <Alert>
              <AlertDescription className="text-xs">
                💡 Add more growth records to improve prediction accuracy. At least 7 records are recommended for reliable predictions.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
