import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";

/* ─────────────────────────────────────────────
   Styles — same design language as UploadPage
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .signup-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080C18;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow-x: hidden;
overflow-y: auto;
  }

  /* Ambient blobs */
  .signup-root::before {
    content: '';
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
    top: -120px; left: -180px;
    pointer-events: none;
  }
  .signup-root::after {
    content: '';
    position: fixed;
    width: 520px; height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
    bottom: -100px; right: -140px;
    pointer-events: none;
  }

  /* Grain */
  .signup-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    opacity: 0.5;
  }

  /* Card */
  .signup-glass-card {
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
    max-width: 460px;
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
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes inputFocus {
    from { box-shadow: 0 0 0 0px rgba(59,130,246,0); }
    to   { box-shadow: 0 0 0 3px rgba(59,130,246,0.22); }
  }
  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .su-fade-up   { animation: fadeUp  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .su-scale-in  { animation: scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .su-delay-100 { animation-delay: 0.10s; }
  .su-delay-200 { animation-delay: 0.20s; }
  .su-delay-300 { animation-delay: 0.30s; }
  .su-delay-400 { animation-delay: 0.40s; }
  .su-delay-500 { animation-delay: 0.50s; }

  /* Logo chip */
  .su-logo-chip {
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
  .su-logo-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3B82F6;
    animation: pulse-ring 2s ease-out infinite;
  }

  /* Typography */
  .su-heading {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -0.03em;
    line-height: 1.15;
    color: #F1F5FF;
    margin: 0;
  }
  .su-sub {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.01em;
    margin-top: 0.35rem;
    font-weight: 300;
  }

  /* Divider */
  .su-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  }

  /* Field label */
  .su-field-label {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.5rem;
    display: block;
  }

  /* Input wrapper */
  .su-input-wrap {
    position: relative;
    display: flex; align-items: center;
  }
  .su-input-icon {
    position: absolute; left: 14px;
    font-size: 0.95rem; pointer-events: none;
    opacity: 0.4; transition: opacity 0.2s;
  }
  .su-input-valid-icon {
    position: absolute; right: 14px;
    font-size: 0.85rem; pointer-events: none;
    animation: checkPop 0.35s ease both;
    color: #34D399;
  }
  .su-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.75rem;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #F1F5FF;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 400;
    outline: none;
    transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
    caret-color: #3B82F6;
  }
  .su-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 300; }
  .su-input:hover {
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
  }
  .su-input:focus {
    border-color: rgba(59,130,246,0.65);
    background: rgba(59,130,246,0.06);
    animation: inputFocus 0.25s ease forwards;
  }
  .su-input:focus + .su-input-icon,
  .su-input-wrap:focus-within .su-input-icon {
    opacity: 0.7;
  }
  .su-input.valid {
    border-color: rgba(52,211,153,0.4);
    background: rgba(52,211,153,0.04);
  }

  /* Password strength */
  .su-strength-bar {
    display: flex; gap: 4px; margin-top: 0.45rem;
  }
  .su-strength-seg {
    flex: 1; height: 3px; border-radius: 99px;
    background: rgba(255,255,255,0.07);
    transition: background 0.3s ease;
  }
  .su-strength-seg.lit-weak   { background: #EF4444; }
  .su-strength-seg.lit-fair   { background: #F59E0B; }
  .su-strength-seg.lit-good   { background: #3B82F6; }
  .su-strength-seg.lit-strong { background: #34D399; }
  .su-strength-label {
    font-size: 0.68rem; font-weight: 400;
    margin-top: 0.3rem; letter-spacing: 0.03em;
    color: rgba(255,255,255,0.3);
    transition: color 0.3s;
  }

  /* Error banner */
  .su-error {
    display: flex; align-items: center; gap: 0.6rem;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 12px;
    padding: 0.7rem 0.9rem;
    font-size: 0.8rem; font-weight: 500;
    color: #FCA5A5;
    animation: shake 0.4s ease;
  }
  .su-error-icon {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; flex-shrink: 0;
  }

  /* Submit */
  .su-submit {
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
  .su-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
    background-size: 200% auto;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .su-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(37,99,235,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
  }
  .su-submit:hover:not(:disabled)::before {
    opacity: 1;
    animation: shimmer 1.5s linear infinite;
  }
  .su-submit:active:not(:disabled) { transform: translateY(0); }
  .su-submit:disabled {
    opacity: 0.55; cursor: not-allowed;
    background: linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%);
  }
  .su-submit-icon {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem;
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .su-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* Sign-in link */
  .su-signin-row {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.28);
    margin-top: 1.25rem;
  }
  .su-signin-row a {
    color: #93C5FD;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.18s;
  }
  .su-signin-row a:hover { color: #BFDBFE; }

  /* Trust badges */
  .su-trust-row {
    display: flex; gap: 0.5rem; justify-content: center;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .su-trust-badge {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.68rem; font-weight: 400; letter-spacing: 0.02em;
    color: rgba(255,255,255,0.25);
    padding: 0.3rem 0.6rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 100px;
  }
  .su-trust-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(52,211,153,0.7);
  }

  /* Form spacing */
  .su-form { display: flex; flex-direction: column; gap: 1.25rem; }
  .su-field { display: flex; flex-direction: column; }
`;

function injectStyles() {
  if (document.getElementById('customer-signup-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'customer-signup-styles';
  tag.textContent = GLOBAL_CSS;
  document.head.appendChild(tag);
}

/* Password strength helper */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too short', color: '' },
    { label: 'Weak',      color: 'weak' },
    { label: 'Fair',      color: 'fair' },
    { label: 'Good',      color: 'good' },
    { label: 'Strong',    color: 'strong' },
  ];
  return { score, ...map[score] };
}

const STRENGTH_COLORS = {
  weak:   '#EF4444',
  fair:   '#F59E0B',
  good:   '#3B82F6',
  strong: '#34D399',
};

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Inject styles once
  import('react').then(({ useLayoutEffect }) => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  if (typeof window !== 'undefined') injectStyles();

  const strength = getStrength(password);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid  = name.trim().length >= 2;

  async function handleCreateAccount(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password, role: 'customer' });
      const loginRes = await api.post('/auth/login', { email, password });
      const { token, user } = loginRes.data;
      setAuth({ token, ...user });
      navigate('/home');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-root">
      <div className="signup-grain" />

      <div className="su-fade-up" style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="su-scale-in" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="su-logo-chip">
              <span className="su-logo-dot" />
              SecurePrint
            </div>
          </div>
          <h1 className="su-heading su-fade-up su-delay-100">Create Account</h1>
          <p className="su-sub su-fade-up su-delay-200">
            Join SecurePrint &nbsp;·&nbsp; Free to get started
          </p>
        </div>

        {/* Card */}
        <div className="signup-glass-card su-fade-up su-delay-200">
          <form onSubmit={handleCreateAccount} className="su-form">

            {/* Name */}
            <div className="su-field su-fade-up su-delay-200">
              <label className="su-field-label">Full Name</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">👤</span>
                <input
                  className={`su-input${isNameValid && name ? ' valid' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                />
                {isNameValid && name && (
                  <span className="su-input-valid-icon">✓</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="su-field su-fade-up su-delay-300">
              <label className="su-field-label">Email Address</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">✉️</span>
                <input
                  className={`su-input${isEmailValid && email ? ' valid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
                {isEmailValid && email && (
                  <span className="su-input-valid-icon">✓</span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="su-field su-fade-up su-delay-400">
              <label className="su-field-label">Password</label>
              <div className="su-input-wrap">
                <span className="su-input-icon">🔑</span>
                <input
                  className={`su-input${strength.score >= 3 ? ' valid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
                {strength.score >= 3 && (
                  <span className="su-input-valid-icon">✓</span>
                )}
              </div>
              {password && (
                <>
                  <div className="su-strength-bar">
                    {[1,2,3,4].map((seg) => {
                      const lit = strength.score >= seg;
                      return (
                        <div
                          key={seg}
                          className={`su-strength-seg${lit ? ` lit-${strength.color}` : ''}`}
                          style={lit ? { background: STRENGTH_COLORS[strength.color] } : {}}
                        />
                      );
                    })}
                  </div>
                  <div
                    className="su-strength-label"
                    style={strength.color ? { color: STRENGTH_COLORS[strength.color] } : {}}
                  >
                    {strength.label}
                  </div>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="su-divider" />

            {/* Error */}
            {error && (
              <div className="su-error">
                <div className="su-error-icon">⚠</div>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="su-submit su-fade-up su-delay-500"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="su-spinner" />
                  Creating your account…
                </>
              ) : (
                <>
                  <span className="su-submit-icon">🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <div className="su-signin-row">
            Already have an account?&nbsp;
            <a href="/login">Sign in</a>
          </div>
        </div>

        {/* Trust badges */}
        <div className="su-trust-row su-fade-up su-delay-500">
          {['256-bit AES', 'Zero Logs', 'GDPR Ready'].map((t) => (
            <div key={t} className="su-trust-badge">
              <span className="su-trust-dot" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}