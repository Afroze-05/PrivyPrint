import { useNavigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";
import { motion } from "framer-motion";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

/* ── Subtle noise overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Soft dot-grid background ── */
const GridDots = ({ color = "#FF6B35", opacity = 0.03 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      opacity,
    }}
  />
);

/* ── Subtle glow orbs ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
    transition={{ duration: 12, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ─────────────────────────────────────────────
   Styles — Home portal, same design system
   Two-card selector: Customer (blue) vs Admin (red)
───────────────────────────────────────────── */
const HOME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .hm-root {
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
  .hm-blob-blue {
    position: fixed; pointer-events: none;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 68%);
    top: -140px; left: -160px;
  }
  .hm-blob-red {
    position: fixed; pointer-events: none;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(217,24,40,0.08) 0%, transparent 68%);
    bottom: -120px; right: -130px;
  }

  /* Grain */
  .hm-grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 180px 180px; opacity: 0.5;
  }

  /* Grid */
  .hm-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%);
  }

  /* Animations */
  @keyframes hm-fade-up {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hm-scale-in {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes hm-pulse-blue {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  @keyframes hm-pulse-red {
    0%   { box-shadow: 0 0 0 0 rgba(217,24,40,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(217,24,40,0); }
    100% { box-shadow: 0 0 0 0 rgba(217,24,40,0); }
  }
  @keyframes hm-shimmer-blue {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes hm-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }
  @keyframes hm-scan {
    from { top: -100%; }
    to   { top: 200%; }
  }

  .hm-anim-up    { animation: hm-fade-up  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .hm-anim-scale { animation: hm-scale-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .hm-d1 { animation-delay: 0.08s; }
  .hm-d2 { animation-delay: 0.16s; }
  .hm-d3 { animation-delay: 0.26s; }
  .hm-d4 { animation-delay: 0.38s; }

  /* Logo chip */
  .hm-logo-chip {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.22);
    border-radius: 100px;
    padding: 0.28rem 0.85rem 0.28rem 0.42rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: #93C5FD; margin-bottom: 1.25rem;
  }
  .hm-logo-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3B82F6;
    animation: hm-pulse-blue 2s ease-out infinite;
  }

  /* Heading */
  .hm-heading {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: clamp(2.4rem, 5vw, 3.2rem);
    letter-spacing: -0.01em; text-transform: uppercase; line-height: 0.95;
    color: #F1F5FF; margin: 0;
  }
  .hm-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; font-weight: 300;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-top: 0.5rem;
  }

  /* Portal cards grid */
  .hm-cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 520px) {
    .hm-cards-grid { grid-template-columns: 1fr; }
  }

  /* Portal card base */
  .hm-portal-card {
    position: relative; overflow: hidden;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.03);
    padding: 2rem 1.75rem 1.75rem;
    cursor: pointer; text-align: left;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
    display: flex; flex-direction: column; gap: 0;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .hm-portal-card:focus-visible { outline: 2px solid #3B82F6; outline-offset: 2px; }

  /* Scan-line hover effect */
  .hm-portal-card::after {
    content: '';
    position: absolute; left: 0; right: 0;
    height: 40px; top: -100%;
    background: linear-gradient(transparent, rgba(255,255,255,0.04), transparent);
    pointer-events: none;
    transition: none;
  }
  .hm-portal-card:hover::after {
    animation: hm-scan 0.55s ease;
  }

  /* Blue — Customer */
  .hm-portal-blue {
    border-top: 2px solid rgba(59,130,246,0.5);
  }
  .hm-portal-blue:hover {
    border-color: rgba(59,130,246,0.7);
    border-top-color: #3B82F6;
    background: rgba(59,130,246,0.07);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 30px rgba(59,130,246,0.12);
  }

  /* Red — Admin */
  .hm-portal-red {
    border-top: 2px solid rgba(217,24,40,0.4);
  }
  .hm-portal-red:hover {
    border-color: rgba(217,24,40,0.6);
    border-top-color: #D91828;
    background: rgba(217,24,40,0.06);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 30px rgba(217,24,40,0.1);
  }

  /* Card icon box */
  .hm-card-icon {
    width: 48px; height: 48px; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 1.4rem;
    flex-shrink: 0;
    animation: hm-float 3.5s ease-in-out infinite;
  }
  .hm-card-icon-blue {
    background: rgba(59,130,246,0.12);
    border: 1px solid rgba(59,130,246,0.2);
  }
  .hm-card-icon-red {
    background: rgba(217,24,40,0.1);
    border: 1px solid rgba(217,24,40,0.2);
    animation-delay: 0.6s;
  }

  /* Card number */
  .hm-card-num {
    position: absolute; top: 1.1rem; right: 1.25rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.12);
  }

  /* Card label + desc */
  .hm-card-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 1.5rem;
    letter-spacing: 0.04em; text-transform: uppercase; line-height: 1;
    margin: 0 0 0.35rem 0;
  }
  .hm-card-label-blue { color: #93C5FD; }
  .hm-card-label-red  { color: #FCA5A5; }

  .hm-card-desc {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem; font-weight: 300; line-height: 1.6;
    color: rgba(255,255,255,0.28);
    margin: 0;
  }

  /* Card arrow */
  .hm-card-arrow {
    margin-top: 1.75rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase;
    transition: gap 0.22s ease, opacity 0.22s ease;
    opacity: 0.3;
  }
  .hm-portal-card:hover .hm-card-arrow {
    gap: 0.85rem;
    opacity: 0.7;
  }
  .hm-card-arrow-blue { color: #3B82F6; }
  .hm-card-arrow-red  { color: #D91828; }
  .hm-arrow-line {
    flex: 1; height: 1px; max-width: 32px;
    background: currentColor; opacity: 0.5;
    transition: max-width 0.22s ease;
  }
  .hm-portal-card:hover .hm-arrow-line { max-width: 56px; }

  /* Auth status badge */
  .hm-auth-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.18);
    border-radius: 3px;
    padding: 0.22rem 0.65rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(52,211,153,0.7);
    margin-bottom: 0.5rem;
  }
  .hm-auth-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #34D399;
    box-shadow: 0 0 5px rgba(52,211,153,0.6);
  }

  /* Divider */
  .hm-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  }

  /* Trust row */
  .hm-trust-row {
    display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;
    margin-top: 1.5rem;
  }
  .hm-trust-badge {
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.06em;
    color: rgba(255,255,255,0.18);
    padding: 0.28rem 0.6rem;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 3px;
  }
  .hm-trust-dot-green { width: 4px; height: 4px; border-radius: 50%; background: rgba(52,211,153,0.55); }

  /* Wrapper card */
  .hm-wrapper {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 6px;
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03) inset,
      0 32px 80px rgba(0,0,0,0.55);
    padding: 2.5rem;
    width: 100%; max-width: 560px;
  }
`;

function injectStyles() {
  if (document.getElementById('home-page-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'home-page-styles';
  tag.textContent = HOME_CSS;
  document.head.appendChild(tag);
}

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

<<<<<<< HEAD
  if (typeof window !== 'undefined') injectStyles();

  const handleCustomer = () => {
    if (auth?.token && auth.role === 'customer') navigate('/upload');
    else navigate('/signup');
  };

  const portals = [
    {
      id: 'customer',
      num: '01',
      icon: '👤',
      label: 'Customer',
      desc: 'Upload documents and generate a secure one-time print token.',
      arrow: 'Enter Portal',
      cardClass: 'hm-portal-blue',
      iconClass: 'hm-card-icon-blue',
      labelClass: 'hm-card-label-blue',
      arrowClass: 'hm-card-arrow-blue',
      onClick: handleCustomer,
    },
    {
      id: 'admin',
      num: '02',
      icon: '🛡',
      label: 'Admin',
      desc: 'Access the command panel to manage print jobs and users.',
      arrow: 'Admin Login',
      cardClass: 'hm-portal-red',
      iconClass: 'hm-card-icon-red',
      labelClass: 'hm-card-label-red',
      arrowClass: 'hm-card-arrow-red',
      onClick: () => navigate('/admin/login'),
    },
  ];

  return (
    <div className="hm-root">
      <div className="hm-blob-blue" />
      <div className="hm-blob-red" />
      <div className="hm-grain" />
      <div className="hm-grid" />

      <div className="hm-anim-up" style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="hm-anim-scale" style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <div className="hm-logo-chip">
              <span className="hm-logo-dot" />
              SecurePrint
            </div>
          </div>

          {/* Show session badge if logged in */}
          {auth?.token && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.65rem' }}>
              <div className="hm-auth-badge">
                <span className="hm-auth-dot" />
                Session Active · {auth.name || auth.email}
              </div>
            </div>
          )}

          <h1 className="hm-heading hm-anim-up hm-d1">
            Select<br />Your Portal
          </h1>
          <p className="hm-sub hm-anim-up hm-d2">
            Choose an access level to continue
          </p>
        </div>

        {/* Wrapper card */}
        <div className="hm-wrapper hm-anim-up hm-d2">

          <div className="hm-cards-grid">
            {portals.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`hm-portal-card ${p.cardClass} hm-anim-up`}
                style={{ animationDelay: `${0.22 + i * 0.1}s` }}
                onClick={p.onClick}
              >
                {/* Card number */}
                <span className="hm-card-num">{p.num}</span>

                {/* Icon */}
                <div className={`hm-card-icon ${p.iconClass}`}>
                  {p.icon}
                </div>

                {/* Label */}
                <h3 className={`hm-card-label ${p.labelClass}`}>{p.label}</h3>

                {/* Desc */}
                <p className="hm-card-desc">{p.desc}</p>

                {/* Arrow CTA */}
                <div className={`hm-card-arrow ${p.arrowClass}`}>
                  <span className="hm-arrow-line" />
                  {p.arrow}
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="hm-divider" style={{ marginTop: '1.5rem' }} />

          {/* Footer note */}
          <div style={{
            marginTop: '1rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.15)',
            textAlign: 'center',
          }}>
            All sessions are end-to-end encrypted
          </div>
        </div>

        {/* Trust badges */}
        <div className="hm-trust-row hm-anim-up hm-d4">
          {['256-bit AES', 'Zero Logs', 'GDPR Ready'].map((t) => (
            <div key={t} className="hm-trust-badge">
              <span className="hm-trust-dot-green" />
              {t}
            </div>
          ))}
        </div>

=======
  const cards = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Customer Portal",
      description: "Secure access to dashboard and printing services",
      accent: "#FF6B35",
      route: "/signup",
      index: 0,
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Admin Control",
      description: "Advanced administrative controls and management",
      accent: "#FFC107",
      route: "/admin/login",
      index: 1,
    },
  ];

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden font-sans"
      style={{
        background: `linear-gradient(135deg, 
          #000000 0%, 
          #0a0a0a 30%, 
          #111111 60%, 
          #0f0f0f 100%)`
      }}
    >
      {/* Subtle background elements */}
      <NoiseSVG />
      <GridDots />
      
      {/* Minimal glow orbs */}
      <GlowOrb color="rgba(255,107,53,0.06)" size={400} top="-5%" left="-5%" delay={0} />
      <GlowOrb color="rgba(255,193,7,0.04)" size={350} top="50%" left="60%" delay={3} />

      {/* Clean edge accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFC107]/20 to-transparent" />

      {/* Full screen content grid */}
      <div className="relative z-10 h-full grid grid-rows-[1fr_auto] max-w-7xl mx-auto px-6 py-8">
        {/* Main content area */}
        <div className="flex flex-col items-center justify-center">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Clean eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#FF6B35]/15 bg-black/20 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-[#FF6B35]/80 uppercase">
                Secure Printing Platform
              </span>
            </motion.div>

            {/* Clean wordmark */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                fontFamily: '"Inter", "Satoshi", ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4"
            >
              Privy<span
                className="bg-gradient-to-r from-[#FF6B35] to-[#FFC107] bg-clip-text text-transparent"
              >Print</span>
            </motion.h1>

            {/* Clean subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-base sm:text-lg text-[#AAAAAA] font-normal leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Enterprise-grade secure printing solutions with advanced authentication
            </motion.p>
          </motion.div>

          {/* Enhanced cards section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
          >
            {cards.map(({ icon, title, description, accent, route, index }) => (
              <motion.div
                key={route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(route)}
                  className="relative w-full text-left p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(255, 107, 53, 0.2)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 107, 53, 0.15), 0 0 60px rgba(255, 193, 7, 0.08)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${accent}40`
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                    e.currentTarget.style.boxShadow = `0 15px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 107, 53, 0.3), 0 0 80px rgba(255, 193, 7, 0.15)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                    e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 107, 53, 0.15), 0 0 60px rgba(255, 193, 7, 0.08)"
                  }}
                >
                  {/* Inner light effect */}
                  <div
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top left, rgba(255, 193, 7, 0.12), transparent 40%)`,
                    }}
                  />
                  
                  {/* Enhanced glow overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${accent}08 0%, transparent 60%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Enhanced icon container with glow */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300"
                      style={{
                        background: `${accent}15`,
                        borderColor: `${accent}25`,
                      }}
                    >
                      <div 
                        style={{ 
                          color: accent,
                          filter: "drop-shadow(0 0 10px rgba(255,107,53,0.5))"
                        }}
                      >
                        {icon}
                      </div>
                    </motion.div>

                    {/* Enhanced title */}
                    <h3
                      className="text-xl font-semibold text-white mb-2"
                      style={{ fontFamily: '"Inter", "Satoshi", sans-serif' }}
                    >
                      {title}
                    </h3>
                    
                    {/* Enhanced description */}
                    <p className="text-[#BBBBBB] text-sm font-normal leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Enhanced CTA with glow */}
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="text-sm font-medium transition-colors duration-300"
                        style={{ 
                          color: accent,
                          textShadow: `0 0 8px ${accent}40`
                        }}
                      >
                        Access Portal
                      </span>
                      <ArrowRight
                        className="w-4 h-4 transition-all duration-300"
                        style={{ 
                          color: accent,
                          filter: "drop-shadow(0 0 6px rgba(255,107,53,0.4))"
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center justify-center"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF6B35]/15 bg-black/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
            <span className="text-xs font-medium text-[#AAAAAA]">
              System Online
            </span>
          </div>
        </motion.div>
>>>>>>> 169ad32859c812165053aa6adac6e5d2634d2dc5
      </div>
    </div>
  );
}