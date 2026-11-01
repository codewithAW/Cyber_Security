import { useState } from 'react';

interface CryptoSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function CryptoSimulation({ onStepComplete, onSimulationSuccess }: CryptoSimulationProps) {
  const [algorithm, setAlgorithm] = useState<'AES-GCM' | 'RSA-2048' | 'SHA-256' | 'Caesar'>('AES-GCM');
  const [plaintext, setPlaintext] = useState('Confidential transfer: $10,000 to Account #101');
  const [secretKey, setSecretKey] = useState('StudyVerseMasterSecretKey2026!');
  const [caesarShift, setCaesarShift] = useState(3);

  const [ciphertext, setCiphertext] = useState('');
  const [ivHex, setIvHex] = useState('');
  const [authTagHex, setAuthTagHex] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [tamperedNotice, setTamperedNotice] = useState<string | null>(null);

  const runCaesar = (str: string, shift: number) => {
    return str
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const simpleSha256Sim = (str: string) => {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hex = (hash >>> 0).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
  };

  const handleEncrypt = () => {
    setTamperedNotice(null);
    setDecryptedText('');

    if (algorithm === 'AES-GCM') {
      const fakeIv = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');

      const fakeCipher = Array.from({ length: plaintext.length }, (_, i) => {
        const charByte = plaintext.charCodeAt(i);
        const keyByte = secretKey.charCodeAt(i % secretKey.length);
        return (charByte ^ keyByte).toString(16).padStart(2, '0');
      }).join('');

      const fakeTag = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');

      setIvHex(fakeIv);
      setCiphertext(fakeCipher);
      setAuthTagHex(fakeTag);
      onStepComplete?.(1);
    } else if (algorithm === 'Caesar') {
      const encrypted = runCaesar(plaintext, caesarShift);
      setCiphertext(encrypted);
      setIvHex('N/A (Substitution)');
      setAuthTagHex('None (Unauthenticated)');
      onStepComplete?.(1);
    } else if (algorithm === 'SHA-256') {
      const hash = simpleSha256Sim(plaintext);
      setCiphertext(hash);
      setIvHex('None (Deterministic)');
      setAuthTagHex('N/A (One-Way Digest)');
      onStepComplete?.(3);
    } else if (algorithm === 'RSA-2048') {
      const fakeRsa = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      setCiphertext(fakeRsa);
      setIvHex('OAEP Padding Nonce');
      setAuthTagHex('Digital Signature Verified');
      onStepComplete?.(1);
    }
  };

  const handleTamperCiphertext = () => {
    if (!ciphertext) return;
    const flipped = ciphertext[0] === 'a' ? 'b' : 'a';
    const modified = flipped + ciphertext.substring(1);
    setCiphertext(modified);
    setTamperedNotice('⚠️ Ciphertext byte altered! Try decrypting to see AEAD authentication tag validation.');
  };

  const handleDecrypt = () => {
    if (!ciphertext) return;

    if (algorithm === 'AES-GCM') {
      if (tamperedNotice) {
        alert('🚨 DECRYPTION ABORTED: AEAD Authentication Tag Mismatch!\n\nAES-GCM detected integrity failure.');
        setDecryptedText('[DECRYPTION ERROR: INTEGRITY CHECK FAILED]');
        onStepComplete?.(2);
        onSimulationSuccess?.();
      } else {
        setDecryptedText(plaintext);
      }
    } else if (algorithm === 'Caesar') {
      const decrypted = runCaesar(ciphertext, -caesarShift);
      setDecryptedText(decrypted);
    } else if (algorithm === 'SHA-256') {
      alert('⚠️ Cryptographic hashes are strictly ONE-WAY functions and cannot be decrypted.');
      setDecryptedText('[CANNOT DECRYPT: ONE-WAY HASH]');
    } else if (algorithm === 'RSA-2048') {
      setDecryptedText(plaintext);
    }
  };

  return (
    <div className="simulation-crypto-root">
      {algorithm === 'Caesar' && (
        <div className="crypto-warning-banner">
          ⚠️ <strong>EDUCATIONAL TOY CIPHER NOTICE:</strong> The Caesar substitution cipher is cryptographically
          insecure. Never use for real data protection!
        </div>
      )}

      <div className="crypto-grid-layout">
        <div className="crypto-card">
          <div className="sim-card-header">
            <span className="window-title">🔐 Cryptographic Engine Configuration</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label>Select Algorithm:</label>
              <div className="algo-selector-pills">
                <button
                  type="button"
                  className={`btn-algo-pill ${algorithm === 'AES-GCM' ? 'is-active' : ''}`}
                  onClick={() => setAlgorithm('AES-GCM')}
                >
                  AES-256-GCM (Symmetric AEAD)
                </button>
                <button
                  type="button"
                  className={`btn-algo-pill ${algorithm === 'SHA-256' ? 'is-active' : ''}`}
                  onClick={() => setAlgorithm('SHA-256')}
                >
                  SHA-256 (One-Way Hash)
                </button>
                <button
                  type="button"
                  className={`btn-algo-pill ${algorithm === 'RSA-2048' ? 'is-active' : ''}`}
                  onClick={() => setAlgorithm('RSA-2048')}
                >
                  RSA-2048 (Asymmetric Public Key)
                </button>
                <button
                  type="button"
                  className={`btn-algo-pill pill-toy ${algorithm === 'Caesar' ? 'is-active' : ''}`}
                  onClick={() => setAlgorithm('Caesar')}
                >
                  Caesar (Educational Toy Cipher)
                </button>
              </div>
            </div>

            <div className="sim-field-group">
              <label htmlFor="crypto-plain">Plaintext Message</label>
              <textarea
                id="crypto-plain"
                rows={3}
                className="sim-input font-mono"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter message to encrypt..."
              />
            </div>

            {algorithm === 'AES-GCM' && (
              <div className="sim-field-group">
                <label htmlFor="crypto-secret-key">Secret Key (Symmetric 256-bit)</label>
                <input
                  id="crypto-secret-key"
                  type="text"
                  className="sim-input font-mono"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            )}

            {algorithm === 'Caesar' && (
              <div className="sim-field-group">
                <label htmlFor="crypto-caesar-shift">Caesar Alphabet Shift (Key: 1-25)</label>
                <input
                  id="crypto-caesar-shift"
                  type="number"
                  min={1}
                  max={25}
                  className="sim-input font-mono"
                  value={caesarShift}
                  onChange={(e) => setCaesarShift(parseInt(e.target.value) || 3)}
                />
              </div>
            )}

            <button type="button" className="btn-sim-action" onClick={handleEncrypt}>
              🔒 Encrypt / Generate Digest
            </button>
          </div>
        </div>

        <div className="crypto-card">
          <div className="sim-card-header db-header">
            <span className="window-title">📦 Ciphertext & Authenticity Inspector</span>
          </div>

          <div className="sim-card-body">
            {ciphertext ? (
              <div className="crypto-results-pane">
                <div className="crypto-spec-row">
                  <span className="spec-label">Initialization Vector (Nonce / IV):</span>
                  <code className="font-mono text-cyan spec-code">{ivHex}</code>
                </div>

                <div className="crypto-spec-row">
                  <span className="spec-label">Ciphertext (Hex Payload):</span>
                  <div className="ciphertext-box font-mono">{ciphertext}</div>
                </div>

                <div className="crypto-spec-row">
                  <span className="spec-label">Authentication Tag (MAC):</span>
                  <code className="font-mono text-green spec-code">{authTagHex}</code>
                </div>

                {tamperedNotice && <div className="tamper-alert font-mono">{tamperedNotice}</div>}

                <div className="crypto-tamper-actions">
                  {algorithm === 'AES-GCM' && (
                    <button
                      type="button"
                      className="btn-tamper-payload"
                      onClick={handleTamperCiphertext}
                    >
                      ✏️ Tamper 1 Bit of Ciphertext
                    </button>
                  )}
                  <button type="button" className="btn-sim-action" onClick={handleDecrypt}>
                    🔓 Decrypt Payload
                  </button>
                </div>

                {decryptedText && (
                  <div className="decrypted-result-box">
                    <span className="decrypted-label">Decrypted Plaintext Output:</span>
                    <div className="decrypted-text font-mono">{decryptedText}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="crypto-empty-state">
                <p>No ciphertext generated yet.</p>
                <span>Click "Encrypt / Generate Digest" on the left to inspect raw cryptographic tokens.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

