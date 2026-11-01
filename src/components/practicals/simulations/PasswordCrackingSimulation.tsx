import { useState, useId } from 'react';

interface PasswordCrackingSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function PasswordCrackingSimulation({ onStepComplete, onSimulationSuccess }: PasswordCrackingSimulationProps) {
  const [candidatePassword, setCandidatePassword] = useState('P@ssw0rd2026!');
  const [selectedHashTarget, setSelectedHashTarget] = useState<'password' | 'admin123' | 'dragon' | 'studyverse'>('password');
  const [isCracking, setIsCracking] = useState(false);
  const [crackedWord, setCrackedWord] = useState<string | null>(null);
  const [testedCount, setTestedCount] = useState(0);
  const [crackSpeedMs, setCrackSpeedMs] = useState(0);

  // For bcrypt salt demo
  const [bcryptSaltPass, setBcryptSaltPass] = useState('SecretToken2026');
  const [generatedHashes, setGeneratedHashes] = useState<Array<{ salt: string; hash: string }>>([]);

  const passwordInputId = useId();
  const targetHashSelectId = useId();
  const bcryptInputId = useId();

  // Fictional Target Hashes (SHA-256)
  const TARGET_HASHES = {
    password: {
      hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      label: 'Victim Account 1 (Hash: 5e8848...)',
      plaintext: 'password',
    },
    admin123: {
      hash: '0192023a7bbd73250516f069df18b500', // MD5
      label: 'Victim Account 2 (MD5: 019202...)',
      plaintext: 'admin123',
    },
    dragon: {
      hash: 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86', // SHA-512
      label: 'Victim Account 3 (SHA-512: b109f3...)',
      plaintext: 'dragon',
    },
    studyverse: {
      hash: '6a8b792e3d540291f0923e41bca96431f92e7614d35272a5a1f68e0d662c93d2',
      label: 'Victim Account 4 (SHA-256: 6a8b79...)',
      plaintext: 'studyverse',
    },
  };

  const DICTIONARY = [
    '123456',
    'password',
    '123456789',
    'qwerty',
    'admin',
    'welcome',
    '12345',
    'iloveyou',
    'monkey',
    'dragon',
    'sunshine',
    'princess',
    'football',
    'shadow',
    'master',
    'admin123',
    'superman',
    'pass123',
    'studyverse',
    'correct-horse-battery-staple',
  ];

  // Real-time entropy computation
  const calcEntropy = (pwd: string) => {
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 32;

    if (poolSize === 0 || pwd.length === 0) return { bits: 0, poolSize: 0, strength: 'None' };

    const bits = Math.round(pwd.length * Math.log2(poolSize));
    let strength = 'Very Weak';
    if (bits >= 36) strength = 'Weak';
    if (bits >= 60) strength = 'Moderate';
    if (bits >= 80) strength = 'Strong';
    if (bits >= 100) strength = 'Very Strong';

    return { bits, poolSize, strength };
  };

  const entropy = calcEntropy(candidatePassword);

  const handleRunDictionaryAttack = () => {
    setIsCracking(true);
    setCrackedWord(null);
    setTestedCount(0);
    const start = performance.now();

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTestedCount(index);

      if (index >= DICTIONARY.length) {
        clearInterval(interval);
        setIsCracking(false);
        const target = TARGET_HASHES[selectedHashTarget];
        const match = DICTIONARY.find((w) => w === target.plaintext);
        setCrackedWord(match || null);
        setCrackSpeedMs(Math.round(performance.now() - start));
        onStepComplete?.(2);
        onSimulationSuccess?.();
      }
    }, 45);
  };

  const handleGenerateBcryptSalt = () => {
    // Generate simulated bcrypt string with random 128-bit salt representation
    const randomHex = () => Math.random().toString(36).substring(2, 10);
    const fakeSalt = `$2b$12$${randomHex()}${randomHex()}${randomHex()}`;
    const fakeHash = `${fakeSalt}.${randomHex()}${randomHex()}`;

    setGeneratedHashes((prev) => [
      { salt: fakeSalt.substring(7, 29), hash: fakeHash },
      ...prev.slice(0, 3),
    ]);
    onStepComplete?.(3);
  };

  return (
    <div className="simulation-pwd-root">
      <div className="pwd-grid-layout">
        {/* Left Column: Password Strength & Entropy Analyzer */}
        <div className="pwd-card">
          <div className="sim-card-header">
            <span className="window-title">📊 Mathematical Password Entropy Calculator</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label htmlFor={passwordInputId}>Test Password or Passphrase</label>
              <input
                id={passwordInputId}
                type="text"
                className="sim-input font-mono"
                value={candidatePassword}
                onChange={(e) => {
                  setCandidatePassword(e.target.value);
                  onStepComplete?.(1);
                }}
                placeholder="Enter password..."
              />
            </div>

            {/* Entropy Metrics Grid */}
            <div className="entropy-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Entropy:</span>
                <span className="metric-val text-cyan font-mono">{entropy.bits} bits</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Character Pool (R):</span>
                <span className="metric-val font-mono">{entropy.poolSize} possible</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Password Length:</span>
                <span className="metric-val font-mono">{candidatePassword.length} chars</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Rating:</span>
                <span
                  className={`metric-val font-bold ${
                    entropy.bits >= 80 ? 'text-green' : entropy.bits >= 50 ? 'text-amber' : 'text-red'
                  }`}
                >
                  {entropy.strength}
                </span>
              </div>
            </div>

            {/* Entropy Progress Bar */}
            <div className="entropy-bar-track">
              <div
                className={`entropy-bar-fill ${
                  entropy.bits >= 80 ? 'fill-green' : entropy.bits >= 50 ? 'fill-amber' : 'fill-red'
                }`}
                style={{ width: `${Math.min(100, (entropy.bits / 120) * 100)}%` }}
              />
            </div>

            <div className="pwd-presets-bar">
              <span className="presets-label">Try Common Patterns:</span>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => setCandidatePassword('password')}
              >
                "password" (18 bits)
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => setCandidatePassword('P@ssw0rd2026')}
              >
                "P@ssw0rd2026" (52 bits)
              </button>
              <button
                type="button"
                className="btn-quick-payload"
                onClick={() => setCandidatePassword('correct-horse-battery-staple')}
              >
                Passphrase (128 bits)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Dictionary Attack Engine */}
        <div className="pwd-card">
          <div className="sim-card-header db-header">
            <span className="window-title">⚡ High-Speed Dictionary Attack Simulator</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label htmlFor={targetHashSelectId}>Select Stolen Un-salted Hash from Database Dump</label>
              <select
                id={targetHashSelectId}
                className="sim-input font-mono"
                value={selectedHashTarget}
                onChange={(e) => setSelectedHashTarget(e.target.value as any)}
                disabled={isCracking}
              >
                {Object.entries(TARGET_HASHES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="target-hash-display font-mono">
              <span className="hash-label">Target Digest:</span>
              <code className="text-red">{TARGET_HASHES[selectedHashTarget].hash}</code>
            </div>

            <div className="crack-actions-row">
              <button
                type="button"
                className="btn-sim-action"
                onClick={handleRunDictionaryAttack}
                disabled={isCracking}
              >
                {isCracking ? '🔄 Cracking Hashes...' : '🚀 Launch Dictionary Attack'}
              </button>
            </div>

            {/* Live Cracking Console Output */}
            <div className="crack-terminal-box font-mono">
              <div className="term-line text-cyan">[!] Initializing rockyou dictionary wordlist...</div>
              <div className="term-line text-subtle">
                [+] Tested {testedCount} / {DICTIONARY.length} candidate words...
              </div>

              {crackedWord && (
                <div className="term-line text-green font-bold">
                  [✓] COLLISION FOUND! Plaintext password: "{crackedWord}" in {crackSpeedMs}ms!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Salted Bcrypt Generator Demo */}
      <div className="bcrypt-salt-panel">
        <div className="sim-card-header">
          <span className="window-title">🛡️ Defense: Why Salted Bcrypt Defeats Rainbow Tables</span>
        </div>
        <div className="sim-card-body bcrypt-grid">
          <div className="bcrypt-input-side">
            <p className="bcrypt-explainer">
              When using un-salted hashes, identical passwords produce identical hashes across all accounts. With modern
              salted hashing (Bcrypt / Argon2), a unique random 128-bit salt is generated for every user, making precomputed
              rainbow table attacks useless.
            </p>
            <div className="sim-field-group">
              <label htmlFor={bcryptInputId}>Password to Hash with Bcrypt</label>
              <input
                id={bcryptInputId}
                type="text"
                className="sim-input font-mono"
                value={bcryptSaltPass}
                onChange={(e) => setBcryptSaltPass(e.target.value)}
              />
            </div>
            <button type="button" className="btn-sim-action" onClick={handleGenerateBcryptSalt}>
              Generate Salted Bcrypt Hash
            </button>
          </div>

          <div className="bcrypt-output-side">
            <span className="output-label">Generated Salted Hashes (Notice completely unique outputs):</span>
            <div className="generated-hashes-list font-mono">
              {generatedHashes.length === 0 ? (
                <div className="empty-hashes">Click "Generate Salted Bcrypt Hash" to see unique salts.</div>
              ) : (
                generatedHashes.map((h, i) => (
                  <div key={i} className="hash-output-entry">
                    <span className="salt-tag">Salt: {h.salt}</span>
                    <span className="hash-string text-green">{h.hash}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
