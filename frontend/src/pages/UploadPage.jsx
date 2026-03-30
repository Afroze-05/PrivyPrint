import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Inline styles injected once at module level
   (Google Fonts + keyframes + custom utilities)
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .upload-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080C18;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  /* Ambient blobs */
  .upload-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    top: -100px; left: -150px;
    pointer-events: none;
  }
  .upload-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
    bottom: -80px; right: -120px;
    pointer-events: none;
  }

  /* Grain overlay */
  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    opacity: 0.5;
  }

  /* Card */
  .glass-card {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 32px 80px rgba(0,0,0,0.55),
      0 8px 24px rgba(0,0,0,0.3);
    padding: 2.5rem;
    width: 100%;
    max-width: 480px;
  }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
    70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(59,130,246,0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(59,130,246,0.5); }
    50%       { border-color: rgba(99,102,241,0.8); }
  }
  @keyframes tickBounce {
    0%   { transform: scale(0); opacity: 0; }
    60%  { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes dotFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  .animate-fade-up  { animation: fadeUp  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-scale-in { animation: scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .delay-100 { animation-delay: 0.10s; }
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }
  .delay-400 { animation-delay: 0.40s; }

  /* Typography */
  .heading {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: #F1F5FF;
    margin: 0;
  }
  .sub {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.01em;
    margin-top: 0.35rem;
    font-weight: 300;
  }

  /* Logo chip */
  .logo-chip {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(59,130,246,0.12);
    border: 1px solid rgba(59,130,246,0.25);
    border-radius: 100px;
    padding: 0.3rem 0.85rem 0.3rem 0.45rem;
    font-size: 0.72rem;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #93C5FD;
    margin-bottom: 1.25rem;
  }
  .logo-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3B82F6;
    animation: pulse-ring 2s ease-out infinite;
  }

  /* Drop zone */
  .dropzone {
    border-radius: 16px;
    border: 1.5px dashed rgba(255,255,255,0.12);
    padding: 2.25rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    background: rgba(255,255,255,0.02);
    position: relative;
    overflow: hidden;
  }
  .dropzone:hover,
  .dropzone.drag-over {
    border-color: rgba(59,130,246,0.55);
    background: rgba(59,130,246,0.06);
    animation: borderGlow 2s ease-in-out infinite;
  }
  .dropzone.has-file {
    border-style: solid;
    border-color: rgba(52,211,153,0.5);
    background: rgba(52,211,153,0.05);
    animation: none;
  }
  .dropzone-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
    transition: transform 0.3s ease;
  }
  .dropzone:hover .dropzone-icon { transform: translateY(-3px) scale(1.05); }
  .dropzone.drag-over .dropzone-icon { transform: translateY(-6px) scale(1.1); }
  .dropzone-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #E2E8F0;
    margin-bottom: 0.3rem;
  }
  .dropzone-hint {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.04em;
    font-weight: 300;
  }

  /* File pill */
  .file-pill {
    display: flex; align-items: center; gap: 0.65rem;
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: 12px;
    padding: 0.65rem 0.9rem;
    margin-top: 0.5rem;
    width: 100%;
  }
  .file-pill-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(52,211,153,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; flex-shrink: 0;
  }
  .file-pill-name {
    font-size: 0.8rem; font-weight: 500; color: #6EE7B7;
    flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .file-pill-tick {
    font-size: 1rem;
    animation: tickBounce 0.4s ease both;
  }

  /* Section label */
  .field-label {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.75rem;
    display: block;
  }

  /* Mode cards */
  .mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .mode-card {
    border-radius: 14px;
    border: 1.5px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    padding: 1rem 0.75rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.22s ease;
    display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  }
  .mode-card:hover {
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.06);
    transform: translateY(-2px);
  }
  .mode-card.active {
    border-color: #3B82F6;
    background: rgba(59,130,246,0.12);
    box-shadow: 0 0 0 1px rgba(59,130,246,0.3) inset, 0 8px 20px rgba(59,130,246,0.2);
    transform: translateY(-2px);
  }
  .mode-card-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    background: rgba(255,255,255,0.06);
    transition: background 0.22s;
  }
  .mode-card.active .mode-card-icon {
    background: rgba(59,130,246,0.25);
  }
  .mode-card-label {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 0.78rem;
    color: rgba(255,255,255,0.55);
    transition: color 0.22s;
  }
  .mode-card.active .mode-card-label { color: #93C5FD; }
  .mode-card-desc {
    font-size: 0.68rem; color: rgba(255,255,255,0.25);
    font-weight: 300;
    transition: color 0.22s;
  }
  .mode-card.active .mode-card-desc { color: rgba(147,197,253,0.6); }

  /* Copies stepper */
  .stepper {
    display: flex; align-items: center; gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    height: 48px;
  }
  .stepper-btn {
    width: 48px; height: 48px;
    background: none; border: none; cursor: pointer;
    font-size: 1.25rem; font-weight: 300;
    color: rgba(255,255,255,0.5);
    transition: all 0.18s ease;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .stepper-btn:hover {
    background: rgba(59,130,246,0.15);
    color: #93C5FD;
  }
  .stepper-btn:active { transform: scale(0.9); }
  .stepper-val {
    flex: 1; text-align: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 1.1rem;
    color: #F1F5FF;
    border: none; background: none; outline: none;
  }
  .stepper-divider {
    width: 1px; height: 28px;
    background: rgba(255,255,255,0.08);
    flex-shrink: 0;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
    margin: 0.25rem 0;
  }

  /* Trust badges */
  .trust-row {
    display: flex; gap: 0.5rem; justify-content: center;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .trust-badge {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.68rem; font-weight: 400; letter-spacing: 0.02em;
    color: rgba(255,255,255,0.25);
    padding: 0.3rem 0.6rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 100px;
  }
  .trust-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(52,211,153,0.7);
  }

  /* Submit button */
  .submit-btn {
    width: 100%; padding: 0.9rem 1.5rem;
    border-radius: 14px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 0.92rem;
    letter-spacing: 0.04em;
    color: #fff;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%);
    box-shadow: 0 4px 20px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.12) inset;
    transition: all 0.22s ease;
    display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  }
  .submit-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(37,99,235,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
  }
  .submit-btn:hover::before {
    opacity: 1;
    animation: shimmer 1.5s linear infinite;
  }
  .submit-btn:active { transform: translateY(0); }

  .submit-btn .lock-icon {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem;
  }

  /* Section spacing */
  .form-section { display: flex; flex-direction: column; gap: 1.5rem; }
`;

function injectStyles() {
  if (document.getElementById('upload-page-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'upload-page-styles';
  tag.textContent = GLOBAL_CSS;
  document.head.appendChild(tag);
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [printType, setPrintType] = useState('B/W');
  const [copies, setCopies] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  // Inject styles once
  React.useLayoutEffect(() => { injectStyles(); }, []);

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

  const getFileIcon = (f) => {
    if (!f) return '📁';
    const ext = f.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📕';
    if (['docx', 'doc'].includes(ext)) return '📘';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return '🖼️';
    return '📄';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="upload-root">
      <div className="grain" />

      <div className="animate-fade-up" style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="animate-scale-in" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="logo-chip">
              <span className="logo-dot" />
              SecurePrint
            </div>
          </div>
          <h1 className="heading animate-fade-up delay-100">Upload Your Document</h1>
          <p className="sub animate-fade-up delay-200">
            End-to-end encrypted &nbsp;·&nbsp; Auto-deleted after printing
          </p>
        </div>

        {/* Card */}
        <div className="glass-card animate-fade-up delay-200">
          <form onSubmit={handleUpload} className="form-section">

            {/* ── Drop zone ── */}
            <div>
              <span className="field-label">Document</span>
              <div
                className={`dropzone${dragOver ? ' drag-over' : ''}${file ? ' has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <span className="dropzone-icon">{file ? '✅' : dragOver ? '📂' : '📁'}</span>
                  {!file ? (
                    <>
                      <p className="dropzone-title">
                        {dragOver ? 'Release to upload' : 'Drop file here or click to browse'}
                      </p>
                      <p className="dropzone-hint">PDF · DOCX · PNG &nbsp;—&nbsp; Max 10 MB</p>
                    </>
                  ) : (
                    <div className="file-pill" onClick={(e) => e.preventDefault()}>
                      <div className="file-pill-icon">{getFileIcon(file)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="file-pill-name">{file.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(110,231,183,0.55)', fontWeight: 300 }}>
                          {formatSize(file.size)}
                        </div>
                      </div>
                      <span className="file-pill-tick">✓</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="divider" />

            {/* ── Print Mode ── */}
            <div>
              <span className="field-label">Print Mode</span>
              <div className="mode-grid">
                {[
                  { type: 'B/W',   icon: '◐', label: 'Black & White', desc: 'Economical' },
                  { type: 'Color', icon: '🎨', label: 'Full Color',    desc: 'Vibrant' },
                ].map(({ type, icon, label, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPrintType(type)}
                    className={`mode-card${printType === type ? ' active' : ''}`}
                  >
                    <div className="mode-card-icon">{icon}</div>
                    <span className="mode-card-label">{label}</span>
                    <span className="mode-card-desc">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="divider" />

            {/* ── Copies ── */}
            <div>
              <span className="field-label">Number of Copies</span>
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setCopies(c => Math.max(1, c - 1))}
                >
                  −
                </button>
                <div className="stepper-divider" />
                <input
                  className="stepper-val"
                  type="number"
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <div className="stepper-divider" />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setCopies(c => c + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" className="submit-btn">
              <span className="lock-icon">🔒</span>
              Generate Secure Token
            </button>
          </form>
        </div>

        {/* Trust badges */}
        <div className="trust-row animate-fade-up delay-400">
          {['256-bit AES', 'Zero Logs', 'GDPR Ready'].map((t) => (
            <div key={t} className="trust-badge">
              <span className="trust-badge-dot" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}