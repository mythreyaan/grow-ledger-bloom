import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, AlertCircle, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

export const WalletConnect = () => {
  const { address, balance, chainId, isConnecting, error, isConnected, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
    if (error) {
      toast.error(error);
    } else if (address) {
      toast.success("Wallet connected successfully!");
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success("Wallet disconnected");
  };

  const getChainName = (id: number | null) => {
    if (!id) return 'Unknown';
    const chains: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon',
      80001: 'Mumbai Testnet',
      11155111: 'Sepolia Testnet',
    };
    return chains[id] || `Chain ID: ${id}`;
  };

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <Card className="glass-card shadow-blockchain">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Web3 Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to enable blockchain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm text-muted-foreground">
                Connect your MetaMask wallet to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• View blockchain transactions</li>
                <li>• Verify growth records on-chain</li>
                <li>• Export data to Web3 storage</li>
              </ul>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full gradient-blockchain text-white"
            >
              {isConnecting ? (
                <>
                  <Wallet className="w-4 h-4 mr-2 animate-pulse" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>

            {typeof window !== 'undefined' && typeof window.ethereum === 'undefined' && (
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                Install MetaMask
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        ) : (
          <>
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Connected Wallet</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-mono text-sm font-semibold">{shortenAddress(address!)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-mono text-sm font-semibold">{balance} ETH</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Network</p>
                    <p className="text-sm font-semibold">{getChainName(chainId)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                ✓ Your blockchain records are now connected to your Web3 identity
              </p>
            </div>

            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
