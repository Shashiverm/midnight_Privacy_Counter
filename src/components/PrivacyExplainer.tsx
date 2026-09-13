import React from 'react';

export const PrivacyExplainer: React.FC = () => {
  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <div>
          <h2 className="card-title">Privacy Architecture & Data Boundaries</h2>
          <p className="card-desc">Understanding Public Ledger State vs Private Witness</p>
        </div>
        <span className="badge badge-network">Compact 0.23+</span>
      </div>

      <table className="privacy-table">
        <thead>
          <tr>
            <th>Data Point</th>
            <th>Boundary</th>
            <th>Visibility & Scope</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>public ledger counter</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Accumulated value</div>
            </td>
            <td><span className="badge-public">PUBLIC</span></td>
            <td>Stored directly on-chain. Anyone and any node validator can read and inspect this value.</td>
          </tr>
          <tr>
            <td>
              <strong>public ledger totalUpdates</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Transaction tally</div>
            </td>
            <td><span className="badge-public">PUBLIC</span></td>
            <td>Globally verifiable transaction sequence number. Monotonically incremented.</td>
          </tr>
          <tr>
            <td>
              <strong>witness get_increment_secret()</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>User private entropy</div>
            </td>
            <td><span className="badge-private">PRIVATE</span></td>
            <td>Client-only witness. Never sent in transactions, never stored in blocks, never visible to observers.</td>
          </tr>
          <tr>
            <td>
              <strong>disclose(disclosedStep)</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Selective disclosure</div>
            </td>
            <td><span className="badge-network">DELIBERATE</span></td>
            <td>Explicit gatekeeper in Compact. Controls exactly what computation output transitions onto the public ledger.</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '20px', padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ZK Proof Guarantee (Zero-Knowledge Invariant)
        </span>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          The user proves to the Midnight blockchain that they possess a valid private witness secret matching the condition{' '}
          <code className="mono">secret == disclosedStep && secret &gt; 0</code>, without exposing their private memory state to any on-chain observer.
        </p>
      </div>
    </div>
  );
};
