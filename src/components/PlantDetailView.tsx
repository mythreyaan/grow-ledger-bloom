import { useState, useEffect } from "react";
import { Plant } from "@/types/plant";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, TrendingUp, Droplet, Sun, Thermometer, Calendar, Wifi, WifiOff, Hand } from "lucide-react";
import { shortenHash } from "@/utils/blockchain";
import { createGrowthRecordHash } from "@/utils/blockchain";
import { GrowthRecord } from "@/types/plant";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AISuggestions from "./AISuggestions";
import { BlockchainExplorer } from "./BlockchainExplorer";
import { AIPredictor } from "./AIPredictor";
import { useAuth } from "@/contexts/AuthContext";
import { OTPVerification } from "./OTPVerification";

interface PlantDetailViewProps {
  plant: Plant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (plantId: string, record: GrowthRecord) => void;
}

export const PlantDetailView = ({ plant, open, onOpenChange, onAddRecord }: PlantDetailViewProps) => {
  const { userRole } = useAuth();
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [hardwareMode, setHardwareMode] = useState(false);
  const [isHardwareConnected, setIsHardwareConnected] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [recordForm, setRecordForm] = useState({
    height: "",
    waterLevel: "",
    sunlightHours: "",
    temperature: "",
    notes: "",
    imageUrl: "",
  });

  // Simulate hardware data polling when in hardware mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hardwareMode && isHardwareConnected) {
      interval = setInterval(() => {
        // Simulate receiving data from hardware sensors
        const hardwareData = {
          height: (Math.random() * 5 + parseFloat(recordForm.height || "20")).toFixed(1),
          waterLevel: (Math.random() * 3 + 5).toFixed(0),
          sunlightHours: (Math.random() * 4 + 4).toFixed(1),
          temperature: (Math.random() * 5 + 22).toFixed(1),
        };
        
        setRecordForm(prev => ({
          ...prev,
          height: hardwareData.height,
          waterLevel: hardwareData.waterLevel,
          sunlightHours: hardwareData.sunlightHours,
          temperature: hardwareData.temperature,
        }));
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hardwareMode, isHardwareConnected]);

  if (!plant) return null;

  const handleAddRecord = async () => {
    // Require OTP when submitting manual records
    if (!(hardwareMode && isHardwareConnected)) {
      setShowOTP(true);
      return;
    }

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
      source: 'automatic' as const,
    };

    const hash = await createGrowthRecordHash(recordData);
    const newRecord: GrowthRecord = { ...recordData, hash };

    onAddRecord(plant.id, newRecord);
    setRecordForm({ height: "", waterLevel: "", sunlightHours: "", temperature: "", notes: "", imageUrl: "" });
    setShowAddRecord(false);
  };

  const handleOTPVerify = async () => {
    // Called for manual submissions
    if (!recordForm.imageUrl) {
      alert('Please attach an image URL for manual record.');
      return;
    }

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
      source: 'manual' as const,
      imageUrl: recordForm.imageUrl,
      otpVerified: true as const,
    };

    const hash = await createGrowthRecordHash(recordData);
    const newRecord: GrowthRecord = { ...recordData, hash };

    onAddRecord(plant.id, newRecord);
    setRecordForm({ height: "", waterLevel: "", sunlightHours: "", temperature: "", notes: "", imageUrl: "" });
    setShowAddRecord(false);
    setShowOTP(false);
  };

  const toggleHardwareConnection = () => {
    setIsHardwareConnected(!isHardwareConnected);
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

          {/* Tabs for AI and Blockchain */}
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai">AI Predictions</TabsTrigger>
              <TabsTrigger value="suggestions">Care Tips</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="mt-4">
              <AIPredictor plant={plant} />
            </TabsContent>
            <TabsContent value="suggestions" className="mt-4">
              <AISuggestions plant={plant} />
            </TabsContent>
            <TabsContent value="blockchain" className="mt-4">
              <BlockchainExplorer plant={plant} />
            </TabsContent>
          </Tabs>
          
          <Separator />

          {/* Add Record Section */}
          {!showAddRecord ? (
            <Button 
              onClick={() => setShowAddRecord(true)} 
              variant="blockchain" 
              className="w-full"
              disabled={userRole === 'authority'}
            >
              Add Growth Record
            </Button>
          ) : (
            <div className="glass-card p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">New Growth Record</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4" />
                    <span className="text-sm">Manual</span>
                    <Switch checked={hardwareMode} onCheckedChange={setHardwareMode} />
                    <span className="text-sm">Hardware</span>
                  </div>
                  {hardwareMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleHardwareConnection}
                      className="gap-2"
                    >
                      {isHardwareConnected ? (
                        <>
                          <Wifi className="w-4 h-4 text-green-500" />
                          Connected
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-muted-foreground" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {hardwareMode && !isHardwareConnected && (
                <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                  Connect your hardware sensors to automatically capture plant data. Click "Connect" to establish connection.
                </div>
              )}
              
              {hardwareMode && isHardwareConnected && (
                <div className="bg-green-500/10 p-3 rounded-lg text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Hardware connected! Data is being automatically captured from sensors.
                </div>
              )}
              
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
                    disabled={hardwareMode && isHardwareConnected}
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
                    disabled={hardwareMode && isHardwareConnected}
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
                    disabled={hardwareMode && isHardwareConnected}
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
                    disabled={hardwareMode && isHardwareConnected}
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
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-semibold text-lg">{record.height} cm</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {record.source === 'automatic' ? (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Wifi className="w-3 h-3" />
                            Auto
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Hand className="w-3 h-3" />
                            Manual
                          </Badge>
                        )}
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
