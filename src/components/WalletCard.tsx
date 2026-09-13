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
  mismatchedNetwork?: string | null;
  availableWallets: Array<{ id: string; name: string; icon?: string }>;
  activeNetwork?: string | null;
  onConnectReal: (walletId?: string) => Promise<void>;
  onConnectDev: () => void;
  onDisconnect: () => void;
  onSwitchNetwork?: (network: 'preprod' | 'preview') => void;
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
  activeNetwork,
  mismatchedNetwork,
  availableWallets,
  onConnectReal,
  onConnectDev,
  onDisconnect,
  onSwitchNetwork,
}) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const formatAddress = (addr: any) => {
    if (!addr) return '';
    const str =
      typeof addr === 'string'
        ? addr
        : addr?.unshieldedAddress || addr?.address || String(addr);
    if (!str || typeof str.slice !== 'function' || str.length < 24) return String(str);
    return `${str.slice(0, 14)}...${str.slice(-8)}`;
  };

  const safeAddressString = (addr: any) => {
    if (!addr) return '';
    if (typeof addr === 'string') return addr;
    return addr?.unshieldedAddress || addr?.address || String(addr);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isMainnetAddress = safeAddressString(address).startsWith('mn_addr1') || activeNetwork === 'mainnet';

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
                Midnight Lace extension detected! Click below to authorize your wallet on <strong>{network.toUpperCase()}</strong>.
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
                padding: '10px 12px',
                background: '#fff7ed',
                border: '1px solid var(--border-orange)',
                borderRadius: '8px',
                color: 'var(--color-orange-dark)',
                fontSize: '12px',
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Network Notice:</div>
              <p style={{ whiteSpace: 'pre-line' }}>{error}</p>

              {mismatchedNetwork && onSwitchNetwork && (
                <button
                  className="btn btn-secondary btn-sm btn-full"
                  style={{ marginTop: '8px', borderColor: 'var(--color-orange-primary)' }}
                  onClick={() => {
                    onSwitchNetwork(mismatchedNetwork as 'preprod' | 'preview');
                  }}
                >
                  Switch App to {mismatchedNetwork.toUpperCase()} &amp; Retry
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Connected via:</span>
              <span className="badge badge-network" style={{ padding: '2px 8px', fontSize: '11px' }}>
                {walletName}
              </span>
            </div>
            {activeNetwork && (
              <span
                className="badge"
                style={{
                  fontSize: '11px',
                  backgroundColor: activeNetwork === 'mainnet' ? '#fee2e2' : 'var(--bg-accent)',
                  color: activeNetwork === 'mainnet' ? '#b91c1c' : 'var(--color-orange-dark)',
                  fontWeight: 600,
                }}
              >
                Network: {activeNetwork.toUpperCase()}
              </span>
            )}
          </div>

          {/* Mainnet Warning Banner */}
          {isMainnetAddress && (
            <div
              style={{
                marginBottom: '14px',
                padding: '12px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#92400e',
                lineHeight: '1.5',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚠️</span> Lace Wallet is currently set to Mainnet
              </div>
              <p style={{ margin: '0 0 6px 0' }}>
                Your address starts with <code>mn_addr1...</code> (Mainnet). Testnet faucets will reject this address because they require a <strong>Preprod</strong> address (starting with <code>mn_addr_preprod1...</code>).
              </p>
              <div style={{ fontWeight: 600 }}>👉 How to get free testnet tNIGHT tokens:</div>
              <ol style={{ margin: '4px 0 0 0', paddingLeft: '18px' }}>
                <li>Open your Lace extension window</li>
                <li>Go to <strong>Settings</strong> &rarr; <strong>Network</strong> and select <strong>Midnight Preprod</strong></li>
                <li>Disconnect and Reconnect wallet here to load your Preprod address</li>
              </ol>
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span className="form-label" style={{ margin: 0 }}>Unshielded Address</span>
              <button
                type="button"
                onClick={() => copyToClipboard(safeAddressString(address), 'unshielded')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedKey === 'unshielded' ? '#16a34a' : 'var(--color-orange-primary)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 6px',
                }}
              >
                {copiedKey === 'unshielded' ? '✓ Copied!' : 'Copy Address'}
              </button>
            </div>
            <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all', fontSize: '12px' }}>
              {safeAddressString(address)}
            </div>
            <p className="form-hint">Display: {formatAddress(address)}</p>
          </div>

          {shieldedAddress && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="form-label" style={{ margin: 0 }}>Shielded Address (ZK)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(safeAddressString(shieldedAddress), 'shielded')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: copiedKey === 'shielded' ? '#16a34a' : 'var(--color-orange-primary)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                  }}
                >
                  {copiedKey === 'shielded' ? '✓ Copied!' : 'Copy Address'}
                </button>
              </div>
              <div className="code-chip" style={{ width: '100%', padding: '8px 10px', wordBreak: 'break-all', fontSize: '12px' }}>
                {safeAddressString(shieldedAddress)}
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
