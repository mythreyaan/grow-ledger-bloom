import { useState } from "react";
import { Plant } from "@/types/plant";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, TrendingUp, Droplet, Sun, Thermometer, Calendar } from "lucide-react";
import { shortenHash } from "@/utils/blockchain";
import { createGrowthRecordHash } from "@/utils/blockchain";
import { GrowthRecord } from "@/types/plant";

interface PlantDetailViewProps {
  plant: Plant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (plantId: string, record: GrowthRecord) => void;
}

export const PlantDetailView = ({ plant, open, onOpenChange, onAddRecord }: PlantDetailViewProps) => {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    height: "",
    waterLevel: "",
    sunlightHours: "",
    temperature: "",
    notes: "",
  });

  if (!plant) return null;

  const handleAddRecord = async () => {
    const timestamp = Date.now();
    const previousHash = plant.growthRecords.length > 0
      ? plant.growthRecords[plant.growthRecords.length - 1].hash
      : plant.genesisHash;

    const recordData = {
      id: `record-${timestamp}`,
      timestamp,
      height: parseFloat(recordForm.height),
      waterLevel: parseFloat(recordForm.waterLevel),
      sunlightHours: parseFloat(recordForm.sunlightHours),
      temperature: parseFloat(recordForm.temperature),
      notes: recordForm.notes,
      previousHash,
    };

    const hash = await createGrowthRecordHash(recordData);
    const newRecord: GrowthRecord = { ...recordData, hash };

    onAddRecord(plant.id, newRecord);
    setRecordForm({ height: "", waterLevel: "", sunlightHours: "", temperature: "", notes: "" });
    setShowAddRecord(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-3">
            {plant.name}
            <Badge className="gradient-blockchain text-white">
              <Shield className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          </DialogTitle>
          <p className="text-muted-foreground">{plant.species}</p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Height</span>
              </div>
              <p className="text-2xl font-bold text-primary">{plant.currentHeight} cm</p>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Health</span>
              </div>
              <p className="text-2xl font-bold text-primary">{plant.health}%</p>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Age</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {Math.floor((Date.now() - plant.plantedDate) / (1000 * 60 * 60 * 24))}d
              </p>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Records</span>
              </div>
              <p className="text-2xl font-bold text-primary">{plant.growthRecords.length}</p>
            </div>
          </div>

          <Separator />

          {/* Add Record Section */}
          {!showAddRecord ? (
            <Button onClick={() => setShowAddRecord(true)} variant="blockchain" className="w-full">
              Add Growth Record
            </Button>
          ) : (
            <div className="glass-card p-6 rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">New Growth Record</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={recordForm.height}
                    onChange={(e) => setRecordForm({ ...recordForm, height: e.target.value })}
                    className="glass-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="water" className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" /> Water Level (1-10)
                  </Label>
                  <Input
                    id="water"
                    type="number"
                    min="1"
                    max="10"
                    value={recordForm.waterLevel}
                    onChange={(e) => setRecordForm({ ...recordForm, waterLevel: e.target.value })}
                    className="glass-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sun" className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Sunlight (hours)
                  </Label>
                  <Input
                    id="sun"
                    type="number"
                    step="0.5"
                    value={recordForm.sunlightHours}
                    onChange={(e) => setRecordForm({ ...recordForm, sunlightHours: e.target.value })}
                    className="glass-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temp" className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" /> Temperature (°C)
                  </Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    value={recordForm.temperature}
                    onChange={(e) => setRecordForm({ ...recordForm, temperature: e.target.value })}
                    className="glass-card"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={recordForm.notes}
                  onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                  placeholder="Add observations about your plant..."
                  className="glass-card"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddRecord} variant="hero" className="flex-1">
                  Submit Record
                </Button>
                <Button onClick={() => setShowAddRecord(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Growth Timeline */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Blockchain Growth Timeline
            </h3>
            
            {plant.growthRecords.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No growth records yet. Add your first record to start tracking!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...plant.growthRecords].reverse().map((record, idx) => (
                  <div key={record.id} className="glass-card p-4 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-lg">{record.height} cm</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        Block #{plant.growthRecords.length - idx}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        <span>{record.waterLevel}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <span>{record.sunlightHours}h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span>{record.temperature}°C</span>
                      </div>
                    </div>
                    
                    {record.notes && (
                      <p className="text-sm text-muted-foreground italic">{record.notes}</p>
                    )}
                    
                    <div className="pt-2 border-t border-border space-y-1">
                      <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Hash: {shortenHash(record.hash)}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Previous: {shortenHash(record.previousHash)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
