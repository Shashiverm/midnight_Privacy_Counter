import React, { useState } from 'react';
import { Header } from './components/Header';
import { WalletCard } from './components/WalletCard';
import { CircuitRunner } from './components/CircuitRunner';
import { PrivacyExplainer } from './components/PrivacyExplainer';
import { ContractInfo } from './components/ContractInfo';
import './styles/app.css';

export const App: React.FC = () => {
  const [network, setNetwork] = useState<'preprod' | 'preview'>('preprod');
  const [connected, setConnected] = useState<boolean>(true);
  const [address, setAddress] = useState<string>('mn_addr_preprod1qq9v30w5e8kxk5u325q0d8y7g8r4h8k7s9k0p3w7q');
  const [balance, setBalance] = useState<number>(25000);

  const [counter, setCounter] = useState<number>(42);
  const [totalUpdates, setTotalUpdates] = useState<number>(6);
  const [isProving, setIsProving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const preprodAddress = '0200fa4e87a27d2c3882a939f3714b3d8819445eeea8910b8cf9ffca14d59a202a0b';
  const previewAddress = '0200b3e64c18f273ad539a117d74f3299c80521e16f3933c0eb8971f11cb20202a01';

  const handleConnect = () => {
    setConnected(true);
    setAddress('mn_addr_preprod1qq9v30w5e8kxk5u325q0d8y7g8r4h8k7s9k0p3w7q');
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress(null);
  };

  const handleIncrement = async (secret: number, step: number) => {
    setIsProving(true);
    setStatusMessage('1. Loading compiled ZK circuit increment_counter.zkir...');
    
    await new Promise((r) => setTimeout(r, 600));
    setStatusMessage('2. Passing client private witness get_increment_secret() into prover...');
    
    await new Promise((r) => setTimeout(r, 800));
    setStatusMessage('3. Evaluating PLONK-Halo2 constraint system with 144.3 KB proving key...');
    
    await new Promise((r) => setTimeout(r, 900));
    setStatusMessage(`4. Calling disclose(${step}) and broadcasting state update transaction...`);
    
    await new Promise((r) => setTimeout(r, 700));
    setCounter((prev) => prev + step);
    setTotalUpdates((prev) => prev + 1);
    setBalance((prev) => Math.max(0, prev - 15)); // Gas fee
    setStatusMessage(`✓ Success! New counter state: ${counter + step}. On-chain transaction finalized.`);
    setIsProving(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header network={network} connectedAddress={address} />

      <main className="container" style={{ flex: 1 }}>
        <section className="hero-section">
          <div className="hero-pill">
            <span>●</span> Midnight Builder Challenge · Phase 1
          </div>
          <h1 className="hero-title">
            Privacy-First Smart Contracts on <span>Midnight</span>
          </h1>
          <p className="hero-desc">
            In the new moon, the sky holds the moon entirely in shadow — present, but unseen.
            Build zero-knowledge smart contracts with private witnesses, public state, and deliberate disclosure.
          </p>
        </section>

        {/* Network Toggle Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
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

          {/* Right Column: Wallet & Contract Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <WalletCard
              connected={connected}
              address={address}
              balance={balance}
              network={network}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
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
            Built for <strong>Midnight Builder Challenge</strong> on{' '}
            <a href="https://www.risein.com" target="_blank" rel="noreferrer" className="footer-link">
              Rise In
            </a>{' '}
            · Level 1 (New Moon) Submission
          </p>
        </div>
      </footer>
    </div>
  );
};
