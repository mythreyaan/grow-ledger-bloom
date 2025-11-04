import { useState } from "react";
import { Claim, ClaimStatus } from "@/types/plant";
import { useClaims } from "@/hooks/useClaims";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface AuthorityClaimApprovalProps {
  claims: Claim[];
  loading: boolean;
}

export const AuthorityClaimApproval = ({ claims, loading }: AuthorityClaimApprovalProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const { processClaim } = useClaims();

  const handleProcess = async (claimId: string, status: ClaimStatus) => {
    const remarkText = remarks[claimId] || "";
    
    if (!remarkText.trim()) {
      toast.error("Please provide remarks");
      return;
    }

    setProcessingId(claimId);
    try {
      await processClaim(claimId, status, remarkText);
      
      toast.success(`Claim ${status}!`, {
        description: `The claim has been ${status} successfully`
      });
      
      setRemarks({ ...remarks, [claimId]: "" });
    } catch (error) {
      toast.error("Failed to process claim", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingClaims = claims.filter(c => c.approvalStatus === 'pending');

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading claims...</p>
        </CardContent>
      </Card>
    );
  }

  if (pendingClaims.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <FileCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No pending claims to review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingClaims.map((claim) => (
        <Card key={claim.id} className="glass-card border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Claim #{claim.id.slice(0, 8)}
                </CardTitle>
                <CardDescription>
                  Submitted {formatDistanceToNow(claim.submittedAt, { addSuffix: true })}
                </CardDescription>
              </div>
              <Badge variant="secondary">PENDING REVIEW</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Farmer</p>
                <p className="font-medium">{claim.farmerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Scheme Type</p>
                <Badge variant="secondary" className="capitalize mt-1">
                  {claim.schemeType === 'subsidy' ? '🌾 Subsidy Scheme' : '🛡️ Insurance Scheme'}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Claim Amount</p>
                <p className="font-medium text-lg">₹{claim.claimAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plant Name</p>
                <p className="font-medium">{claim.plantName || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`remarks-${claim.id}`}>
                Verification Remarks *
              </Label>
              <Textarea
                id={`remarks-${claim.id}`}
                placeholder="Enter your verification remarks and decision reasoning..."
                value={remarks[claim.id] || ""}
                onChange={(e) => setRemarks({ ...remarks, [claim.id]: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => handleProcess(claim.id, 'approved')}
                disabled={processingId === claim.id}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve Claim
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleProcess(claim.id, 'rejected')}
                disabled={processingId === claim.id}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
