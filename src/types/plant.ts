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
  plantedDate: number;
  imageUrl?: string;
  currentHeight: number;
  health: number;
  growthRecords: GrowthRecord[];
  genesisHash: string;
  automaticRecording: boolean;
  lastAutomaticRecord?: number;
}

export interface PlantStats {
  totalPlants: number;
  totalGrowthRecords: number;
  averageGrowthRate: number;
  healthiestPlant: string;
}
