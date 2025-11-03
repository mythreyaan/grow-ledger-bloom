export type UserRole = 'farmer' | 'authority';

export type SchemeType = 'subsidy' | 'insurance';
export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  id: string;
  plantId: string;
  farmerId: string;
  farmerName: string;
  schemeType: SchemeType;
  claimAmount: number;
  approvalStatus: ClaimStatus;
  verifierId?: string;
  remarks?: string;
  submittedAt: number;
  processedAt?: number;
  certificateUrl?: string;
}

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
  imageUrl?: string;
  otpVerified?: boolean;
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
