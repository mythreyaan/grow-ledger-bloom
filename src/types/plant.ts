export type UserRole = 'farmer' | 'researcher' | 'admin';

export interface GrowthRecord {
  id: string;
  timestamp: number;
  height: number;
  notes: string;
  waterLevel: number;
  sunlightHours: number;
  temperature: number;
  hash: string;
  previousHash: string;
  source: 'manual' | 'automatic';
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  type: string; // Alias for species for backward compatibility
  plantedDate: number;
  imageUrl?: string;
  currentHeight: number;
  health: number;
  growthRecords: GrowthRecord[];
  genesisHash: string;
  automaticRecording: boolean;
  lastAutomaticRecord?: number;
  weather?: {
    temperature: number;
    humidity: number;
    description: string;
  };
}

export interface PlantStats {
  totalPlants: number;
  totalGrowthRecords: number;
  averageGrowthRate: number;
  healthiestPlant: string;
}
