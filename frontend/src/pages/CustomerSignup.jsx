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
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ChevronRight, Cpu, ArrowLeft } from "lucide-react";

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Dot-grid background ── */
const GridDots = ({ color = "#3BBCD9", opacity = 0.08 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity,
    }}
  />
);

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Styled input field ── */
const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black tracking-[0.45em] text-white/35 uppercase">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-4 h-4 text-white/20 group-focus-within:text-[#3BBCD9] transition-colors duration-300" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0E1A21] border border-white/8 text-white text-sm font-medium placeholder:text-white/20
          focus:outline-none focus:border-[#3BBCD9]/50 focus:bg-[#0E1A21]
          transition-all duration-300 py-4 pr-4 tracking-wide"
        style={{
          paddingLeft: Icon ? "2.75rem" : "1rem",
          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        }}
      />
      {/* Bottom glow on focus */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#3BBCD9]/0 group-focus-within:bg-[#3BBCD9]/50 transition-all duration-300" />
    </div>
  </div>
);

function injectCSS() {
  if (document.getElementById('customer-signup-css')) return;
  // CSS injection point for any missing styles
}

export default function CustomerSignup() {
  injectCSS();
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
      await api.post("/auth/signup", { name, email, password, role: "customer" });
      const loginRes = await api.post("/auth/login", { email, password });
      const { token, user } = loginRes.data;
      setAuth({ token, ...user });
      navigate("/upload");
    } catch (err) {
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
    <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#3BBCD9" size={420} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#D91828" size={340} top="50%" left="60%" delay={2} />
      <GlowOrb color="#D9910D" size={220} top="70%" left="10%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/25 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#3BBCD9]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />

      {/* System tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-[#3BBCD9]/40" />
        <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
          PrivyPrint OS v4.2
        </span>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate("/home")}
        className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#3BBCD9] transition-colors duration-300 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-[9px] font-black tracking-[0.45em] uppercase">Back</span>
      </motion.button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-8 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
          <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
            Customer Portal
          </span>
        </motion.div>

        {/* Title */}
        <h1
          style={{ fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace', lineHeight: 0.88 }}
          className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase select-none mb-2"
        >
          {isLogin ? (
            <>Customer <span className="text-[#3BBCD9]" style={{ textShadow: "0 0 40px rgba(59,188,217,0.4)" }}>Login</span></>
          ) : (
            <>Create <span className="text-[#3BBCD9]" style={{ textShadow: "0 0 40px rgba(59,188,217,0.4)" }}>Account</span></>
          )}
        </h1>
        <div className="w-full h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-[#3BBCD9] mb-10 mt-5" />

        {/* Form panel */}
        <div
          className="relative bg-[#0E1A21] border border-white/6 p-8 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3BBCD9] to-transparent" />
          {/* Chamfer corner */}
          <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#3BBCD9]/30" />
          {/* Inner ambient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top left, rgba(59,188,217,0.04) 0%, transparent 60%)" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form onSubmit={isLogin ? handleLogin : handleCreateAccount} className="flex flex-col gap-5">
                {!isLogin && (
                  <Field
                    label="Name"
                    icon={User}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                )}

                <Field
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />

                <Field
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your password" : "Create a strong password"}
                  required
                />

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D91828] flex-shrink-0" />
                    <span className="text-[#D91828] text-xs font-bold">{error}</span>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="relative overflow-hidden group w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                  }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {isLogin ? "Logging in..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {isLogin ? "Login" : "Create Account"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-white/6" />
            <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">or</span>
            <div className="flex-1 h-[1px] bg-white/6" />
          </div>

          {/* Toggle mode */}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="w-full py-3.5 border border-white/8 text-white/30 hover:text-[#3BBCD9] hover:border-[#3BBCD9]/30 transition-all duration-300 text-xs font-black uppercase tracking-[0.35em]"
          >
            {isLogin ? "Switch to Signup" : "Switch to Login"}
          </button>
        </div>
      </motion.div>

      {/* Floating status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#3BBCD9]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
      >
        <span className="text-[10px] font-black text-[#3BBCD9] uppercase tracking-[0.35em]">
          System Live
        </span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}