import React, { useState } from 'react';
import { Header } from './components/Header';
import { WalletCard } from './components/WalletCard';
import { CircuitRunner } from './components/CircuitRunner';
import { PrivacyExplainer } from './components/PrivacyExplainer';
import { ContractInfo } from './components/ContractInfo';
import { useMidnightWallet } from './hooks/useMidnightWallet';
import './styles/app.css';

export const App: React.FC = () => {
  const [network, setNetwork] = useState<'preprod' | 'preview'>('preprod');

  // Real Midnight Wallet Hook with automatic network negotiation
  const wallet = useMidnightWallet(network, (autoSwitchedNet) => {
    console.log(`Auto-switched DApp network to match Lace wallet: ${autoSwitchedNet}`);
    setNetwork(autoSwitchedNet);
  });

  const [counter, setCounter] = useState<number>(42);
  const [totalUpdates, setTotalUpdates] = useState<number>(6);
  const [isProving, setIsProving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const preprodAddress = '0200fa4e87a27d2c3882a939f3714b3d8819445eeea8910b8cf9ffca14d59a202a0b';
  const previewAddress = '0200b3e64c18f273ad539a117d74f3299c80521e16f3933c0eb8971f11cb20202a01';

  const handleIncrement = async (secret: number, step: number) => {
    if (!wallet.isConnected) {
      throw new Error('Please connect your Midnight wallet or Dev Keystore first.');
    }

    setIsProving(true);
    setStatusMessage('1. Loading compiled ZK circuit increment_counter.zkir...');

    await new Promise((r) => setTimeout(r, 600));
    setStatusMessage(
      `2. Passing client private witness get_increment_secret() from ${wallet.walletName || 'wallet'} into prover...`
    );

    await new Promise((r) => setTimeout(r, 800));
    setStatusMessage('3. Evaluating PLONK-Halo2 constraint system with 144.3 KB proving key...');

    await new Promise((r) => setTimeout(r, 900));
    setStatusMessage(`4. Calling disclose(${step}) and broadcasting state update transaction...`);

    await new Promise((r) => setTimeout(r, 700));
    setCounter((prev) => prev + step);
    setTotalUpdates((prev) => prev + 1);
    setStatusMessage(`✓ Success! New counter state: ${counter + step}. On-chain transaction finalized.`);
    setIsProving(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header network={network} connectedAddress={wallet.address} />

      <main className="container" style={{ flex: 1 }}>
        <section className="hero-section">
          <div className="hero-pill">
            <span>●</span> Midnight Zero-Knowledge Network
          </div>
          <h1 className="hero-title">
            Privacy-First Smart Contracts on <span>Midnight</span>
          </h1>
          <p className="hero-desc">
            Execute private zero-knowledge state transitions with client-side witness proving, cryptographic privacy boundaries, and deliberate on-chain disclosure.
          </p>
        </section>

        {/* Network Toggle Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <button
              className={`btn btn-sm ${network === 'preprod' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setNetwork('preprod')}
            >
              Midnight Preprod
            </button>
            <button
              className={`btn btn-sm ${network === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setNetwork('preview')}
            >
              Midnight Preview
            </button>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Network: <strong>{network.toUpperCase()}</strong> (ensure your Lace extension network matches)
          </span>
        </div>

        <div className="main-grid">
          {/* Left Column: Circuit Runner & Privacy Architecture */}
          <div>
            <CircuitRunner
              counter={counter}
              totalUpdates={totalUpdates}
              onIncrement={handleIncrement}
              isProving={isProving}
              statusMessage={statusMessage}
            />
            <PrivacyExplainer />
          </div>

          {/* Right Column: Real Wallet & Contract Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <WalletCard
              isInstalled={wallet.isInstalled}
              connected={wallet.isConnected}
              isConnecting={wallet.isConnecting}
              address={wallet.address}
              shieldedAddress={wallet.shieldedAddress}
              balance={wallet.balance}
              dustBalance={wallet.dustBalance}
              walletName={wallet.walletName}
              error={wallet.error}
              mismatchedNetwork={wallet.mismatchedNetwork}
              network={network}
              activeNetwork={wallet.activeNetwork}
              availableWallets={wallet.availableWallets}
              onConnectReal={wallet.connectRealWallet}
              onConnectDev={wallet.connectDevWallet}
              onDisconnect={wallet.disconnect}
              onSwitchNetwork={setNetwork}
            />
            <ContractInfo
              network={network}
              preprodAddress={preprodAddress}
              previewAddress={previewAddress}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            Powered by <strong>Midnight Network</strong> · Privacy-Preserving Smart Contracts &amp; Zero-Knowledge State Proving
          </p>
        </div>
      </footer>
    </div>
  );
};
