import { Plant } from "@/types/plant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { shortenHash, verifyChain } from "@/utils/blockchain";
import { useState } from "react";
import { toast } from "sonner";

interface BlockchainExplorerProps {
  plant: Plant;
}

export const BlockchainExplorer = ({ plant }: BlockchainExplorerProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = verifyChain(plant.growthRecords);
    setIsVerifying(false);

    if (isValid) {
      toast.success("Blockchain verified! All records are authentic and tamper-proof.");
    } else {
      toast.error("Blockchain verification failed! Chain integrity compromised.");
    }
  };

  return (
    <Card className="glass-card shadow-blockchain">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Blockchain Explorer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and verify the complete blockchain history for {plant.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Genesis Block */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Genesis Block</p>
                <p className="text-xs text-muted-foreground">Block #0</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Origin
            </Badge>
          </div>
          <div className="space-y-1 mt-3">
            <p className="text-xs text-muted-foreground font-mono">
              Hash: {shortenHash(plant.genesisHash)}
            </p>
            <p className="text-xs text-muted-foreground">
              Created: {new Date(plant.plantedDate).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chain Blocks */}
        {plant.growthRecords.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link2 className="w-4 h-4" />
              Chain Blocks ({plant.growthRecords.length})
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {plant.growthRecords.map((record, index) => (
                <div 
                  key={record.id}
                  className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-accent">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        Block #{index + 1}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {record.source}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="font-mono">{shortenHash(record.hash)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="w-3 h-3" />
                      <span className="font-mono">{shortenHash(record.previousHash)}</span>
                    </div>
                    <p className="text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chain Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {plant.growthRecords.length + 1}
            </p>
            <p className="text-xs text-muted-foreground">Total Blocks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {plant.growthRecords.filter(r => r.source === 'automatic').length}
            </p>
            <p className="text-xs text-muted-foreground">Auto Records</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">
              {plant.growthRecords.filter(r => r.source === 'manual').length}
            </p>
            <p className="text-xs text-muted-foreground">Manual Records</p>
          </div>
        </div>

        {/* Verify Button */}
        <Button 
          onClick={handleVerifyChain} 
          disabled={isVerifying}
          className="w-full gradient-blockchain text-white"
        >
          {isVerifying ? (
            <>
              <Shield className="w-4 h-4 mr-2 animate-spin" />
              Verifying Chain...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Verify Blockchain Integrity
            </>
          )}
        </Button>

        {plant.growthRecords.length === 0 && (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No chain blocks yet. Add growth records to build the blockchain.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
