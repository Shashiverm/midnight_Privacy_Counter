import React, { useState } from 'react';

interface CircuitRunnerProps {
  counter: number;
  totalUpdates: number;
  onIncrement: (secret: number, step: number) => Promise<void>;
  isProving: boolean;
  statusMessage: string;
}

export const CircuitRunner: React.FC<CircuitRunnerProps> = ({
  counter,
  totalUpdates,
  onIncrement,
  isProving,
  statusMessage,
}) => {
  const [stepValue, setStepValue] = useState<number>(5);
  const [privateSecret, setPrivateSecret] = useState<number>(5);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExecute = async () => {
    setErrorMessage(null);
    if (stepValue <= 0) {
      setErrorMessage('Step amount must be strictly positive (Compact assert).');
      return;
    }
    if (privateSecret !== stepValue) {
      setErrorMessage('Circuit Constraint Failed: Private witness secret does not match disclosed step.');
      return;
    }

    try {
      await onIncrement(privateSecret, stepValue);
    } catch (err: any) {
      setErrorMessage(err.message || 'Execution error');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Privacy Counter Circuit</h2>
          <p className="card-desc">Execute ZK circuit & deliberate disclosure on-chain</p>
        </div>
        <span className="badge badge-network">
          ZK Circuit: increment_counter
        </span>
      </div>

      {/* Counter Summary Box */}
      <div className="counter-display">
        <div className="counter-value-box">
          <span className="counter-label">Public Counter State</span>
          <span className="counter-number">{counter}</span>
        </div>
        <div className="counter-stats">
          <div className="stat-item">
            <span className="stat-value">{totalUpdates}</span>
            <span className="stat-label">Total Updates</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">144.3 KB</span>
            <span className="stat-label">Proving Key</span>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="form-group">
        <label className="form-label">
          Disclosed Increment Step (Public Value)
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={stepValue}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setStepValue(val);
            setPrivateSecret(val); // By default keep witness aligned
          }}
          disabled={isProving}
          className="input-field"
        />
        <p className="form-hint">
          This value is wrapped in <code className="mono">disclose(disclosedStep)</code> and written to public ledger state.
        </p>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label">
            Private Witness Secret (Client-Side Only)
          </label>
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            style={{ background: 'none', border: 'none', color: 'var(--color-orange-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
          >
            {showSecret ? 'Hide Secret' : 'Show Secret'}
          </button>
        </div>
        <input
          type={showSecret ? 'number' : 'password'}
          value={privateSecret}
          onChange={(e) => setPrivateSecret(parseInt(e.target.value) || 0)}
          disabled={isProving}
          className="input-field"
        />
        <p className="form-hint">
          <span className="badge-private">SHIELDED</span> Provided via <code className="mono">witness get_increment_secret()</code>. Never leaves your browser unshielded.
        </p>
      </div>

      {errorMessage && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
          <strong>Constraint Error:</strong> {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        className="btn btn-primary btn-full"
        onClick={handleExecute}
        disabled={isProving}
      >
        {isProving ? (
          <>
            <span className="status-dot" style={{ backgroundColor: '#ffffff' }}></span>
            Generating Local ZK Proof...
          </>
        ) : (
          'Generate ZK Proof & Disclose Delta'
        )}
      </button>

      {/* Proving Status Logs */}
      {statusMessage && (
        <div className="proving-steps">
          <div className="step-item">
            <span className="step-bullet"></span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
