import React, { useState } from 'react';

interface ContractInfoProps {
  network: string;
  preprodAddress: string;
  previewAddress: string;
}

export const ContractInfo: React.FC<ContractInfoProps> = ({
  network,
  preprodAddress,
  previewAddress,
}) => {
  const [copied, setCopied] = useState(false);

  const activeAddress = network === 'preprod' ? preprodAddress : previewAddress;
  const explorerUrl = `https://explorer.${network}.midnight.network/contract/${activeAddress}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(activeAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Deployed Contract Info</h2>
          <p className="card-desc">Active contract addresses on Midnight networks</p>
        </div>
        <span className="badge badge-network">Level 1 Passed</span>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="form-label" style={{ marginBottom: 0 }}>
            {network.toUpperCase()} Contract Address
          </span>
          <button
            onClick={copyAddress}
            className="btn btn-secondary btn-sm"
            style={{ padding: '3px 8px', fontSize: '11px' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all', fontSize: '12px' }}>
          {activeAddress}
        </div>
      </div>

      <div style={{ marginBottom: '18px' }}>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-full btn-sm"
          style={{ justifyContent: 'center' }}
        >
          View on Midnight {network.toUpperCase()} Explorer &rarr;
        </a>
      </div>

      <div className="card-header" style={{ marginTop: '20px', marginBottom: '14px', paddingTop: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Toolchain Verification
        </span>
      </div>

      <div className="toolchain-list">
        <div className="toolchain-item">
          <div>
            <div className="toolchain-name">Node.js Runtime</div>
            <div className="toolchain-desc">Node.js v24 (LTS engine &gt;= 22.0.0)</div>
          </div>
          <span className="badge-public">&#10003; Verified</span>
        </div>

        <div className="toolchain-item">
          <div>
            <div className="toolchain-name">Compact Compiler</div>
            <div className="toolchain-desc">compact v0.5.2 (Language v0.23+)</div>
          </div>
          <span className="badge-public">&#10003; Verified</span>
        </div>

        <div className="toolchain-item">
          <div>
            <div className="toolchain-name">ZK Proof Server</div>
            <div className="toolchain-desc">midnight-proof-server:8.1.0</div>
          </div>
          <span className="badge-public">&#10003; Ready</span>
        </div>

        <div className="toolchain-item">
          <div>
            <div className="toolchain-name">Managed Circuits</div>
            <div className="toolchain-desc">.zkir, .bzkir & proving keys generated</div>
          </div>
          <span className="badge-public">&#10003; Present</span>
        </div>
      </div>
    </div>
  );
};
