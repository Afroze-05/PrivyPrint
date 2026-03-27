
import React from 'react';
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
    --green:      #3FB950;
    --green-glow: rgba(63,185,80,0.3);
    --green-dim:  rgba(63,185,80,0.1);
    --red:        #F85149;
    --red-dim:    rgba(248,81,73,0.08);
    --red-border: rgba(248,81,73,0.2);
    --text:       #CDD9E5;
    --text-dim:   #768390;
    --mono:       'Share Tech Mono', monospace;
    --display:    'Barlow Condensed', sans-serif;
    --body:       'Inter', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tk-page {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
    font-family: var(--body);
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .tk-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(56,139,253,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,139,253,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
    pointer-events: none;
  }

  .tk-blob1 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(63,185,80,0.06) 0%, transparent 65%);
    top: -120px; right: -100px;
    pointer-events: none;
  }
  .tk-blob2 {
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,139,253,0.07) 0%, transparent 65%);
    bottom: -150px; left: -120px;
    pointer-events: none;
  }

  .tk-wrap {
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .tk-icon {
    width: 68px; height: 68px;
    border-radius: 50%;
    margin: 0 auto 1.25rem;
    display: flex; align-items: center; justify-content: center;
    background: var(--green-dim);
    border: 1.5px solid rgba(63,185,80,0.35);
    font-size: 1.6rem;
    color: var(--green);
    box-shadow: 0 0 0 8px rgba(63,185,80,0.06), 0 0 30px var(--green-glow);
    animation: iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both 0.15s;
  }

  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  .tk-title {
    font-family: var(--display);
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 0.25rem;
  }

  .tk-title span { color: var(--green); }

  .tk-sub {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.75rem;
  }

  .tk-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }

  .tk-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--blue), var(--green));
  }

  .tk-card-body { padding: 1.75rem; }

  .tk-token-box {
    background: linear-gradient(145deg, #0A192F 0%, #0d2040 100%);
    border: 1px solid rgba(56,139,253,0.2);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .tk-token-box::after {
    content: '';
    position: absolute;
    bottom: -30px; left: 50%;
    transform: translateX(-50%);
    width: 180px; height: 60px;
    background: radial-gradient(ellipse, rgba(56,139,253,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .tk-token-label {
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--blue);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .tk-token-label::before,
  .tk-token-label::after {
    content: '';
    flex: 1;
    max-width: 40px;
    height: 1px;
    background: rgba(56,139,253,0.3);
  }

  .tk-token-value {
    font-family: var(--mono);
    font-size: 2.8rem;
    color: #fff;
    letter-spacing: 0.15em;
    text-shadow: 0 0 24px rgba(56,139,253,0.5), 0 0 60px rgba(56,139,253,0.2);
    margin-bottom: 1rem;
    line-height: 1;
  }

  .tk-badges {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tk-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border-radius: 99px;
    font-family: var(--mono);
    font-size: 0.62rem;
    color: var(--text-dim);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tk-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 5px var(--green-glow);
    animation: blink 1.5s ease-in-out infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  }

  .tk-divider {
    height: 1px;
    background: var(--border);
    margin: 1.25rem 0;
  }

  .tk-qr-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    opacity: 0.55;
  }

  .tk-qr {
    width: 96px; height: 96px;
    border: 1.5px solid rgba(56,139,253,0.25);
    border-radius: 12px;
    padding: 8px;
    background: rgba(56,139,253,0.04);
  }

  .tk-qr-grid {
    width: 100%; height: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2px;
  }

  .tk-qr-cell { border-radius: 2px; }

  .tk-qr-label {
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .tk-btn-group { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem; }

  .tk-btn-primary {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid var(--border-hi);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(56,139,253,0.2) 0%, rgba(56,139,253,0.08) 100%);
    color: var(--blue);
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .tk-btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(56,139,253,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.55s;
  }

  .tk-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 20px rgba(56,139,253,0.2); }
  .tk-btn-primary:hover::before { transform: translateX(100%); }

  .tk-btn-secondary {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text-dim);
    font-family: var(--display);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tk-btn-secondary:hover {
    border-color: rgba(255,255,255,0.15);
    background: var(--surface2);
    color: var(--text);
    transform: translateY(-1px);
  }

  .tk-warning {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    background: var(--red-dim);
    border: 1px solid var(--red-border);
    font-family: var(--mono);
    font-size: 0.63rem;
    color: var(--red);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

const QR_PATTERN = [1,0,1,1,0, 0,1,0,1,1, 1,1,1,0,0, 0,0,1,1,0, 1,0,0,1,1];

export default function TokenPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('activeToken') || 'SPX-0000';
  const type  = localStorage.getItem('printType')  || 'B/W';

  return (
    <>
      <style>{styles}</style>
      <div className="tk-page">
        <div className="tk-blob1" />
        <div className="tk-blob2" />

        <div className="tk-wrap">
          <div className="tk-icon">✓</div>
          <h1 className="tk-title">Document <span>Uploaded!</span></h1>
          <p className="tk-sub">Your secure printing session is ready</p>

          <div className="tk-card">
            <div className="tk-card-body">

              <div className="tk-token-box">
                <div className="tk-token-label">🔑 Secure Access Token</div>
                <div className="tk-token-value">{token}</div>
                <div className="tk-badges">
                  <span className="tk-badge">Mode: {type}</span>
                  <span className="tk-badge">
                    <span className="tk-badge-dot" />
                    Waiting
                  </span>
                </div>
              </div>

              <div className="tk-qr-wrap">
                <div className="tk-qr">
                  <div className="tk-qr-grid">
                    {QR_PATTERN.map((on, i) => (
                      <div
                        key={i}
                        className="tk-qr-cell"
                        style={{ background: on ? 'rgba(56,139,253,0.7)' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
                <span className="tk-qr-label">Scan at Kiosk</span>
              </div>

              <div className="tk-divider" />

              <div className="tk-btn-group">
                <button className="tk-btn-primary" onClick={() => window.print()}>
                  📥 &nbsp; Download Slip
                </button>
                <button className="tk-btn-secondary" onClick={() => navigate('/')}>
                  ✅ &nbsp; Done
                </button>
              </div>

              <div className="tk-warning">
                ⚠️ &nbsp; Token expires in <strong>&nbsp;10 min&nbsp;</strong> · Do not share this code
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}