import { useState } from "react";
import { Plant, SchemeType } from "@/types/plant";
import { useClaims } from "@/hooks/useClaims";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface ClaimSubmissionProps {
  plants: Plant[];
}

export const ClaimSubmission = ({ plants }: ClaimSubmissionProps) => {
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [schemeType, setSchemeType] = useState<SchemeType>("subsidy");
  const [claimAmount, setClaimAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { submitClaim } = useClaims();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlant || !claimAmount) {
      toast.error("Please fill all fields");
      return;
    }

    const plant = plants.find(p => p.id === selectedPlant);
    if (!plant) return;

    setSubmitting(true);
    try {
      await submitClaim(
        selectedPlant,
        plant.name,
        schemeType,
        parseFloat(claimAmount)
      );
      
      toast.success("Claim submitted successfully!", {
        description: "Your claim is now pending authority approval"
      });
      
      // Reset form
      setSelectedPlant("");
      setClaimAmount("");
    } catch (error) {
      toast.error("Failed to submit claim", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Submit Subsidy/Insurance Claim
        </CardTitle>
        <CardDescription>
          Request government verification for crop subsidies or insurance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plant">Select Plant</Label>
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plant" />
              </SelectTrigger>
              <SelectContent>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.name} ({plant.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schemeType">Scheme Type</Label>
            <Select value={schemeType} onValueChange={(v) => setSchemeType(v as SchemeType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subsidy">Subsidy</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Claim Amount (₹)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                className="pl-9"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Claim"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
