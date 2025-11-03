import { useEffect } from 'react';
import { Plant, GrowthRecord } from '@/types/plant';
import { createGrowthRecordHash } from '@/utils/blockchain';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;

// Simulate sensor readings
const generateSensorData = (plant: Plant) => {
  const lastRecord = plant.growthRecords[plant.growthRecords.length - 1];
  
  return {
    height: lastRecord 
      ? lastRecord.height + (Math.random() * 3) // Grow 0-3 cm per 6 hours
      : plant.currentHeight,
    waterLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
    sunlightHours: parseFloat((Math.random() * 6).toFixed(2)), // 0-6 hours
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
        
        // If more than 6 hours have passed, create new record
        if (timeSinceLastRecord >= SIX_HOURS_IN_MS) {
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
    
    // Then check every 30 minutes (to catch 6-hour marks)
    const interval = setInterval(checkAndRecordForPlants, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [plants, updatePlant]);
};
