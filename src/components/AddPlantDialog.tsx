import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plant } from "@/types/plant";
import { createGenesisHash } from "@/utils/blockchain";
import { Sprout, Hand, Wifi } from "lucide-react";
import { OTPVerification } from "./OTPVerification";
import { toast } from "sonner";

interface AddPlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlant: (plant: Plant) => void;
}

export const AddPlantDialog = ({ open, onOpenChange, onAddPlant }: AddPlantDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    initialHeight: "",
    imageUrl: "",
    recordingMode: "manual", // "manual" or "automatic"
  });
  const [showOTP, setShowOTP] = useState(false);
  const [pendingPlant, setPendingPlant] = useState<Plant | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const timestamp = Date.now();
    const plantId = `plant-${timestamp}`;
    const genesisHash = await createGenesisHash(plantId, timestamp);
    
    const newPlant: Plant = {
      id: plantId,
      name: formData.name,
      species: formData.species,
      type: formData.species, // Alias for backward compatibility
      plantedDate: timestamp,
      imageUrl: formData.imageUrl || undefined,
      currentHeight: parseFloat(formData.initialHeight),
      health: 100,
      growthRecords: [],
      genesisHash,
      automaticRecording: formData.recordingMode === "automatic",
      lastAutomaticRecord: formData.recordingMode === "automatic" ? timestamp : undefined,
    };

    setPendingPlant(newPlant);
    setShowOTP(true);
  };

  const handleOTPVerify = () => {
    if (!pendingPlant) return;
    
    onAddPlant(pendingPlant);
    toast.success("Plant added successfully!", {
      description: `${pendingPlant.name} has been verified and added to your garden`
    });
    
    setFormData({ name: "", species: "", initialHeight: "", imageUrl: "", recordingMode: "manual" });
    setPendingPlant(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sprout className="w-6 h-6 text-primary" />
            Add New Plant
          </DialogTitle>
          <DialogDescription>
            Register your plant with blockchain verification. OTP authentication required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plant Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., My Tomato Plant"
              required
              className="glass-card"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="species">Species</Label>
            <Input
              id="species"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              placeholder="e.g., Solanum lycopersicum"
              required
              className="glass-card"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Initial Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={formData.initialHeight}
              onChange={(e) => setFormData({ ...formData, initialHeight: e.target.value })}
              placeholder="e.g., 5.5"
              required
              className="glass-card"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="glass-card"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-medium">Recording Mode</Label>
            <RadioGroup 
              value={formData.recordingMode} 
              onValueChange={(value) => setFormData({ ...formData, recordingMode: value })}
            >
              <div className="flex items-center space-x-2 p-4 glass-card rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <RadioGroupItem value="manual" id="manual" />
                <div className="flex-1">
                  <Label htmlFor="manual" className="cursor-pointer flex items-center gap-2 font-medium">
                    <Hand className="w-4 h-4" />
                    Manual Recording
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Record growth data manually with OTP verification and image attachment
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-4 glass-card rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <RadioGroupItem value="automatic" id="automatic" />
                <div className="flex-1">
                  <Label htmlFor="automatic" className="cursor-pointer flex items-center gap-2 font-medium">
                    <Wifi className="w-4 h-4" />
                    Automatic (Hardware Sensors)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Record growth data automatically every 6 hours via connected sensors
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full" variant="hero">
            Create Plant Profile
          </Button>
        </form>

        <OTPVerification
          open={showOTP}
          onOpenChange={setShowOTP}
          onVerify={handleOTPVerify}
          purpose="plant registration"
        />
      </DialogContent>
    </Dialog>
  );
};
