import { Claim, ClaimStatus } from "@/types/plant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ClaimsListProps {
  claims: Claim[];
  loading: boolean;
}

export const ClaimsList = ({ claims, loading }: ClaimsListProps) => {
  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: ClaimStatus): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading claims...</p>
        </CardContent>
      </Card>
    );
  }

  if (claims.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No claims submitted yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <Card key={claim.id} className="glass-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  Claim #{claim.id.slice(0, 8)}
                </CardTitle>
                <CardDescription>
                  Submitted {formatDistanceToNow(claim.submittedAt, { addSuffix: true })}
                </CardDescription>
              </div>
              <Badge variant={getStatusVariant(claim.approvalStatus)} className="gap-1">
                {getStatusIcon(claim.approvalStatus)}
                {claim.approvalStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Farmer</p>
                <p className="font-medium">{claim.farmerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Scheme Type</p>
                <p className="font-medium capitalize">{claim.schemeType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Claim Amount</p>
                <p className="font-medium">₹{claim.claimAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plant ID</p>
                <p className="font-medium text-xs">{claim.plantId.slice(0, 12)}...</p>
              </div>
            </div>
            
            {claim.remarks && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                <p className="text-sm">{claim.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
