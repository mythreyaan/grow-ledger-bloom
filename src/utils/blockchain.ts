import { GrowthRecord } from "@/types/plant";

export const generateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

export const createGenesisHash = async (plantId: string, timestamp: number): Promise<string> => {
  return generateHash(`genesis-${plantId}-${timestamp}`);
};

export const createGrowthRecordHash = async (
  record: Omit<GrowthRecord, "hash">,
): Promise<string> => {
  const data = `${record.id}-${record.timestamp}-${record.height}-${record.waterLevel}-${record.sunlightHours}-${record.temperature}-${record.previousHash}`;
  return generateHash(data);
};

export const verifyChain = (records: GrowthRecord[]): boolean => {
  if (records.length === 0) return true;

  for (let i = 1; i < records.length; i++) {
    if (records[i].previousHash !== records[i - 1].hash) {
      return false;
    }
  }
  return true;
};

export const shortenHash = (hash: string): string => {
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};
