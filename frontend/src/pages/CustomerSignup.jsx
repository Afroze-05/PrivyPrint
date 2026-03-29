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
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";

/* ─────────────────────────────────────────────────────────
   CSS — Sapphire × Gold luxury aesthetic
───────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Poppins:wght@300;400;500;600;700&display=swap');

  :root {
    --royal:       #112250;
    --sapphire:    #3C507D;
    --navy:        #0A192F;
    --navy-deep:   #060F1E;
    --gold:        #E0C58F;
    --gold-mid:    #C9A85C;
    --gold-dark:   #D4AD6E;
    --gold-dim:    rgba(224,197,143,0.15);
    --gold-border: rgba(224,197,143,0.22);
    --gold-glow:   rgba(224,197,143,0.10);
    --cream:       #F5F0E9;
    --cream-dim:   rgba(245,240,233,0.55);
    --cream-muted: rgba(245,240,233,0.30);
    --border:      rgba(255,255,255,0.07);
    --red-dim:     rgba(192,57,43,0.12);
    --red-border:  rgba(192,57,43,0.28);
    --serif:       'Cormorant Garamond', Georgia, serif;
    --sans:        'Poppins', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sg-page {
    min-height: 100vh;
    background: var(--navy-deep);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1.5rem;
    position: relative;
    overflow: hidden;
    font-family: var(--sans);
  }

  /* diagonal hairlines texture */
  .sg-page::before {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(224,197,143,0.018) 40px,
      rgba(224,197,143,0.018) 41px
    );
    pointer-events: none;
  }

  .sg-glow-tl {
    position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(60,80,125,0.20) 0%, transparent 65%);
    top: -260px; left: -200px; pointer-events: none;
  }
  .sg-glow-br {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(17,34,80,0.30) 0%, transparent 65%);
    bottom: -200px; right: -150px; pointer-events: none;
  }
  .sg-glow-gold {
    position: absolute; width: 500px; height: 160px; border-radius: 50%;
    background: radial-gradient(ellipse, rgba(224,197,143,0.055) 0%, transparent 70%);
    bottom: -30px; left: 50%; transform: translateX(-50%);
    pointer-events: none;
  }

  /* ── Card ── */
  .sg-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 452px;
    background: linear-gradient(155deg,
      rgba(17,34,80,0.75) 0%,
      rgba(6,15,30,0.88) 100%
    );
    backdrop-filter: blur(36px);
    -webkit-backdrop-filter: blur(36px);
    border: 1px solid var(--gold-border);
    border-radius: 24px;
    padding: 2.75rem 2.5rem;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 40px 90px rgba(0,0,0,0.65),
      0 8px 32px rgba(0,0,0,0.4),
      0 0 60px rgba(60,80,125,0.10);
    animation: sgFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  .sg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 18%; right: 18%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(224,197,143,0.55), transparent);
  }

  @keyframes sgFadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .sg-header { text-align: center; margin-bottom: 2rem; }

  .sg-emblem {
    display: inline-flex; align-items: center; justify-content: center;
    width: 54px; height: 54px; border-radius: 16px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-border);
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 0 28px var(--gold-glow), 0 0 0 6px rgba(224,197,143,0.04);
    animation: sgFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }

  .sg-title {
    font-family: var(--serif);
    font-size: 2.15rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--cream);
    line-height: 1.2;
    animation: sgFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.14s both;
  }

  .sg-title em { font-style: italic; color: var(--gold); }

  .sg-sub {
    margin-top: 0.5rem;
    font-size: 0.68rem;
    font-weight: 300;
    color: var(--cream-muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    animation: sgFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  /* ── Divider ── */
  .sg-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(224,197,143,0.15), transparent);
    margin: 0 0 1.75rem;
  }

  /* ── Form ── */
  .sg-form { display: flex; flex-direction: column; gap: 1.2rem; }
  .sg-field { display: flex; flex-direction: column; gap: 0.42rem; }

  .sg-label {
    font-size: 0.63rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cream-muted);
    padding-left: 1px;
  }

  .sg-input-wrap { position: relative; display: flex; align-items: center; }

  .sg-input-icon {
    position: absolute; left: 14px;
    font-size: 0.82rem; opacity: 0.32;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .sg-input {
    width: 100%;
    padding: 0.78rem 2.5rem 0.78rem 2.6rem;
    background: rgba(255,255,255,0.033);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--cream);
    font-family: var(--sans);
    font-size: 0.845rem;
    font-weight: 400;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    caret-color: var(--gold);
  }

  .sg-input::placeholder { color: rgba(245,240,233,0.18); font-weight: 300; }

  .sg-input:hover {
    border-color: rgba(224,197,143,0.18);
    background: rgba(255,255,255,0.05);
  }

  .sg-input:focus {
    border-color: rgba(224,197,143,0.42);
    background: rgba(224,197,143,0.035);
    box-shadow: 0 0 0 3px rgba(224,197,143,0.07);
  }

  .sg-input:focus ~ .sg-input-icon { opacity: 0.6; }

  .sg-input.valid {
    border-color: rgba(110,231,183,0.3);
    background: rgba(110,231,183,0.025);
  }

  .sg-valid-icon {
    position: absolute; right: 13px;
    font-size: 0.8rem; color: #6EE7B7;
    pointer-events: none;
    animation: sgCheckPop 0.3s ease both;
  }

  @keyframes sgCheckPop {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Strength ── */
  .sg-strength { margin-top: 0.38rem; }
  .sg-strength-bars { display: flex; gap: 4px; }
  .sg-strength-bar {
    flex: 1; height: 2px; border-radius: 99px;
    background: rgba(255,255,255,0.07);
    transition: background 0.35s;
  }
  .sg-strength-bar.s-weak   { background: #C0392B; }
  .sg-strength-bar.s-fair   { background: #C9930A; }
  .sg-strength-bar.s-good   { background: #3C507D; }
  .sg-strength-bar.s-strong { background: #6EE7B7; }
  .sg-strength-label {
    font-size: 0.63rem; font-weight: 400;
    color: var(--cream-muted); margin-top: 0.28rem;
    letter-spacing: 0.04em;
  }

  /* ── Error ── */
  .sg-error {
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--red-dim); border: 1px solid var(--red-border);
    border-radius: 12px; padding: 0.7rem 1rem;
    font-size: 0.775rem; font-weight: 500; color: #E88080;
    animation: sgShake 0.4s ease;
  }

  @keyframes sgShake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-5px); }
    40%     { transform: translateX(5px); }
    60%     { transform: translateX(-3px); }
    80%     { transform: translateX(3px); }
  }

  .sg-error-dot { width: 6px; height: 6px; border-radius: 50%; background: #E88080; flex-shrink: 0; }

  /* ── Button ── */
  .sg-btn {
    width: 100%; padding: 0.9rem 1.5rem;
    border: 1px solid rgba(224,197,143,0.35);
    border-bottom-color: rgba(224,197,143,0.5);
    border-radius: 14px; cursor: pointer;
    font-family: var(--sans);
    font-size: 0.78rem; font-weight: 600;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--navy-deep);
    background: linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-mid) 100%);
    box-shadow:
      0 4px 24px rgba(224,197,143,0.18),
      0 1px 0 rgba(255,255,255,0.18) inset,
      0 -1px 0 rgba(0,0,0,0.1) inset;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }

  .sg-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
    background-size: 200% auto;
    transform: translateX(-100%);
    transition: transform 0.55s ease;
  }

  .sg-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(224,197,143,0.28), 0 1px 0 rgba(255,255,255,0.22) inset;
  }
  .sg-btn:hover:not(:disabled)::before { transform: translateX(100%); }
  .sg-btn:active:not(:disabled) { transform: translateY(0); }
  .sg-btn:disabled { opacity: 0.48; cursor: not-allowed; }

  .sg-btn-inner { display: flex; align-items: center; justify-content: center; gap: 0.55rem; }

  /* ── Spinner ── */
  @keyframes sgSpin { to { transform: rotate(360deg); } }
  .sg-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(10,25,47,0.25);
    border-top-color: var(--navy-deep);
    border-radius: 50%;
    animation: sgSpin 0.7s linear infinite;
  }

  /* ── Footer ── */
  .sg-footer {
    text-align: center; margin-top: 1.5rem;
    font-size: 0.75rem; font-weight: 300; color: var(--cream-muted);
  }
  .sg-footer a { color: var(--gold); font-weight: 500; text-decoration: none; transition: opacity 0.2s; }
  .sg-footer a:hover { opacity: 0.72; }

  /* ── Trust row ── */
  .sg-trust { display: flex; justify-content: center; gap: 1rem; margin-top: 1.75rem; flex-wrap: wrap; }
  .sg-trust-item {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.6rem; font-weight: 400;
    color: rgba(245,240,233,0.18);
    letter-spacing: 0.08em; text-transform: uppercase;
  }
`;

function injectCSS() {
  if (document.getElementById('sg-styles')) return;
  const el = document.createElement('style');
  el.id = 'sg-styles';
  el.textContent = CSS;
  document.head.appendChild(el);
}

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', tier: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const tiers  = ['', 's-weak', 's-fair', 's-good', 's-strong'];
  return { score: s, label: labels[s], tier: tiers[s] };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerSignup() {
  injectCSS();
  const navigate = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const strength    = getStrength(password);
  const nameValid   = name.trim().length > 1;
  const emailValid  = emailRegex.test(email);

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
    <div className="sg-page">
      <div className="sg-glow-tl" />
      <div className="sg-glow-br" />
      <div className="sg-glow-gold" />

      <div className="sg-card">
        {/* Header */}
        <div className="sg-header">
          <div className="sg-emblem">💎</div>
          <h1 className="sg-title">Create your <em>Account</em></h1>
          <p className="sg-sub">Secure · Private · Instant</p>
        </div>

        <div className="sg-divider" />

        {/* Form */}
        <form className="sg-form" onSubmit={handleCreateAccount}>

          {/* Name */}
          <div className="sg-field">
            <label className="sg-label">Full Name</label>
            <div className="sg-input-wrap">
              <input
                className={`sg-input${nameValid ? ' valid' : ''}`}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <span className="sg-input-icon">👤</span>
              {nameValid && <span className="sg-valid-icon">✓</span>}
            </div>
          </div>

          {/* Email */}
          <div className="sg-field">
            <label className="sg-label">Email Address</label>
            <div className="sg-input-wrap">
              <input
                className={`sg-input${emailValid ? ' valid' : ''}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <span className="sg-input-icon">✉️</span>
              {emailValid && <span className="sg-valid-icon">✓</span>}
            </div>
          </div>

          {/* Password */}
          <div className="sg-field">
            <label className="sg-label">Password</label>
            <div className="sg-input-wrap">
              <input
                className="sg-input"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span className="sg-input-icon">🔒</span>
            </div>
            {password && (
              <div className="sg-strength">
                <div className="sg-strength-bars">
                  {[1, 2, 3, 4].map(n => (
                    <div
                      key={n}
                      className={`sg-strength-bar${strength.score >= n ? ` ${strength.tier}` : ''}`}
                    />
                  ))}
                </div>
                <div className="sg-strength-label">{strength.label}</div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="sg-error">
              <div className="sg-error-dot" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button className="sg-btn" type="submit" disabled={loading}>
            <div className="sg-btn-inner">
              {loading && <div className="sg-spinner" />}
              {loading ? 'Creating Account…' : 'Create Account'}
            </div>
          </button>
        </form>

        {/* Sign-in link */}
        <p className="sg-footer">
          Already have an account?{' '}
          <a href="/admin/login">Sign in</a>
        </p>

        {/* Trust */}
        <div className="sg-trust">
          <span className="sg-trust-item">🔐 Encrypted</span>
          <span className="sg-trust-item">🛡 Secure</span>
          <span className="sg-trust-item">⚡ Instant Access</span>
        </div>
      </div>
    </div>
  );
}