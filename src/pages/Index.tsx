import { useState } from "react";
import { Sprout, Plus, BarChart3, Grid3X3, FileText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlants } from "@/hooks/usePlants";
import { useAutomaticRecording } from "@/hooks/useAutomaticRecording";
import { Plant, GrowthRecord, PlantStats } from "@/types/plant";
import { Button } from "@/components/ui/button";
import { PlantCard } from "@/components/PlantCard";
import { AddPlantDialog } from "@/components/AddPlantDialog";
import { PlantDetailView } from "@/components/PlantDetailView";
import { StatsOverview } from "@/components/StatsOverview";
import { WalletConnect } from "@/components/WalletConnect";
import { Dashboard } from "@/components/Dashboard";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ClaimSubmission } from "@/components/ClaimSubmission";
import { ClaimsList } from "@/components/ClaimsList";
import { AuthorityClaimApproval } from "@/components/AuthorityClaimApproval";
import { useClaims } from "@/hooks/useClaims";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import heroImage from "@/assets/hero-plant.jpg";

const Index = () => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'dashboard' | 'claims'>('grid');
  const { user, userRole } = useAuth();
  const { plants, loading, addPlant, updatePlant, deletePlant } = usePlants();
  const { claims, loading: claimsLoading } = useClaims();
  
  // Enable automatic recording for plants
  useAutomaticRecording(plants, updatePlant);

  const handleAddPlant = async (newPlant: Plant) => {
    try {
      await addPlant(newPlant);
      toast.success("Plant added to blockchain!", {
        description: `${newPlant.name} has been registered with genesis hash`,
      });
    } catch (error) {
      console.error("Error adding plant:", error);
      toast.error("Failed to add plant", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleAddRecord = async (plantId: string, record: GrowthRecord) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const updatedPlant = {
      ...plant,
      growthRecords: [...plant.growthRecords, record],
      currentHeight: record.height,
      health: Math.min(100, plant.health + 5),
    };
    
    await updatePlant(plantId, updatedPlant);
    
    if (selectedPlant?.id === plantId) {
      setSelectedPlant(updatedPlant);
    }

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
        
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-nature bg-clip-text text-transparent">GrowLedger</span>{" "}
              <span className="gradient-blockchain bg-clip-text text-transparent">Bloom</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Track your plants manually or connect hardware sensors for automatic monitoring with AI-powered care suggestions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                size="lg"
                variant="hero"
                onClick={() => setShowAddDialog(true)}
                className="text-lg"
                disabled={userRole === 'authority'}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Plant
              </Button>
              {userRole && (
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Web3 Wallet & Weather Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <WalletConnect />
          <WeatherWidget />
        </div>
      </section>

      {/* Stats Section */}
      {plants.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <StatsOverview stats={calculateStats()} />
        </section>
      )}

      {/* Plants Grid / Dashboard */}
      <section className="container mx-auto px-4 py-12">
        {/* View Toggle */}
        {plants.length > 0 && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">Your Plant Garden</h2>
                <p className="text-muted-foreground mt-1">
                  Managing {plants.length} plant{plants.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                <TabsList>
                  <TabsTrigger value="grid" className="gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Plants
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="claims" className="gap-2">
                    <FileText className="h-4 w-4" />
                    {userRole === 'authority' ? 'Review Claims' : 'My Claims'}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {activeView === 'grid' && userRole !== 'authority' && (
              <Button variant="blockchain" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Plant
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <p className="text-muted-foreground">Loading your plants...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <Sprout className="w-16 h-16 mx-auto text-primary animate-float" />
              <h3 className="text-2xl font-semibold">No Plants Yet</h3>
              <p className="text-muted-foreground">
                Begin your journey by adding your first plant. Each plant gets a unique blockchain identity
                that tracks its entire growth history with AI-powered insights.
              </p>
              {userRole !== 'authority' && (
                <Button variant="hero" onClick={() => setShowAddDialog(true)} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Plant
                </Button>
              )}
            </div>
          </div>
        ) : activeView === 'dashboard' ? (
          <Dashboard plants={plants} />
        ) : activeView === 'claims' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-3xl font-bold">
                  {userRole === 'authority' ? 'Claim Verification' : 'Subsidy & Insurance Claims'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {userRole === 'authority' 
                    ? 'Review and process farmer claims' 
                    : 'Submit and track your government scheme claims'}
                </p>
              </div>
            </div>
            
            {userRole === 'authority' ? (
              <AuthorityClaimApproval claims={claims} loading={claimsLoading} />
            ) : (
              <>
                <ClaimSubmission plants={plants} />
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Your Claims</h3>
                  <ClaimsList claims={claims} loading={claimsLoading} />
                </div>
              </>
            )}
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
