// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { setAuth } from "../services/authStorage";

// /* ─────────────────────────────────────────────
//    Styles — same design language as UploadPage
// ───────────────────────────────────────────── */
// const GLOBAL_CSS = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

//   *, *::before, *::after { box-sizing: border-box; }

//   .signup-root {
//     font-family: 'DM Sans', sans-serif;
//     min-height: 100vh;
//     background: #080C18;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 2rem;
//     position: relative;
//     overflow-x: hidden;
// overflow-y: auto;
//   }

//   /* Ambient blobs */
//   .signup-root::before {
//     content: '';
//     position: fixed;
//     width: 600px; height: 600px;
//     border-radius: 50%;
//     background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
//     top: -120px; left: -180px;
//     pointer-events: none;
//   }
//   .signup-root::after {
//     content: '';
//     position: fixed;
//     width: 520px; height: 520px;
//     border-radius: 50%;
//     background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
//     bottom: -100px; right: -140px;
//     pointer-events: none;
//   }

//   /* Grain */
//   .signup-grain {
//     position: fixed; inset: 0; pointer-events: none; z-index: 0;
//     background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
//     background-size: 180px 180px;
//     opacity: 0.5;
//   }

//   /* Card */
//   .signup-glass-card {
//     position: relative; z-index: 1;
//     background: rgba(255,255,255,0.035);
//     border: 1px solid rgba(255,255,255,0.08);
//     border-radius: 24px;
//     backdrop-filter: blur(24px);
//     -webkit-backdrop-filter: blur(24px);
//     box-shadow:
//       0 0 0 1px rgba(255,255,255,0.04) inset,
//       0 32px 80px rgba(0,0,0,0.55),
//       0 8px 24px rgba(0,0,0,0.3);
//     padding: 2.5rem;
//     width: 100%;
//     max-width: 460px;
//   }

//   /* Animations */
//   @keyframes fadeUp {
//     from { opacity: 0; transform: translateY(28px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes scaleIn {
//     from { opacity: 0; transform: scale(0.96); }
//     to   { opacity: 1; transform: scale(1); }
//   }
//   @keyframes shimmer {
//     0%   { background-position: -200% center; }
//     100% { background-position: 200% center; }
//   }
//   @keyframes pulse-ring {
//     0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
//     70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(59,130,246,0); }
//     100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,130,246,0); }
//   }
//   @keyframes shake {
//     0%, 100% { transform: translateX(0); }
//     20%       { transform: translateX(-6px); }
//     40%       { transform: translateX(6px); }
//     60%       { transform: translateX(-4px); }
//     80%       { transform: translateX(4px); }
//   }
//   @keyframes inputFocus {
//     from { box-shadow: 0 0 0 0px rgba(59,130,246,0); }
//     to   { box-shadow: 0 0 0 3px rgba(59,130,246,0.22); }
//   }
//   @keyframes checkPop {
//     0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
//     60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
//     100% { transform: scale(1) rotate(0deg); opacity: 1; }
//   }

//   .su-fade-up   { animation: fadeUp  0.55s cubic-bezier(0.22,1,0.36,1) both; }
//   .su-scale-in  { animation: scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
//   .su-delay-100 { animation-delay: 0.10s; }
//   .su-delay-200 { animation-delay: 0.20s; }
//   .su-delay-300 { animation-delay: 0.30s; }
//   .su-delay-400 { animation-delay: 0.40s; }
//   .su-delay-500 { animation-delay: 0.50s; }

//   /* Logo chip */
//   .su-logo-chip {
//     display: inline-flex; align-items: center; gap: 0.5rem;
//     background: rgba(59,130,246,0.12);
//     border: 1px solid rgba(59,130,246,0.25);
//     border-radius: 100px;
//     padding: 0.3rem 0.85rem 0.3rem 0.45rem;
//     font-size: 0.72rem;
//     font-family: 'Syne', sans-serif;
//     font-weight: 600;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     color: #93C5FD;
//     margin-bottom: 1.25rem;
//   }
//   .su-logo-dot {
//     width: 7px; height: 7px; border-radius: 50%;
//     background: #3B82F6;
//     animation: pulse-ring 2s ease-out infinite;
//   }

//   /* Typography */
//   .su-heading {
//     font-family: 'Syne', sans-serif;
//     font-weight: 800;
//     font-size: 2rem;
//     letter-spacing: -0.03em;
//     line-height: 1.15;
//     color: #F1F5FF;
//     margin: 0;
//   }
//   .su-sub {
//     font-size: 0.8125rem;
//     color: rgba(255,255,255,0.38);
//     letter-spacing: 0.01em;
//     margin-top: 0.35rem;
//     font-weight: 300;
//   }

//   /* Divider */
//   .su-divider {
//     height: 1px;
//     background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
//   }

//   /* Field label */
//   .su-field-label {
//     font-family: 'Syne', sans-serif;
//     font-weight: 700;
//     font-size: 0.68rem;
//     letter-spacing: 0.14em;
//     text-transform: uppercase;
//     color: rgba(255,255,255,0.4);
//     margin-bottom: 0.5rem;
//     display: block;
//   }

//   /* Input wrapper */
//   .su-input-wrap {
//     position: relative;
//     display: flex; align-items: center;
//   }
//   .su-input-icon {
//     position: absolute; left: 14px;
//     font-size: 0.95rem; pointer-events: none;
//     opacity: 0.4; transition: opacity 0.2s;
//   }
//   .su-input-valid-icon {
//     position: absolute; right: 14px;
//     font-size: 0.85rem; pointer-events: none;
//     animation: checkPop 0.35s ease both;
//     color: #34D399;
//   }
//   .su-input {
//     width: 100%;
//     padding: 0.75rem 2.5rem 0.75rem 2.75rem;
//     background: rgba(255,255,255,0.04);
//     border: 1.5px solid rgba(255,255,255,0.08);
//     border-radius: 12px;
//     color: #F1F5FF;
//     font-family: 'DM Sans', sans-serif;
//     font-size: 0.88rem;
//     font-weight: 400;
//     outline: none;
//     transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
//     caret-color: #3B82F6;
//   }
//   .su-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 300; }
//   .su-input:hover {
//     border-color: rgba(255,255,255,0.15);
//     background: rgba(255,255,255,0.06);
//   }
//   .su-input:focus {
//     border-color: rgba(59,130,246,0.65);
//     background: rgba(59,130,246,0.06);
//     animation: inputFocus 0.25s ease forwards;
//   }
//   .su-input:focus + .su-input-icon,
//   .su-input-wrap:focus-within .su-input-icon {
//     opacity: 0.7;
//   }
//   .su-input.valid {
//     border-color: rgba(52,211,153,0.4);
//     background: rgba(52,211,153,0.04);
//   }

//   /* Password strength */
//   .su-strength-bar {
//     display: flex; gap: 4px; margin-top: 0.45rem;
//   }
//   .su-strength-seg {
//     flex: 1; height: 3px; border-radius: 99px;
//     background: rgba(255,255,255,0.07);
//     transition: background 0.3s ease;
//   }
//   .su-strength-seg.lit-weak   { background: #EF4444; }
//   .su-strength-seg.lit-fair   { background: #F59E0B; }
//   .su-strength-seg.lit-good   { background: #3B82F6; }
//   .su-strength-seg.lit-strong { background: #34D399; }
//   .su-strength-label {
//     font-size: 0.68rem; font-weight: 400;
//     margin-top: 0.3rem; letter-spacing: 0.03em;
//     color: rgba(255,255,255,0.3);
//     transition: color 0.3s;
//   }

//   /* Error banner */
//   .su-error {
//     display: flex; align-items: center; gap: 0.6rem;
//     background: rgba(239,68,68,0.1);
//     border: 1px solid rgba(239,68,68,0.25);
//     border-radius: 12px;
//     padding: 0.7rem 0.9rem;
//     font-size: 0.8rem; font-weight: 500;
//     color: #FCA5A5;
//     animation: shake 0.4s ease;
//   }
//   .su-error-icon {
//     width: 22px; height: 22px; border-radius: 6px;
//     background: rgba(239,68,68,0.2);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 0.7rem; flex-shrink: 0;
//   }

//   /* Submit */
//   .su-submit {
//     width: 100%; padding: 0.9rem 1.5rem;
//     border-radius: 14px; border: none; cursor: pointer;
//     font-family: 'Syne', sans-serif;
//     font-weight: 800; font-size: 0.92rem;
//     letter-spacing: 0.04em;
//     color: #fff;
//     position: relative; overflow: hidden;
//     background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%);
//     box-shadow: 0 4px 20px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.12) inset;
//     transition: all 0.22s ease;
//     display: flex; align-items: center; justify-content: center; gap: 0.65rem;
//   }
//   .su-submit::before {
//     content: '';
//     position: absolute; inset: 0;
//     background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
//     background-size: 200% auto;
//     opacity: 0;
//     transition: opacity 0.3s;
//   }
//   .su-submit:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 30px rgba(37,99,235,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
//   }
//   .su-submit:hover:not(:disabled)::before {
//     opacity: 1;
//     animation: shimmer 1.5s linear infinite;
//   }
//   .su-submit:active:not(:disabled) { transform: translateY(0); }
//   .su-submit:disabled {
//     opacity: 0.55; cursor: not-allowed;
//     background: linear-gradient(135deg, #1d4ed8 0%, #3730a3 100%);
//   }
//   .su-submit-icon {
//     width: 22px; height: 22px; border-radius: 6px;
//     background: rgba(255,255,255,0.15);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 0.75rem;
//   }

//   /* Spinner */
//   @keyframes spin { to { transform: rotate(360deg); } }
//   .su-spinner {
//     width: 16px; height: 16px;
//     border: 2px solid rgba(255,255,255,0.3);
//     border-top-color: #fff;
//     border-radius: 50%;
//     animation: spin 0.7s linear infinite;
//   }

//   /* Sign-in link */
//   .su-signin-row {
//     text-align: center;
//     font-size: 0.8rem;
//     color: rgba(255,255,255,0.28);
//     margin-top: 1.25rem;
//   }
//   .su-signin-row a {
//     color: #93C5FD;
//     font-weight: 600;
//     text-decoration: none;
//     transition: color 0.18s;
//   }
//   .su-signin-row a:hover { color: #BFDBFE; }

//   /* Trust badges */
//   .su-trust-row {
//     display: flex; gap: 0.5rem; justify-content: center;
//     flex-wrap: wrap;
//     margin-top: 1.5rem;
//   }
//   .su-trust-badge {
//     display: flex; align-items: center; gap: 0.35rem;
//     font-size: 0.68rem; font-weight: 400; letter-spacing: 0.02em;
//     color: rgba(255,255,255,0.25);
//     padding: 0.3rem 0.6rem;
//     background: rgba(255,255,255,0.03);
//     border: 1px solid rgba(255,255,255,0.06);
//     border-radius: 100px;
//   }
//   .su-trust-dot {
//     width: 5px; height: 5px; border-radius: 50%;
//     background: rgba(52,211,153,0.7);
//   }

//   /* Form spacing */
//   .su-form { display: flex; flex-direction: column; gap: 1.25rem; }
//   .su-field { display: flex; flex-direction: column; }
// `;

// function injectStyles() {
//   if (document.getElementById('customer-signup-styles')) return;
//   const tag = document.createElement('style');
//   tag.id = 'customer-signup-styles';
//   tag.textContent = GLOBAL_CSS;
//   document.head.appendChild(tag);
// }

// /* Password strength helper */
// function getStrength(pw) {
//   if (!pw) return { score: 0, label: '', color: '' };
//   let score = 0;
//   if (pw.length >= 8)  score++;
//   if (/[A-Z]/.test(pw)) score++;
//   if (/[0-9]/.test(pw)) score++;
//   if (/[^A-Za-z0-9]/.test(pw)) score++;
//   const map = [
//     { label: 'Too short', color: '' },
//     { label: 'Weak',      color: 'weak' },
//     { label: 'Fair',      color: 'fair' },
//     { label: 'Good',      color: 'good' },
//     { label: 'Strong',    color: 'strong' },
//   ];
//   return { score, ...map[score] };
// }

// const STRENGTH_COLORS = {
//   weak:   '#EF4444',
//   fair:   '#F59E0B',
//   good:   '#3B82F6',
//   strong: '#34D399',
// };

// export default function CustomerSignup() {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleCreateAccount(e) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       // Create user (customer).
//       await api.post("/auth/signup", {
//         name,
//         email,
//         password,
//         role: "customer",
//       });

//       // Auto-login so the user can upload immediately after "Create Account".
//       const loginRes = await api.post("/auth/login", { email, password });
//       const { token, user } = loginRes.data;
//       setAuth({ token, ...user });
//       navigate("/home");
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || 'Signup failed.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const loginRes = await api.post("/auth/login", { email, password });
//       const { token, user } = loginRes.data;

//       setAuth({ token, ...user });
//       navigate("/upload");
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="sp-page">
//       <div className="sp-container">
//         <div className="sp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
//           <h2 style={{ marginTop: 0 }}>Customer Signup</h2>
//           <div className="sp-divider" />

//           <form onSubmit={handleCreateAccount}>
//             <div className="sp-field">
//               <div className="sp-label">Name</div>
//               <input
//                 className="sp-input"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Your name"
//                 required
//               />
//             </div>

//             <div className="sp-field">
//               <div className="sp-label">Email</div>
//               <input
//                 className="sp-input"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>

//             <div className="sp-field">
//               <div className="sp-label">Password</div>
//               <input
//                 className="sp-input"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 type="password"
//                 placeholder="Create a strong password"
//                 required
//               />
//             </div>

//             {error ? (
//               <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}>{error}</div>
//             ) : null}

//             <button
//               className="sp-btn sp-btn-primary"
//               type="submit"
//               disabled={loading}
//               style={{ width: "100%" }}
//             >
//               {loading ? "Creating..." : "Create Account"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../services/api";
// import { setAuth } from "../services/authStorage";

// const STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

//   :root {
//     --royal:      #112250;
//     --sapphire:   #3C507D;
//     --gold:       #E0C58F;
//     --gold-dim:   rgba(224,197,143,0.15);
//     --gold-glow:  rgba(224,197,143,0.25);
//     --swan:       #F5F0E9;
//     --shell:      #D9CBC2;
//     --ink:        #070E1F;
//     --surface:    rgba(255,255,255,0.03);
//     --surface2:   rgba(255,255,255,0.055);
//     --border:     rgba(224,197,143,0.12);
//     --border-hi:  rgba(224,197,143,0.35);
//     --text:       #C8D4E8;
//     --text-dim:   rgba(200,212,232,0.45);
//     --serif:      'Cormorant Garamond', Georgia, serif;
//     --display:    'Barlow Condensed', sans-serif;
//     --body:       'DM Sans', sans-serif;
//   }

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   /* ── Page ── */
//   .sg-page {
//     min-height: 100vh;
//     background: var(--ink);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 2.5rem 1.25rem;
//     font-family: var(--body);
//     position: relative;
//     overflow: hidden;
//   }

//   /* grid */
//   .sg-page::before {
//     content: '';
//     position: absolute; inset: 0;
//     background-image:
//       linear-gradient(rgba(224,197,143,0.03) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(224,197,143,0.03) 1px, transparent 1px);
//     background-size: 48px 48px;
//     mask-image: radial-gradient(ellipse 75% 75% at 50% 40%, black 30%, transparent 100%);
//     pointer-events: none;
//   }

//   /* ambient blobs */
//   .sg-blob-tl {
//     position: fixed; width: 700px; height: 700px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(17,34,80,0.9) 0%, transparent 65%);
//     top: -200px; left: -250px; pointer-events: none; z-index: 0;
//   }
//   .sg-blob-br {
//     position: fixed; width: 600px; height: 600px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(60,80,125,0.35) 0%, transparent 65%);
//     bottom: -180px; right: -180px; pointer-events: none; z-index: 0;
//   }
//   .sg-blob-gold {
//     position: fixed; width: 400px; height: 400px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(224,197,143,0.05) 0%, transparent 65%);
//     top: 30%; left: 50%; transform: translateX(-50%); pointer-events: none; z-index: 0;
//   }

//   /* ── Wrap ── */
//   .sg-wrap {
//     width: 100%; max-width: 460px;
//     position: relative; z-index: 1;
//     animation: sgFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
//   }

//   @keyframes sgFadeUp {
//     from { opacity: 0; transform: translateY(36px); }
//     to   { opacity: 1; transform: translateY(0); }
//   }

//   /* ── Header ── */
//   .sg-header { text-align: center; margin-bottom: 2rem; }

//   .sg-monogram {
//     width: 64px; height: 64px;
//     border-radius: 18px;
//     margin: 0 auto 1.25rem;
//     display: flex; align-items: center; justify-content: center;
//     background: linear-gradient(145deg, var(--royal), #1a3270);
//     border: 1px solid var(--border-hi);
//     box-shadow:
//       0 0 0 6px rgba(224,197,143,0.05),
//       0 12px 40px rgba(0,0,0,0.5),
//       inset 0 1px 0 rgba(224,197,143,0.15);
//     font-family: var(--serif);
//     font-size: 1.5rem;
//     color: var(--gold);
//     letter-spacing: 0.02em;
//     animation: monoPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
//   }

//   @keyframes monoPop {
//     from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
//     to   { opacity: 1; transform: scale(1) rotate(0deg); }
//   }

//   .sg-eyebrow {
//     font-family: var(--display);
//     font-size: 0.62rem;
//     font-weight: 600;
//     letter-spacing: 0.22em;
//     text-transform: uppercase;
//     color: var(--gold);
//     opacity: 0.7;
//     margin-bottom: 0.4rem;
//   }

//   .sg-title {
//     font-family: var(--serif);
//     font-size: 2.4rem;
//     font-weight: 600;
//     color: var(--swan);
//     letter-spacing: -0.01em;
//     line-height: 1.1;
//   }

//   .sg-title em {
//     font-style: italic;
//     color: var(--gold);
//   }

//   .sg-sub {
//     margin-top: 0.45rem;
//     font-size: 0.78rem;
//     color: var(--text-dim);
//     font-weight: 300;
//     letter-spacing: 0.02em;
//   }

//   /* ── Gold rule ── */
//   .sg-rule {
//     display: flex; align-items: center; gap: 0.75rem;
//     margin: 1.75rem 0;
//   }
//   .sg-rule-line {
//     flex: 1; height: 1px;
//     background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
//   }
//   .sg-rule-diamond {
//     width: 6px; height: 6px;
//     background: var(--gold);
//     transform: rotate(45deg);
//     opacity: 0.5;
//     flex-shrink: 0;
//   }

//   /* ── Card ── */
//   .sg-card {
//     background: rgba(10,18,40,0.75);
//     border: 1px solid var(--border);
//     border-radius: 22px;
//     padding: 2rem;
//     backdrop-filter: blur(32px);
//     -webkit-backdrop-filter: blur(32px);
//     box-shadow:
//       0 2px 0 rgba(224,197,143,0.08) inset,
//       0 0 0 1px rgba(255,255,255,0.03) inset,
//       0 32px 80px rgba(0,0,0,0.55);
//     position: relative;
//     overflow: hidden;
//   }

//   /* top shimmer */
//   .sg-card::before {
//     content: '';
//     position: absolute;
//     top: 0; left: 15%; right: 15%;
//     height: 1px;
//     background: linear-gradient(90deg, transparent, var(--gold), transparent);
//     opacity: 0.4;
//   }

//   /* corner ornaments */
//   .sg-card::after {
//     content: '';
//     position: absolute;
//     bottom: 0; right: 0;
//     width: 120px; height: 120px;
//     background: radial-gradient(circle at bottom right, rgba(60,80,125,0.2) 0%, transparent 65%);
//     pointer-events: none;
//   }

//   /* ── Form ── */
//   .sg-form { display: flex; flex-direction: column; gap: 1.15rem; }

//   /* ── Label ── */
//   .sg-label {
//     font-family: var(--display);
//     font-size: 0.62rem;
//     font-weight: 600;
//     letter-spacing: 0.18em;
//     text-transform: uppercase;
//     color: rgba(224,197,143,0.55);
//     margin-bottom: 0.45rem;
//     display: flex; align-items: center; gap: 0.4rem;
//   }

//   .sg-label::before {
//     content: '';
//     display: inline-block;
//     width: 8px; height: 1px;
//     background: var(--gold);
//     opacity: 0.5;
//   }

//   /* ── Input wrap ── */
//   .sg-input-wrap { position: relative; }

//   .sg-input-icon {
//     position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
//     font-size: 0.85rem; pointer-events: none;
//     opacity: 0.3; transition: opacity 0.2s;
//   }

//   .sg-check-icon {
//     position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
//     font-size: 0.75rem; pointer-events: none;
//     color: #4ade80;
//     animation: checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
//   }

//   @keyframes checkPop {
//     from { opacity: 0; transform: translateY(-50%) scale(0); }
//     to   { opacity: 1; transform: translateY(-50%) scale(1); }
//   }

//   .sg-input {
//     width: 100%;
//     padding: 0.78rem 2.5rem 0.78rem 2.65rem;
//     background: rgba(255,255,255,0.035);
//     border: 1px solid var(--border);
//     border-radius: 12px;
//     color: var(--swan);
//     font-family: var(--body);
//     font-size: 0.875rem;
//     font-weight: 400;
//     outline: none;
//     caret-color: var(--gold);
//     transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
//   }

//   .sg-input::placeholder { color: rgba(200,212,232,0.2); font-weight: 300; }

//   .sg-input:hover {
//     border-color: rgba(224,197,143,0.2);
//     background: rgba(255,255,255,0.05);
//   }

//   .sg-input:focus {
//     border-color: rgba(224,197,143,0.45);
//     background: rgba(224,197,143,0.04);
//     box-shadow: 0 0 0 3px rgba(224,197,143,0.08);
//   }

//   .sg-input:focus + .sg-input-icon { opacity: 0.65; }

//   .sg-input.valid {
//     border-color: rgba(74,222,128,0.3);
//     background: rgba(74,222,128,0.03);
//   }

//   /* ── Strength ── */
//   .sg-strength-bars { display: flex; gap: 3px; margin-top: 0.5rem; }
//   .sg-strength-seg {
//     flex: 1; height: 2px; border-radius: 99px;
//     background: rgba(255,255,255,0.07);
//     transition: background 0.35s ease, transform 0.35s ease;
//   }
//   .sg-strength-seg.weak   { background: #ef4444; transform: scaleY(1.5); }
//   .sg-strength-seg.fair   { background: #f59e0b; transform: scaleY(1.5); }
//   .sg-strength-seg.good   { background: var(--sapphire); transform: scaleY(1.5); }
//   .sg-strength-seg.strong { background: #4ade80; transform: scaleY(1.5); }

//   .sg-strength-label {
//     font-size: 0.62rem;
//     color: var(--text-dim);
//     margin-top: 0.3rem;
//     letter-spacing: 0.05em;
//     font-family: var(--display);
//     text-transform: uppercase;
//     transition: color 0.3s;
//   }

//   /* ── Error ── */
//   .sg-error {
//     display: flex; align-items: flex-start; gap: 0.6rem;
//     background: rgba(239,68,68,0.08);
//     border: 1px solid rgba(239,68,68,0.2);
//     border-radius: 12px;
//     padding: 0.7rem 0.9rem;
//     font-size: 0.78rem; font-weight: 400;
//     color: #fca5a5;
//     letter-spacing: 0.02em;
//     animation: sgShake 0.4s ease;
//   }

//   @keyframes sgShake {
//     0%,100% { transform: translateX(0); }
//     20%      { transform: translateX(-5px); }
//     40%      { transform: translateX(5px); }
//     60%      { transform: translateX(-3px); }
//     80%      { transform: translateX(3px); }
//   }

//   /* ── Divider rule ── */
//   .sg-form-rule {
//     height: 1px;
//     background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
//     margin: 0.25rem 0;
//   }

//   /* ── Submit btn ── */
//   .sg-btn {
//     width: 100%;
//     padding: 0.9rem 1.5rem;
//     border: 1px solid var(--border-hi);
//     border-radius: 13px;
//     background: linear-gradient(135deg, var(--sapphire) 0%, var(--royal) 100%);
//     color: var(--gold);
//     font-family: var(--display);
//     font-size: 0.92rem;
//     font-weight: 700;
//     letter-spacing: 0.14em;
//     text-transform: uppercase;
//     cursor: pointer;
//     position: relative; overflow: hidden;
//     box-shadow:
//       0 4px 20px rgba(17,34,80,0.6),
//       0 1px 0 rgba(224,197,143,0.12) inset;
//     transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
//     display: flex; align-items: center; justify-content: center; gap: 0.6rem;
//   }

//   .sg-btn::before {
//     content: '';
//     position: absolute; inset: 0;
//     background: linear-gradient(90deg, transparent 0%, rgba(224,197,143,0.1) 50%, transparent 100%);
//     transform: translateX(-100%);
//     transition: transform 0.6s ease;
//   }

//   .sg-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 32px rgba(17,34,80,0.7), 0 0 16px var(--gold-glow);
//     background: linear-gradient(135deg, #4a628f 0%, #1a3270 100%);
//   }

//   .sg-btn:hover:not(:disabled)::before { transform: translateX(100%); }
//   .sg-btn:active:not(:disabled) { transform: translateY(0); }
//   .sg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

//   /* spinner */
//   @keyframes sgSpin { to { transform: rotate(360deg); } }
//   .sg-spinner {
//     width: 15px; height: 15px;
//     border: 2px solid rgba(224,197,143,0.25);
//     border-top-color: var(--gold);
//     border-radius: 50%;
//     animation: sgSpin 0.7s linear infinite;
//   }

//   /* ── Footer link ── */
//   .sg-footer-link {
//     text-align: center;
//     font-size: 0.78rem;
//     color: var(--text-dim);
//     margin-top: 1.25rem;
//     font-weight: 300;
//     letter-spacing: 0.02em;
//   }
//   .sg-footer-link button {
//     background: none; border: none; cursor: pointer;
//     color: var(--gold);
//     font-family: var(--body);
//     font-size: 0.78rem;
//     font-weight: 500;
//     padding: 0; margin-left: 0.25rem;
//     text-decoration: underline;
//     text-underline-offset: 3px;
//     text-decoration-color: rgba(224,197,143,0.35);
//     transition: color 0.18s;
//   }
//   .sg-footer-link button:hover { color: var(--swan); }

//   /* ── Trust row ── */
//   .sg-trust {
//     display: flex; gap: 0.5rem;
//     justify-content: center; flex-wrap: wrap;
//     margin-top: 1.5rem;
//   }
//   .sg-trust-chip {
//     display: flex; align-items: center; gap: 0.3rem;
//     padding: 0.28rem 0.65rem;
//     border-radius: 99px;
//     background: rgba(255,255,255,0.025);
//     border: 1px solid rgba(224,197,143,0.08);
//     font-family: var(--display);
//     font-size: 0.58rem;
//     font-weight: 600;
//     letter-spacing: 0.1em;
//     text-transform: uppercase;
//     color: rgba(200,212,232,0.28);
//   }
//   .sg-trust-dot {
//     width: 4px; height: 4px; border-radius: 50%;
//     background: rgba(74,222,128,0.6);
//   }
// `;

// function getStrength(pw) {
//   if (!pw) return { score: 0, label: '' };
//   let s = 0;
//   if (pw.length >= 8) s++;
//   if (/[A-Z]/.test(pw)) s++;
//   if (/[0-9]/.test(pw)) s++;
//   if (/[^A-Za-z0-9]/.test(pw)) s++;
//   return { score: s, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][s] };
// }

// const STRENGTH_CLASS = ['', 'weak', 'fair', 'good', 'strong'];

// export default function CustomerSignup() {
//   const navigate = useNavigate();
//   const [name, setName]         = useState('');
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState('');

//   const strength = getStrength(password);

//   async function handleCreateAccount(e) {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await api.post('/auth/signup', { name, email, password, role: 'customer' });
//       const loginRes = await api.post('/auth/login', { email, password });
//       const { token, user } = loginRes.data;
//       setAuth({ token, ...user });
//       navigate('/home');
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || 'Signup failed.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <style>{STYLES}</style>
//       <div className="sg-page">
//         <div className="sg-blob-tl" />
//         <div className="sg-blob-br" />
//         <div className="sg-blob-gold" />

//         <div className="sg-wrap">
//           {/* Header */}
//           <div className="sg-header">
//             <div className="sg-monogram">SP</div>
//             <p className="sg-eyebrow">SecurePrint Portal</p>
//             <h1 className="sg-title">Create your <em>Account</em></h1>
//             <p className="sg-sub">Encrypted · Secure · Instant access</p>
//           </div>

//           {/* Card */}
//           <div className="sg-card">
//             <form className="sg-form" onSubmit={handleCreateAccount}>

//               {/* Name */}
//               <div>
//                 <div className="sg-label">Full Name</div>
//                 <div className="sg-input-wrap">
//                   <input
//                     className={`sg-input${name.length > 1 ? ' valid' : ''}`}
//                     placeholder="Your full name"
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                     required
//                   />
//                   <span className="sg-input-icon">✦</span>
//                   {name.length > 1 && <span className="sg-check-icon">✓</span>}
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <div className="sg-label">Email Address</div>
//                 <div className="sg-input-wrap">
//                   <input
//                     className={`sg-input${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? ' valid' : ''}`}
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                   />
//                   <span className="sg-input-icon">◈</span>
//                   {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && <span className="sg-check-icon">✓</span>}
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <div className="sg-label">Password</div>
//                 <div className="sg-input-wrap">
//                   <input
//                     className="sg-input"
//                     type="password"
//                     placeholder="Create a strong password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                   />
//                   <span className="sg-input-icon">◉</span>
//                 </div>
//                 {password && (
//                   <>
//                     <div className="sg-strength-bars">
//                       {[1,2,3,4].map(i => (
//                         <div
//                           key={i}
//                           className={`sg-strength-seg${strength.score >= i ? ' ' + STRENGTH_CLASS[strength.score] : ''}`}
//                         />
//                       ))}
//                     </div>
//                     <div className="sg-strength-label">{strength.label}</div>
//                   </>
//                 )}
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="sg-error">
//                   <span>⚠</span>
//                   {error}
//                 </div>
//               )}

//               <div className="sg-form-rule" />

//               {/* Submit */}
//               <button className="sg-btn" type="submit" disabled={loading}>
//                 {loading
//                   ? <><div className="sg-spinner" /> Processing…</>
//                   : <>✦ &nbsp; Create Account</>
//                 }
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="sg-footer-link">
//               Already have an account?
//               <button type="button" onClick={() => navigate('/admin/login')}>
//                 Sign In
//               </button>
//             </div>
//           </div>

//           {/* Trust chips */}
//           <div className="sg-trust">
//             {['256-bit Encrypted', 'Zero Retention', 'Secure Session'].map(t => (
//               <div className="sg-trust-chip" key={t}>
//                 <div className="sg-trust-dot" />
//                 {t}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// 
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, FileText, UserPlus } from "lucide-react";

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAccount(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Signup attempt:", { name, email, password, role: "customer" });
      
      const res = await api.post("/auth/signup", { name, email, password, role: "customer" });
      console.log("Signup response:", res.data);
      
      // Check if signup was successful and OTP was sent
      if (res.status === 201 && res.data.message) {
        // Navigate to OTP page with email state
        navigate("/verify-otp", { state: { email } });
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginRes = await api.post("/auth/login", { email, password });
      const { token, user } = loginRes.data;
      setAuth({ token, ...user });
      navigate("/upload");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-amber-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[90vh]">
          
          {/* LEFT SIDE - BRANDING */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center p-12 text-white"
          >
            <div className="space-y-8">
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25"
              >
                <UserPlus size={40} className="text-white" />
              </motion.div>

              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  Join PrivyPrint
                </motion.h1>
                
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl font-semibold text-white/90"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  {isLogin ? "Welcome Back" : "Get Started Today"}
                </motion.h2>
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg text-white/60 leading-relaxed max-w-md"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {isLogin 
                  ? "Sign in to access your secure printing dashboard and manage your documents."
                  : "Create your account and start printing securely with enterprise-grade protection."
                }
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">Free to get started</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">Instant access</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center p-8 lg:p-12"
          >
            <div className="w-full max-w-md">
              {/* Glassmorphic Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,107,53,0.2)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,53,0.15)'
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
                
                <div className="relative p-8 lg:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25"
                    >
                      {isLogin ? <FileText size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
                    </motion.div>
                    
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: '"Inter Tight", sans-serif' }}
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                    </motion.h2>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-white/60"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {isLogin ? "Access your secure print portal" : "Join thousands of secure printing users"}
                    </motion.p>
                  </div>

                  {/* Form */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? "login" : "signup"}
                      initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <form onSubmit={isLogin ? handleLogin : handleCreateAccount} className="space-y-6">
                        {/* Name Field (only for signup) */}
                        {!isLogin && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="relative"
                          >
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                            <input
                              type="text"
                              placeholder="Full name"
                              className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                              style={{
                                fontFamily: '"Inter", sans-serif'
                              }}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </motion.div>
                        )}

                        {/* Email Field */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                          className="relative"
                        >
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                          <input
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                            style={{
                              fontFamily: '"Inter", sans-serif'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="relative"
                        >
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                          <input
                            type="password"
                            placeholder={isLogin ? "Password" : "Create a password"}
                            className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                            style={{
                              fontFamily: '"Inter", sans-serif'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm font-medium text-center"
                            style={{ fontFamily: '"Inter", sans-serif' }}
                          >
                            {error}
                          </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          style={{ fontFamily: '"Inter Tight", sans-serif' }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <span className="relative flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                {isLogin ? "Signing in..." : "Creating account..."}
                              </>
                            ) : (
                              <>
                                {isLogin ? "Sign In" : "Create Account"}
                                <ArrowRight size={20} />
                              </>
                            )}
                          </span>
                        </motion.button>
                      </form>
                    </motion.div>
                  </AnimatePresence>

                  {/* Toggle Mode */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    className="text-center mt-8"
                  >
                    <p className="text-white/60" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        className="text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-200"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}