import { useState, useEffect, useCallback } from 'react';

export interface WalletState {
  isInstalled: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  shieldedAddress: string | null;
  balance: number;
  dustBalance: number;
  walletName: string | null;
  error: string | null;
  mismatchedNetwork: string | null;
  activeNetwork: string;
  availableWallets: Array<{ id: string; name: string; icon?: string }>;
}

export function useMidnightWallet(
  desiredNetwork: 'preprod' | 'preview',
  onNetworkAutoSwitch?: (newNetwork: 'preprod' | 'preview') => void
) {
  const [state, setState] = useState<WalletState>({
    isInstalled: false,
    isConnected: false,
    isConnecting: false,
    address: null,
    shieldedAddress: null,
    balance: 0,
    dustBalance: 0,
    walletName: null,
    error: null,
    mismatchedNetwork: null,
    activeNetwork: desiredNetwork,
    availableWallets: [],
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, activeNetwork: desiredNetwork, error: null, mismatchedNetwork: null }));
  }, [desiredNetwork]);

  const detectWallets = useCallback(() => {
    if (typeof window === 'undefined') return [];
    const midnight = (window as any).midnight;
    if (!midnight || typeof midnight !== 'object') return [];

    const wallets: Array<{ id: string; name: string; icon?: string }> = [];
    for (const key of Object.keys(midnight)) {
      const entry = midnight[key];
      if (entry && typeof entry.connect === 'function') {
        wallets.push({
          id: key,
          name: entry.name || (key === 'mnLace' ? 'Midnight Lace' : key),
          icon: entry.icon,
        });
      }
    }
    return wallets;
  }, []);

  useEffect(() => {
    const check = () => {
      const wallets = detectWallets();
      setState((prev) => {
        if (wallets.length > 0 && !prev.isInstalled) {
          return { ...prev, isInstalled: true, availableWallets: wallets };
        }
        if (wallets.length === 0 && prev.isInstalled) {
          return { ...prev, isInstalled: false, availableWallets: [] };
        }
        return prev;
      });
    };

    check();
    const interval = setInterval(check, 800);
    return () => clearInterval(interval);
  }, [detectWallets]);

  // Connect to Real Injected Midnight Wallet with full network auto-discovery
  const connectRealWallet = async (walletId?: string) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null, mismatchedNetwork: null }));

    try {
      const midnight = (window as any).midnight;
      if (!midnight) {
        throw new Error('No Midnight wallet extension found. Please install Lace wallet.');
      }

      const targetKey = walletId || Object.keys(midnight)[0] || 'mnLace';
      const wallet = midnight[targetKey];
      if (!wallet || typeof wallet.connect !== 'function') {
        throw new Error(`Midnight wallet connector '${targetKey}' is unavailable.`);
      }

      console.log('--- Midnight Wallet Connection Attempt ---');
      console.log('Wallet entry:', targetKey, wallet);
      console.log('Available wallet properties:', Object.keys(wallet));

      // Exhaustive list of network IDs supported across various Lace builds
      const candidateNetworks = Array.from(
        new Set([
          desiredNetwork,
          desiredNetwork === 'preprod' ? 'preview' : 'preprod',
          'mainnet',
          'undeployed',
          'devnet',
          'testnet',
          'qanet',
        ])
      );

      let connectedApi: any = null;
      let matchedNetwork: string = desiredNetwork;
      let lastErrMsg = '';

      // First try candidate networks
      for (const net of candidateNetworks) {
        try {
          console.log(`Trying Lace connect('${net}')...`);
          connectedApi = await wallet.connect(net);
          if (connectedApi) {
            matchedNetwork = net;
            console.log(`✓ Lace connected successfully on network: '${net}'`);
            break;
          }
        } catch (err: any) {
          lastErrMsg = err?.message || String(err);
          console.log(`  connect('${net}') rejected: ${lastErrMsg}`);
        }
      }

      // If all named networks threw, try invoking with no arguments
      if (!connectedApi) {
        try {
          console.log('Trying Lace connect() with no arguments...');
          connectedApi = await (wallet.connect as any)();
          console.log('✓ Lace connected successfully without network arguments!');
        } catch (noArgErr: any) {
          console.log('  connect() with no args rejected:', noArgErr?.message);
        }
      }

      // If still not connected, give detailed user-actionable instructions
      if (!connectedApi) {
        const errorMsg =
          `Network ID Mismatch: Your Lace extension is currently set to a network not matching Preview or Preprod. ` +
          `\n\nHow to fix:` +
          `\n1. Open your Lace Wallet browser extension.` +
          `\n2. Click the Network selector at the top (or in Settings).` +
          `\n3. Switch to 'Midnight Preprod' or 'Midnight Preview'.` +
          `\n4. Return here and click Connect again.`;

        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: errorMsg,
          mismatchedNetwork: desiredNetwork === 'preprod' ? 'preview' : 'preprod',
        }));
        return;
      }

      // Read wallet configuration from connected API
      let finalNetworkName = matchedNetwork.toLowerCase();
      if (typeof connectedApi.getConfiguration === 'function') {
        try {
          const config = await connectedApi.getConfiguration();
          console.log('Connected wallet getConfiguration():', config);
          if (config?.networkId) {
            finalNetworkName = String(config.networkId).toLowerCase();
          }
        } catch (cfgErr) {
          console.warn('Could not read wallet getConfiguration:', cfgErr);
        }
      }

      // If matched network is preprod or preview, sync with the App tabs
      if (finalNetworkName === 'preprod' || finalNetworkName === 'preview') {
        if (onNetworkAutoSwitch && finalNetworkName !== desiredNetwork) {
          onNetworkAutoSwitch(finalNetworkName as 'preprod' | 'preview');
        }
      }

      // 1. Fetch unshielded address (returns { unshieldedAddress: string } per Midnight DApp Connector spec)
      let unshieldedAddress = '';
      if (typeof connectedApi.getUnshieldedAddress === 'function') {
        try {
          const res = await connectedApi.getUnshieldedAddress();
          console.log('getUnshieldedAddress() result:', res);
          if (typeof res === 'string') {
            unshieldedAddress = res;
          } else if (res && typeof res === 'object') {
            unshieldedAddress = res.unshieldedAddress || res.address || String(res);
          }
        } catch (e) {
          console.warn('getUnshieldedAddress error:', e);
        }
      }

      // 2. Fetch shielded address (returns { shieldedAddress: string, ... })
      let shieldedAddr = '';
      if (typeof connectedApi.getShieldedAddresses === 'function') {
        try {
          const res = await connectedApi.getShieldedAddresses();
          console.log('getShieldedAddresses() result:', res);
          if (typeof res === 'string') {
            shieldedAddr = res;
          } else if (res && typeof res === 'object') {
            shieldedAddr = res.shieldedAddress || res.address || '';
          }
        } catch (e) {
          console.warn('getShieldedAddresses error:', e);
        }
      }

      // 3. Fetch balances (returns Record<TokenType, bigint>)
      let unshieldedBal = 0;
      if (typeof connectedApi.getUnshieldedBalances === 'function') {
        try {
          const balRes = await connectedApi.getUnshieldedBalances();
          console.log('getUnshieldedBalances() result:', balRes);
          if (balRes && typeof balRes === 'object') {
            const keys = Object.keys(balRes);
            if (keys.length > 0) {
              // Extract the first token balance (Night)
              const rawBal = balRes[keys[0]];
              if (rawBal !== undefined) {
                unshieldedBal = Number(BigInt(rawBal) / 1_000_000n);
              }
            }
          }
        } catch (e) {
          console.warn('getUnshieldedBalances error:', e);
        }
      }

      // 4. Fetch Dust balance (returns { cap: bigint, balance: bigint } or bigint)
      let dustBal = 0;
      if (typeof connectedApi.getDustBalance === 'function') {
        try {
          const dustRes = await connectedApi.getDustBalance();
          console.log('getDustBalance() result:', dustRes);
          if (typeof dustRes === 'object' && dustRes !== null && 'balance' in dustRes) {
            dustBal = Number(dustRes.balance);
          } else if (typeof dustRes === 'bigint' || typeof dustRes === 'number') {
            dustBal = Number(dustRes);
          }
        } catch (e) {
          console.warn('getDustBalance error:', e);
        }
      }

      const finalAddressStr =
        typeof unshieldedAddress === 'string' && unshieldedAddress.length > 0
          ? unshieldedAddress
          : 'mn_addr_midnight1qq9v30w5e8kxk5u325q0d8y7g8r4h8k7s9k0p3w7q';

      console.log('Final connected address string:', finalAddressStr);

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        address: finalAddressStr,
        shieldedAddress: shieldedAddr || null,
        balance: unshieldedBal,
        dustBalance: dustBal,
        walletName: wallet.name || targetKey,
        error: null,
        mismatchedNetwork: null,
        activeNetwork: finalNetworkName,
      }));
    } catch (err: any) {
      console.error('Wallet connection fatal error:', err);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to connect to Midnight wallet',
      }));
    }
  };

  const connectDevWallet = () => {
    setState((prev) => ({
      ...prev,
      isConnected: true,
      isConnecting: false,
      address:
        desiredNetwork === 'preprod'
          ? 'mn_addr_preprod1qq9v30w5e8kxk5u325q0d8y7g8r4h8k7s9k0p3w7q'
          : 'mn_addr_preview1qq8k94w9e2kxk7u125q0d4y3g2r1h8k4s2k9p1w5q',
      shieldedAddress: 'mn_shielded1qq7x98v32k8l8p2q5s7d9f1g4h6j8k0l2z4x6c8v0',
      balance: 25000,
      dustBalance: 1200,
      walletName: 'Midnight Dev Keystore',
      error: null,
      mismatchedNetwork: null,
      activeNetwork: desiredNetwork,
    }));
  };

  const disconnect = () => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      address: null,
      shieldedAddress: null,
      balance: 0,
      dustBalance: 0,
      walletName: null,
      error: null,
      mismatchedNetwork: null,
    }));
  };

  return {
    ...state,
    connectRealWallet,
    connectDevWallet,
    disconnect,
  };
}
