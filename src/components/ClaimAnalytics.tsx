import { Claim } from "@/types/plant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ClaimAnalyticsProps {
  claims: Claim[];
}

export const ClaimAnalytics = ({ claims }: ClaimAnalyticsProps) => {
  const totalClaims = claims.length;
  const approved = claims.filter(c => c.approvalStatus === 'approved').length;
  const rejected = claims.filter(c => c.approvalStatus === 'rejected').length;
  const pending = claims.filter(c => c.approvalStatus === 'pending').length;
  
  const totalAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
  const approvedAmount = claims
    .filter(c => c.approvalStatus === 'approved')
    .reduce((sum, c) => sum + c.claimAmount, 0);

  const subsidyClaims = claims.filter(c => c.schemeType === 'subsidy').length;
  const insuranceClaims = claims.filter(c => c.schemeType === 'insurance').length;

  const stats = [
    {
      title: "Total Claims",
      value: totalClaims,
      icon: TrendingUp,
      description: "All submitted claims"
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      description: "Successfully verified",
      color: "text-green-500"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      description: "Awaiting review",
      color: "text-yellow-500"
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      description: "Not approved",
      color: "text-red-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Overview
            </CardTitle>
            <CardDescription>Total claim amounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Claimed</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Amount</p>
              <p className="text-2xl font-bold text-green-500">
                ₹{approvedAmount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Scheme Distribution</CardTitle>
            <CardDescription>Claims by scheme type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Subsidy Claims</p>
              <p className="text-2xl font-bold">{subsidyClaims}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Insurance Claims</p>
              <p className="text-2xl font-bold">{insuranceClaims}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
