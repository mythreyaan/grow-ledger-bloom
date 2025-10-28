import { useState, useEffect } from "react";
import { Plant, GrowthRecord, PlantStats } from "@/types/plant";
import { Button } from "@/components/ui/button";
import { PlantCard } from "@/components/PlantCard";
import { AddPlantDialog } from "@/components/AddPlantDialog";
import { PlantDetailView } from "@/components/PlantDetailView";
import { StatsOverview } from "@/components/StatsOverview";
import { Plus, Sprout, Shield } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-plant.jpg";

const Index = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  // Load plants from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("blockchain-plants");
    if (saved) {
      setPlants(JSON.parse(saved));
    }
  }, []);

  // Save plants to localStorage
  useEffect(() => {
    if (plants.length > 0) {
      localStorage.setItem("blockchain-plants", JSON.stringify(plants));
    }
  }, [plants]);

  const handleAddPlant = (newPlant: Plant) => {
    setPlants([...plants, newPlant]);
    toast.success("Plant added to blockchain!", {
      description: `${newPlant.name} has been registered with genesis hash`,
    });
  };

  const handleAddRecord = (plantId: string, record: GrowthRecord) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) => {
        if (plant.id === plantId) {
          const updatedRecords = [...plant.growthRecords, record];
          return {
            ...plant,
            growthRecords: updatedRecords,
            currentHeight: record.height,
            health: Math.min(100, plant.health + 5),
          };
        }
        return plant;
      })
    );
    
    setSelectedPlant((prev) => {
      if (prev && prev.id === plantId) {
        return {
          ...prev,
          growthRecords: [...prev.growthRecords, record],
          currentHeight: record.height,
          health: Math.min(100, prev.health + 5),
        };
      }
      return prev;
    });

    toast.success("Growth record added to blockchain!", {
      description: record.source === 'automatic' 
        ? "Hardware sensor data recorded and verified" 
        : "New block has been mined and verified",
    });
  };

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowDetailView(true);
  };

  const calculateStats = (): PlantStats => {
    const totalRecords = plants.reduce((sum, plant) => sum + plant.growthRecords.length, 0);
    const avgGrowth = plants.length > 0
      ? plants.reduce((sum, plant) => {
          if (plant.growthRecords.length > 0) {
            return sum + ((plant.currentHeight / plant.growthRecords[0].height - 1) * 100);
          }
          return sum;
        }, 0) / plants.length
      : 0;
    
    const healthiest = plants.length > 0
      ? plants.reduce((prev, current) => (current.health > prev.health ? current : prev)).name
      : "None";

    return {
      totalPlants: plants.length,
      totalGrowthRecords: totalRecords,
      averageGrowthRate: parseFloat(avgGrowth.toFixed(1)),
      healthiestPlant: healthiest,
    };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Manual & Automatic Hardware Tracking</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-nature bg-clip-text text-transparent">GrowLedger</span>{" "}
              <span className="gradient-blockchain bg-clip-text text-transparent">Bloom</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Track your plants manually or connect hardware sensors for automatic monitoring. 
              Water, sunlight, temperature—all recorded on blockchain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                variant="hero"
                onClick={() => setShowAddDialog(true)}
                className="text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Plant
              </Button>
              <Button size="lg" variant="glass" className="text-lg">
                <Sprout className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {plants.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <StatsOverview stats={calculateStats()} />
        </section>
      )}

      {/* Plants Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Your Plant Garden</h2>
            <p className="text-muted-foreground mt-1">
              {plants.length === 0 ? "Start your blockchain garden" : `Managing ${plants.length} plants`}
            </p>
          </div>
          
          {plants.length > 0 && (
            <Button variant="blockchain" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plant
            </Button>
          )}
        </div>

        {plants.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Sprout className="w-16 h-16 mx-auto text-primary animate-float" />
              <h3 className="text-2xl font-semibold">No Plants Yet</h3>
              <p className="text-muted-foreground">
                Begin your journey by adding your first plant. Each plant gets a unique blockchain identity
                that tracks its entire growth history.
              </p>
              <Button variant="hero" onClick={() => setShowAddDialog(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Plant
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onClick={() => handlePlantClick(plant)} />
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <AddPlantDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddPlant={handleAddPlant}
      />
      
      <PlantDetailView
        plant={selectedPlant}
        open={showDetailView}
        onOpenChange={setShowDetailView}
        onAddRecord={handleAddRecord}
      />
    </div>
  );
};

export default Index;
