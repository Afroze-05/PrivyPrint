import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { setAuth } from "../../services/authStorage";

/* ─────────────────────────────────────────────
   Styles — Admin variant of the shared design system
   Darker, more authoritative than CustomerSignup.
   Borrows the mono terminal aesthetic from Landing.
───────────────────────────────────────────── */
const ADMIN_LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .al-root {
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

  /* Ambient red/dark blobs — admin feels more dangerous than blue */
  .al-root::before {
    content: '';
    position: fixed;
    width: 650px; height: 650px; border-radius: 50%;
    background: radial-gradient(circle, rgba(217,24,40,0.08) 0%, transparent 68%);
    top: -160px; left: -200px;
    pointer-events: none;
  }
  .al-root::after {
    content: '';
    position: fixed;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,188,217,0.06) 0%, transparent 70%);
    bottom: -100px; right: -130px;
    pointer-events: none;
  }

  /* Grain */
  .al-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    opacity: 0.5;
  }

  /* Perspective grid */
  .al-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(217,24,40,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(217,24,40,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: radial-gradient(ellipse 55% 55% at 50% 50%, black 0%, transparent 100%);
  }

  /* Animations */
  @keyframes al-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes al-scale-in {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes al-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes al-pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(217,24,40,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(217,24,40,0); }
    100% { box-shadow: 0 0 0 0 rgba(217,24,40,0); }
  }
  @keyframes al-shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-3px); }
    80%       { transform: translateX(3px); }
  }
  @keyframes al-scan {
    from { top: -100%; }
    to   { top: 200%; }
  }
  @keyframes al-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes al-spin { to { transform: rotate(360deg); } }
  @keyframes al-check-pop {
    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.25) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .al-anim-up    { animation: al-fade-up  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .al-anim-scale { animation: al-scale-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .al-d1 { animation-delay: 0.08s; }
  .al-d2 { animation-delay: 0.16s; }
  .al-d3 { animation-delay: 0.24s; }
  .al-d4 { animation-delay: 0.32s; }
  .al-d5 { animation-delay: 0.40s; }

  /* Card */
  .al-card {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.07);
    border-top: 1px solid rgba(217,24,40,0.35);
    border-radius: 4px;
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03) inset,
      0 32px 80px rgba(0,0,0,0.6),
      0 0 60px rgba(217,24,40,0.05);
    padding: 2.75rem 2.5rem;
    width: 100%;
    max-width: 440px;
  }

  /* Top red accent bar */
  .al-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #D91828, rgba(59,188,217,0.7), #D91828, transparent);
    border-radius: 4px 4px 0 0;
  }

  /* Admin badge */
  .al-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(217,24,40,0.1);
    border: 1px solid rgba(217,24,40,0.22);
    padding: 0.28rem 0.8rem 0.28rem 0.42rem;
    border-radius: 3px;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: #F87171;
    margin-bottom: 1.25rem;
  }
  .al-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #D91828;
    animation: al-pulse-ring 2.2s ease-out infinite;
    box-shadow: 0 0 6px rgba(217,24,40,0.8);
  }

  /* Heading */
  .al-heading {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 2.6rem;
    letter-spacing: -0.01em; text-transform: uppercase; line-height: 0.95;
    color: #F1F5FF; margin: 0;
  }
  .al-heading span { color: #D91828; }
  .al-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; font-weight: 300;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    margin-top: 0.5rem;
  }

  /* Divider */
  .al-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(217,24,40,0.2), rgba(255,255,255,0.06), transparent);
  }

  /* Field label */
  .al-label {
    font-family: 'DM Mono', monospace;
    font-weight: 500; font-size: 0.62rem;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 0.5rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .al-label-tag {
    font-size: 0.55rem; padding: 0.12rem 0.4rem;
    background: rgba(217,24,40,0.1);
    border: 1px solid rgba(217,24,40,0.18);
    color: rgba(248,113,113,0.7);
    border-radius: 2px; letter-spacing: 0.1em;
  }

  /* Input wrapper */
  .al-input-wrap { position: relative; display: flex; align-items: center; }
  .al-input-icon {
    position: absolute; left: 13px;
    font-size: 0.85rem; pointer-events: none;
    opacity: 0.3; transition: opacity 0.2s;
    font-family: 'DM Mono', monospace;
  }
  .al-input-valid {
    position: absolute; right: 13px;
    font-size: 0.8rem; color: #34D399; pointer-events: none;
    animation: al-check-pop 0.35s ease both;
  }
  .al-input {
    width: 100%;
    padding: 0.72rem 2.25rem 0.72rem 2.6rem;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 3px;
    color: #F1F5FF;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem; font-weight: 300;
    outline: none; caret-color: #D91828;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .al-input::placeholder {
    color: rgba(255,255,255,0.15);
    font-style: italic;
  }
  .al-input:hover {
    border-color: rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
  }
  .al-input:focus {
    border-color: rgba(217,24,40,0.5);
    background: rgba(217,24,40,0.05);
    box-shadow: 0 0 0 3px rgba(217,24,40,0.12);
  }
  .al-input.valid {
    border-color: rgba(52,211,153,0.3);
    background: rgba(52,211,153,0.04);
  }
  .al-input-wrap:focus-within .al-input-icon { opacity: 0.6; }

  /* Cursor blink for mono inputs */
  .al-input:focus { caret-color: #D91828; }

  /* Error */
  .al-error {
    display: flex; align-items: flex-start; gap: 0.6rem;
    background: rgba(217,24,40,0.08);
    border: 1px solid rgba(217,24,40,0.22);
    border-left: 3px solid #D91828;
    border-radius: 3px;
    padding: 0.7rem 0.85rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; font-weight: 400;
    color: #FCA5A5; line-height: 1.5;
    animation: al-shake 0.4s ease;
  }
  .al-error-pre {
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #F87171; white-space: nowrap; padding-top: 0.15rem;
  }

  /* Submit */
  .al-submit {
    width: 100%;
    padding: 0.9rem 1.5rem;
    border: none; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 1rem;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #B91C1C 0%, #D91828 50%, #B91C1C 100%);
    background-size: 200% auto;
    border-radius: 3px;
    box-shadow: 0 4px 20px rgba(217,24,40,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
    position: relative; overflow: hidden;
    transition: all 0.22s ease;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }
  .al-submit:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(217,24,40,0.5), 0 1px 0 rgba(255,255,255,0.12) inset;
  }
  .al-submit:hover:not(:disabled)::after {
    content: '';
    position: absolute; width: 30px; height: 200%;
    background: rgba(255,255,255,0.12);
    transform: skewX(-20deg);
    animation: al-shimmer 0.6s ease;
  }
  .al-submit:active:not(:disabled) { transform: translateY(0); }
  .al-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .al-submit-icon {
    width: 20px; height: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem;
  }
  .al-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: al-spin 0.65s linear infinite;
  }

  /* Footer nav */
  .al-footer {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    padding-top: 0.25rem;
  }
  .al-footer-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; color: rgba(255,255,255,0.2);
    letter-spacing: 0.05em;
  }
  .al-create-btn {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #3BBCD9;
    background: rgba(59,188,217,0.07);
    border: 1px solid rgba(59,188,217,0.18);
    border-radius: 3px;
    padding: 0.4rem 0.85rem;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .al-create-btn:hover {
    background: rgba(59,188,217,0.14);
    border-color: rgba(59,188,217,0.35);
    color: #7DD3FC;
    transform: translateY(-1px);
  }

  /* Access level indicator */
  .al-access-row {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 0.85rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 3px;
  }
  .al-access-icon {
    font-size: 0.75rem; opacity: 0.5;
  }
  .al-access-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); flex: 1;
  }
  .al-access-level {
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.18rem 0.5rem;
    background: rgba(217,24,40,0.12);
    border: 1px solid rgba(217,24,40,0.2);
    color: #F87171; border-radius: 2px;
  }

  /* Trust row */
  .al-trust-row {
    display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .al-trust-badge {
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.2);
    padding: 0.28rem 0.6rem;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 3px;
  }
  .al-trust-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(217,24,40,0.6);
  }

  /* Form stack */
  .al-form { display: flex; flex-direction: column; gap: 1.2rem; }
  .al-field { display: flex; flex-direction: column; }
`;

function injectStyles() {
  if (document.getElementById('admin-login-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'admin-login-styles';
  tag.textContent = ADMIN_LOGIN_CSS;
  document.head.appendChild(tag);
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  if (typeof window !== 'undefined') injectStyles();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      if (user.role !== "admin") {
        setError("Access denied. Admin account required.");
        return;
      }

      setAuth({ token, ...user });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="al-root">
      <div className="al-grain" />
      <div className="al-grid" />

      <div className="al-anim-up" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="al-anim-scale" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="al-badge">
              <span className="al-badge-dot" />
              Admin Access
            </div>
          </div>
          <h1 className="al-heading al-anim-up al-d1">
            Secure<br /><span>Command</span> Panel
          </h1>
          <p className="al-sub al-anim-up al-d2">
            Restricted · Authorised Personnel Only
          </p>
        </div>

        {/* Card */}
        <div className="al-card al-anim-up al-d2">
          <form onSubmit={handleLogin} className="al-form">

            {/* Access level row */}
            <div className="al-access-row al-anim-up al-d2">
              <span className="al-access-icon">🛡</span>
              <span className="al-access-text">Clearance Required</span>
              <span className="al-access-level">Level · Admin</span>
            </div>

            <div className="al-divider" />

            {/* Email */}
            <div className="al-field al-anim-up al-d3">
              <label className="al-label">
                Email
                <span className="al-label-tag">Required</span>
              </label>
              <div className="al-input-wrap">
                <span className="al-input-icon">@</span>
                <input
                  className={`al-input${isEmailValid && email ? ' valid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                />
                {isEmailValid && email && <span className="al-input-valid">✓</span>}
              </div>
            </div>

            {/* Password */}
            <div className="al-field al-anim-up al-d4">
              <label className="al-label">
                Password
                <span className="al-label-tag">Required</span>
              </label>
              <div className="al-input-wrap">
                <span className="al-input-icon">▶</span>
                <input
                  className={`al-input${password.length >= 6 ? ' valid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter credentials"
                  required
                  autoComplete="current-password"
                />
                {password.length >= 6 && <span className="al-input-valid">✓</span>}
              </div>
            </div>

            <div className="al-divider" />

            {/* Error */}
            {error && (
              <div className="al-error">
                <span className="al-error-pre">ERR</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="al-submit al-anim-up al-d4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="al-spinner" />
                  Authenticating…
                </>
              ) : (
                <>
                  <span className="al-submit-icon">🔐</span>
                  Authenticate
                </>
              )}
            </button>

            {/* Footer nav */}
            <div className="al-footer al-anim-up al-d5">
              <span className="al-footer-text">No admin account?</span>
              <button
                type="button"
                className="al-create-btn"
                onClick={() => navigate('/admin/signup')}
              >
                Create Admin Account
              </button>
            </div>

          </form>
        </div>

        {/* Trust badges */}
        <div className="al-trust-row al-anim-up al-d5">
          {['Restricted Access', 'Audit Logged', 'Session Encrypted'].map((t) => (
            <div key={t} className="al-trust-badge">
              <span className="al-trust-dot" />
              {t}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> afroze
