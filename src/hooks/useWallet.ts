import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask not installed. Please install MetaMask to connect.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setWalletState({
        address,
        balance: (Number(balance) / 1e18).toFixed(4),
        chainId: Number(network.chainId),
        isConnecting: false,
        error: null,
      });
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      balance: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        connectWallet();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', connectWallet);
        window.ethereum.removeListener('chainChanged', connectWallet);
      }
    };
  }, [connectWallet, disconnectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isConnected: !!walletState.address,
  };
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
