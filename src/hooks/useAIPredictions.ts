import { useMemo } from 'react';
import { Plant } from '@/types/plant';

interface PredictionResult {
  idealWateringTime: string;
  expectedGrowthRate: number; // cm per week
  stressConditions: string[];
  confidence: number; // 0-1
}

export const useAIPredictions = (plant: Plant): PredictionResult => {
  return useMemo(() => {
    if (!plant.growthRecords || plant.growthRecords.length === 0) {
      return {
        idealWateringTime: 'Not enough data',
        expectedGrowthRate: 0,
        stressConditions: ['Insufficient data for analysis'],
        confidence: 0
      };
    }

    const records = [...plant.growthRecords].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate growth rate
    const growthRate = calculateGrowthRate(records);
    
    // Analyze watering patterns
    const wateringAnalysis = analyzeWateringPattern(records);
    
    // Detect stress conditions
    const stressConditions = detectStressConditions(records, plant.type);
    
    // Calculate confidence based on data quality
    const confidence = calculateConfidence(records);

    return {
      idealWateringTime: wateringAnalysis.recommendation,
      expectedGrowthRate: growthRate,
      stressConditions,
      confidence
    };
  }, [plant]);
};

function calculateGrowthRate(records: Plant['growthRecords']): number {
  if (records.length < 2) return 0;

  const first = records[0];
  const last = records[records.length - 1];
  
  const heightDiff = last.height - first.height;
  const timeDiff = new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime();
  const weeksDiff = timeDiff / (1000 * 60 * 60 * 24 * 7);

  return weeksDiff > 0 ? Number((heightDiff / weeksDiff).toFixed(2)) : 0;
}

function analyzeWateringPattern(records: Plant['growthRecords']): { recommendation: string } {
  const recentRecords = records.slice(-7); // Last 7 records
  const avgWaterLevel = recentRecords.reduce((sum, r) => sum + r.waterLevel, 0) / recentRecords.length;

  if (avgWaterLevel < 30) {
    return { recommendation: 'Daily watering recommended (morning 6-8 AM)' };
  } else if (avgWaterLevel < 60) {
    return { recommendation: 'Water every 2-3 days (morning 6-8 AM)' };
  } else if (avgWaterLevel < 80) {
    return { recommendation: 'Water twice per week (morning 6-8 AM)' };
  } else {
    return { recommendation: 'Water once per week (reduce to prevent overwatering)' };
  }
}

function detectStressConditions(records: Plant['growthRecords'], plantType: string): string[] {
  const conditions: string[] = [];
  const recent = records.slice(-5);

  if (recent.length === 0) return ['No recent data'];

  // Temperature stress
  const avgTemp = recent.reduce((sum, r) => sum + r.temperature, 0) / recent.length;
  const optimalTemp = getOptimalTemperature(plantType);
  
  if (avgTemp < optimalTemp.min) {
    conditions.push(`Temperature too low (${avgTemp.toFixed(1)}°C). Risk of slow growth.`);
  } else if (avgTemp > optimalTemp.max) {
    conditions.push(`Temperature too high (${avgTemp.toFixed(1)}°C). Risk of wilting.`);
  }

  // Sunlight stress
  const avgSunlight = recent.reduce((sum, r) => sum + r.sunlightHours, 0) / recent.length;
  if (avgSunlight < 4) {
    conditions.push(`Insufficient sunlight (${avgSunlight.toFixed(1)}h/day). Move to brighter location.`);
  } else if (avgSunlight > 10) {
    conditions.push(`Excessive sunlight (${avgSunlight.toFixed(1)}h/day). Risk of sunburn.`);
  }

  // Water stress
  const avgWater = recent.reduce((sum, r) => sum + r.waterLevel, 0) / recent.length;
  if (avgWater < 25) {
    conditions.push('Severe dehydration detected. Water immediately.');
  } else if (avgWater > 85) {
    conditions.push('Overwatering detected. Reduce watering frequency.');
  }

  // Growth stagnation
  if (recent.length >= 3) {
    const heightChanges = recent.slice(1).map((r, i) => r.height - recent[i].height);
    const avgChange = heightChanges.reduce((sum, c) => sum + c, 0) / heightChanges.length;
    if (avgChange < 0.1) {
      conditions.push('Growth stagnation detected. Check nutrients and soil quality.');
    }
  }

  if (conditions.length === 0) {
    conditions.push('Plant conditions are optimal!');
  }

  return conditions;
}

function getOptimalTemperature(plantType: string): { min: number; max: number } {
  const defaults = { min: 15, max: 30 };
  
  const temperatureRanges: Record<string, { min: number; max: number }> = {
    tomato: { min: 18, max: 27 },
    lettuce: { min: 10, max: 20 },
    basil: { min: 20, max: 30 },
    pepper: { min: 21, max: 29 },
    cucumber: { min: 18, max: 28 },
    strawberry: { min: 15, max: 25 },
    rose: { min: 15, max: 28 },
    succulent: { min: 18, max: 35 },
    cactus: { min: 20, max: 40 },
    orchid: { min: 18, max: 26 }
  };

  return temperatureRanges[plantType.toLowerCase()] || defaults;
}

function calculateConfidence(records: Plant['growthRecords']): number {
  if (records.length < 3) return 0.3;
  if (records.length < 7) return 0.6;
  if (records.length < 15) return 0.8;
  return 0.95;
}
