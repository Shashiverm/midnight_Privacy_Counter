import React from 'react';

interface WalletCardProps {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  connected,
  address,
  balance,
  network,
  onConnect,
  onDisconnect,
}) => {
  const formatAddress = (addr: string) => {
    if (addr.length < 24) return addr;
    return `${addr.slice(0, 14)}...${addr.slice(-8)}`;
  };

  const faucetUrl = network === 'preview'
    ? 'https://midnight-tmnight-preview.nethermind.dev'
    : 'https://midnight-tmnight-preprod.nethermind.dev';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Midnight Lace Wallet</h2>
          <p className="card-desc">Zero-knowledge identity & fee management</p>
        </div>
        {connected && (
          <span className="badge badge-network">
            <span className="status-dot"></span> Active
          </span>
        )}
      </div>

      {!connected ? (
        <div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Connect your Lace wallet or development key to submit zero-knowledge state proofs.
          </p>
          <button className="btn btn-primary btn-full" onClick={onConnect}>
            Connect Midnight Wallet
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <span className="form-label">Wallet Address</span>
            <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all' }}>
              {address}
            </div>
            <p className="form-hint">Display: {address ? formatAddress(address) : ''}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '10px 14px', background: 'var(--bg-accent-light)', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Balance</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-orange-dark)' }}>
                {balance.toLocaleString()} tNIGHT
              </div>
            </div>
            <a
              href={faucetUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              Get Faucet DUST &rarr;
            </a>
          </div>

          <button className="btn btn-secondary btn-full btn-sm" onClick={onDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};
