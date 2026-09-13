import React from 'react';

interface WalletCardProps {
  isInstalled: boolean;
  connected: boolean;
  isConnecting: boolean;
  address: string | null;
  shieldedAddress: string | null;
  balance: number;
  dustBalance: number;
  walletName: string | null;
  error: string | null;
  network: string;
  availableWallets: Array<{ id: string; name: string; icon?: string }>;
  onConnectReal: (walletId?: string) => Promise<void>;
  onConnectDev: () => void;
  onDisconnect: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  isInstalled,
  connected,
  isConnecting,
  address,
  shieldedAddress,
  balance,
  dustBalance,
  walletName,
  error,
  network,
  availableWallets,
  onConnectReal,
  onConnectDev,
  onDisconnect,
}) => {
  const formatAddress = (addr: string) => {
    if (addr.length < 24) return addr;
    return `${addr.slice(0, 14)}...${addr.slice(-8)}`;
  };

  const faucetUrl =
    network === 'preview'
      ? 'https://midnight-tmnight-preview.nethermind.dev'
      : 'https://midnight-tmnight-preprod.nethermind.dev';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Midnight Lace Wallet</h2>
          <p className="card-desc">Zero-knowledge identity &amp; fee management</p>
        </div>
        {connected ? (
          <span className="badge badge-network">
            <span className="status-dot"></span> Connected
          </span>
        ) : (
          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
            Disconnected
          </span>
        )}
      </div>

      {!connected ? (
        <div>
          {isInstalled ? (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Midnight Lace extension detected! Click below to authorize your wallet.
              </p>
              {availableWallets.length > 0 ? (
                availableWallets.map((w) => (
                  <button
                    key={w.id}
                    className="btn btn-primary btn-full"
                    style={{ marginBottom: '10px' }}
                    onClick={() => onConnectReal(w.id)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Waiting for authorization...' : `Connect ${w.name}`}
                  </button>
                ))
              ) : (
                <button
                  className="btn btn-primary btn-full"
                  style={{ marginBottom: '10px' }}
                  onClick={() => onConnectReal()}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Authorizing with Lace...' : 'Connect Midnight Lace'}
                </button>
              )}
            </div>
          ) : (
            <div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginBottom: '14px',
                }}
              >
                <strong>Lace Extension Not Detected</strong>
                <p style={{ marginTop: '4px', fontSize: '12px' }}>
                  To connect your real browser wallet, install the Midnight Lace Extension:
                </p>
                <a
                  href="https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhbcgcjhendiiel"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm btn-full"
                  style={{ marginTop: '8px', justifyContent: 'center' }}
                >
                  Install Lace Extension &rarr;
                </a>
              </div>

              <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '12px', color: '#94a3b8' }}>
                &mdash; OR &mdash;
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={onConnectDev}
              >
                Connect Local Dev Keystore
              </button>
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#b91c1c',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          {walletName && (
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connected via:</span>
              <span className="badge badge-network" style={{ padding: '2px 8px', fontSize: '11px' }}>
                {walletName}
              </span>
            </div>
          )}

          <div className="form-group">
            <span className="form-label">Unshielded Address</span>
            <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all', fontSize: '12px' }}>
              {address}
            </div>
            <p className="form-hint">Display: {address ? formatAddress(address) : ''}</p>
          </div>

          {shieldedAddress && (
            <div className="form-group">
              <span className="form-label">Shielded Address (ZK)</span>
              <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all', fontSize: '12px' }}>
                {shieldedAddress}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px 14px',
              background: 'var(--bg-accent-light)',
              borderRadius: '8px',
              border: '1px solid var(--border-orange)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Wallet Balance
              </span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-orange-dark)' }}>
                {balance.toLocaleString()} tNIGHT
              </div>
              {dustBalance > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  DUST: {dustBalance.toLocaleString()} units
                </div>
              )}
            </div>
            <a
              href={faucetUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              Get Faucet tNIGHT &rarr;
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
