import { useEffect } from 'react';
import { Plant, GrowthRecord } from '@/types/plant';
import { createGrowthRecordHash } from '@/utils/blockchain';

const HOUR_IN_MS = 60 * 60 * 1000;

// Simulate sensor readings
const generateSensorData = (plant: Plant) => {
  const lastRecord = plant.growthRecords[plant.growthRecords.length - 1];
  
  return {
    height: lastRecord 
      ? lastRecord.height + (Math.random() * 0.5) // Grow 0-0.5 cm per hour
      : plant.currentHeight,
    waterLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
    sunlightHours: parseFloat((Math.random() * 1).toFixed(2)), // 0-1 hour
    temperature: Math.floor(Math.random() * 10) + 20, // 20-30°C
  };
};

export const useAutomaticRecording = (
  plants: Plant[],
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>
) => {
  useEffect(() => {
    const checkAndRecordForPlants = async () => {
      const now = Date.now();
      
      for (const plant of plants) {
        if (!plant.automaticRecording) continue;
        
        const lastRecordTime = plant.lastAutomaticRecord || plant.plantedDate;
        const timeSinceLastRecord = now - lastRecordTime;
        
        // If more than an hour has passed, create new record
        if (timeSinceLastRecord >= HOUR_IN_MS) {
          const sensorData = generateSensorData(plant);
          const previousHash = plant.growthRecords.length > 0
            ? plant.growthRecords[plant.growthRecords.length - 1].hash
            : plant.genesisHash;
          
          const recordData = {
            id: `auto-${Date.now()}-${Math.random()}`,
            timestamp: now,
            ...sensorData,
            notes: 'Automatic sensor reading',
            previousHash,
            source: 'automatic' as const,
          };
          
          const hash = await createGrowthRecordHash(recordData);
          const newRecord: GrowthRecord = { ...recordData, hash };
          
          const updatedRecords = [...plant.growthRecords, newRecord];
          
          await updatePlant(plant.id, {
            growthRecords: updatedRecords,
            currentHeight: sensorData.height,
            lastAutomaticRecord: now,
          });
          
          console.log(`Automatic record created for ${plant.name}`);
        }
      }
    };
    
    // Check immediately on mount
    checkAndRecordForPlants();
    
    // Then check every 5 minutes (to catch hourly marks)
    const interval = setInterval(checkAndRecordForPlants, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [plants, updatePlant]);
};
