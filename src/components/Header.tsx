import React from 'react';

interface HeaderProps {
  network: string;
  connectedAddress: string | null;
}

export const Header: React.FC<HeaderProps> = ({ network, connectedAddress }) => {
  return (
    <header className="app-header">
      <div className="container header-inner">
        <div className="brand-wrapper">
          <div className="brand-icon">🌑</div>
          <div>
            <h1 className="brand-title">Midnight Privacy Counter</h1>
            <p className="brand-subtitle">Zero-Knowledge State Engine</p>
          </div>
        </div>

        <div className="header-meta">
          <span className="badge badge-network">
            <span className="status-dot"></span>
            ZK Prover Online
          </span>
          <span className="badge badge-network">
            <span className="status-dot"></span>
            {network.toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};
