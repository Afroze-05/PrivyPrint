

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Share+Tech+Mono&family=Inter:wght@300;400;500;600&display=swap');

  :root {
    --bg:         #070D1A;
    --bg2:        #0B1221;
    --surface:    rgba(255,255,255,0.03);
    --surface2:   rgba(255,255,255,0.06);
    --border:     rgba(255,255,255,0.08);
    --border-hi:  rgba(56,139,253,0.5);
    --blue:       #388BFD;
    --blue-glow:  rgba(56,139,253,0.3);
    --blue-dim:   rgba(56,139,253,0.12);
    --cyan:       #58D8FF;
    --green:      #3FB950;
    --green-glow: rgba(63,185,80,0.25);
    --muted:      #4A5568;
    --text:       #CDD9E5;
    --text-dim:   #768390;
    --mono:       'Share Tech Mono', monospace;
    --display:    'Barlow Condensed', sans-serif;
    --body:       'Inter', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .up-page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    font-family: var(--body);
    position: relative;
    overflow: hidden;
  }

  .up-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(56,139,253,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,139,253,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
    pointer-events: none;
  }

  .up-page::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,139,253,0.07) 0%, transparent 65%);
    top: -100px; left: -150px;
    pointer-events: none;
  }

  .up-blob {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(88,216,255,0.05) 0%, transparent 65%);
    bottom: -150px; right: -100px;
    pointer-events: none;
  }

  .up-wrap {
    width: 100%;
    max-width: 460px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .up-header { text-align: center; margin-bottom: 1.75rem; }

  .up-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 99px;
    padding: 0.35rem 1rem 0.35rem 0.55rem;
    margin-bottom: 1.5rem;
  }

  .up-logo-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--blue);
    box-shadow: 0 0 8px var(--blue-glow);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }

  .up-logo-text {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 0.12em;
  }

  .up-title {
    font-family: var(--display);
    font-size: 2.6rem;
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
    letter-spacing: -0.01em;
    text-transform: uppercase;
  }

  .up-title span { color: var(--blue); }

  .up-sub {
    margin-top: 0.5rem;
    font-size: 0.72rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-family: var(--mono);
  }

  .up-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.75rem;
    position: relative;
    overflow: hidden;
  }

  .up-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--blue), transparent);
  }

  .up-drop {
    border: 1.5px dashed var(--border);
    border-radius: 14px;
    padding: 2.25rem 1.5rem;
    text-align: center;
    cursor: pointer;
    background: var(--surface);
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    margin-bottom: 1.5rem;
  }

  .up-drop:hover,
  .up-drop.drag-over {
    border-color: var(--blue);
    background: var(--blue-dim);
    transform: translateY(-2px);
  }

  .up-drop.has-file {
    border-color: var(--green);
    background: rgba(63,185,80,0.06);
  }

  .up-drop input { display: none; }
  .up-drop label { display: block; cursor: pointer; }

  .up-drop-icon {
    font-size: 2.4rem;
    display: block;
    margin-bottom: 0.6rem;
    line-height: 1;
    filter: drop-shadow(0 0 8px var(--blue-glow));
  }

  .up-drop-title {
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .up-drop-hint {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    margin-top: 0.4rem;
    letter-spacing: 0.1em;
  }

  .up-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 0.65rem;
  }

  .up-label::before {
    content: '';
    display: inline-block;
    width: 12px; height: 1px;
    background: var(--blue);
  }

  .up-modes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    margin-bottom: 1.4rem;
  }

  .up-mode-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-dim);
    font-family: var(--body);
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .up-mode-btn:hover:not(.active) {
    border-color: rgba(56,139,253,0.25);
    background: var(--surface2);
    color: var(--text);
  }

  .up-mode-btn.active {
    border-color: var(--blue);
    background: var(--blue-dim);
    color: var(--blue);
    box-shadow: 0 0 16px rgba(56,139,253,0.15), inset 0 0 12px rgba(56,139,253,0.06);
  }

  .up-mode-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    background: var(--surface2);
    flex-shrink: 0;
  }

  .up-mode-btn.active .up-mode-icon {
    background: rgba(56,139,253,0.15);
  }

  .up-mode-info { display: flex; flex-direction: column; gap: 1px; }
  .up-mode-name { font-weight: 600; font-size: 0.82rem; }
  .up-mode-desc { font-size: 0.68rem; opacity: 0.6; }

  .up-input-group { margin-bottom: 1.5rem; }

  .up-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-family: var(--mono);
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
  }

  .up-input::-webkit-inner-spin-button,
  .up-input::-webkit-outer-spin-button { opacity: 0; }

  .up-input:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(56,139,253,0.12);
    background: rgba(56,139,253,0.04);
  }

  .up-divider {
    height: 1px;
    background: var(--border);
    margin: 1.25rem 0;
  }

  .up-btn {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 1px solid var(--border-hi);
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(56,139,253,0.2) 0%, rgba(56,139,253,0.08) 100%);
    color: var(--blue);
    font-family: var(--display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
  }

  .up-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(56,139,253,0.1) 50%, transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  .up-btn:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, rgba(56,139,253,0.3) 0%, rgba(56,139,253,0.15) 100%);
    box-shadow: 0 0 24px rgba(56,139,253,0.25), 0 4px 16px rgba(0,0,0,0.3);
  }

  .up-btn:hover::before { transform: translateX(100%); }
  .up-btn:active { transform: translateY(0); }

  .up-footer {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  .up-footer-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green-glow);
  }
`;

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [printType, setPrintType] = useState('B/W');
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    const randomToken = `SPX-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('activeToken', randomToken);
    localStorage.setItem('printType', printType);
    navigate('/token');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="up-page">
        <div className="up-blob" />

        <div className="up-wrap">
          {/* Header */}
          <div className="up-header">
            <div className="up-logo">
              <div className="up-logo-dot" />
              <span className="up-logo-text">SECUREPRINT · UPLOAD</span>
            </div>
            <h1 className="up-title">
              Upload<br /><span>Document</span>
            </h1>
            <p className="up-sub">Encrypted · Auto-deleted after print</p>
          </div>

          {/* Card */}
          <div className="up-card">
            <form onSubmit={handleUpload}>

              {/* Drop zone */}
              <div
                className={`up-drop${dragOver ? ' drag-over' : ''}${file ? ' has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload">
                  <span className="up-drop-icon">
                    {file ? '✅' : dragOver ? '📂' : '📁'}
                  </span>
                  <p className="up-drop-title">
                    {file ? file.name : 'Drag & drop or click to browse'}
                  </p>
                  <p className="up-drop-hint">PDF · DOCX · PNG — MAX 10 MB</p>
                </label>
              </div>

              {/* Print mode */}
              <div>
                <div className="up-label">Print Mode</div>
                <div className="up-modes">
                  {[
                    { type: 'B/W', icon: '◼', name: 'Black & White', desc: 'Standard · Faster' },
                    { type: 'Color', icon: '🎨', name: 'Full Color', desc: 'Vibrant · Premium' },
                  ].map(({ type, icon, name, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPrintType(type)}
                      className={`up-mode-btn${printType === type ? ' active' : ''}`}
                    >
                      <div className="up-mode-icon">{icon}</div>
                      <div className="up-mode-info">
                        <span className="up-mode-name">{name}</span>
                        <span className="up-mode-desc">{desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copies */}
              <div className="up-input-group">
                <div className="up-label">Number of Copies</div>
                <input
                  className="up-input"
                  type="number"
                  defaultValue="1"
                  min="1"
                />
              </div>

              <div className="up-divider" />

              {/* Submit */}
              <button type="submit" className="up-btn">
                🔒 &nbsp; Generate Secure Token
              </button>
            </form>

            {/* Footer note */}
            <div className="up-footer">
              <div className="up-footer-dot" />
              END-TO-END ENCRYPTED · ZERO RETENTION POLICY
            </div>
          </div>
        </div>
      </div>
    </>
  );
}