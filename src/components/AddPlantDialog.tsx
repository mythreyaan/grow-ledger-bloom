import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plant } from "@/types/plant";
import { createGenesisHash } from "@/utils/blockchain";
import { Sprout } from "lucide-react";

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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const timestamp = Date.now();
    const plantId = `plant-${timestamp}`;
    const genesisHash = await createGenesisHash(plantId, timestamp);
    
    const newPlant: Plant = {
      id: plantId,
      name: formData.name,
      species: formData.species,
      plantedDate: timestamp,
      imageUrl: formData.imageUrl || undefined,
      currentHeight: parseFloat(formData.initialHeight),
      health: 100,
      growthRecords: [],
      genesisHash,
    };

    onAddPlant(newPlant);
    setFormData({ name: "", species: "", initialHeight: "", imageUrl: "" });
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
          
          <Button type="submit" className="w-full" variant="hero">
            Create Plant Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
