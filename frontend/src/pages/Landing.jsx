import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, FileText, Zap, Eye, Server } from "lucide-react";

/* ─────────────────────────────────────────────
   Global CSS injected once
───────────────────────────────────────────── */
const LANDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap');

  .lp-root * { box-sizing: border-box; }

  /* ── Grain overlay ── */
  .lp-grain {
    position: fixed; inset: 0; z-index: 100; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    mix-blend-mode: overlay;
  }

  /* ── Status pill ── */
  .lp-status {
    position: fixed; top: 1.75rem; right: 1.75rem; z-index: 200;
    display: flex; align-items: center; gap: 0.6rem;
    background: rgba(38,51,59,0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(59,188,217,0.2);
    padding: 0.45rem 0.9rem 0.45rem 0.6rem;
    border-radius: 100px;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.12em;
    color: #3BBCD9; text-transform: uppercase;
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(59,188,217,0.1) inset;
  }
  .lp-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #D91828;
    box-shadow: 0 0 8px #D91828, 0 0 16px rgba(217,24,40,0.5);
    animation: lp-pulse 1.8s ease-in-out infinite;
  }
  @keyframes lp-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.85); }
  }

  /* ── Scroll indicator ── */
  .lp-scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(59,188,217,0.4);
    animation: lp-float 2.5s ease-in-out infinite;
    z-index: 10;
  }
  .lp-scroll-track {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, rgba(59,188,217,0.5), transparent);
  }
  @keyframes lp-float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(6px); }
  }

  /* ── Hero grid ── */
  .lp-hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(59,188,217,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,188,217,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at center, black 30%, transparent 100%);
  }

  /* ── Hero corner marks ── */
  .lp-corner {
    position: absolute; width: 22px; height: 22px;
    border-color: rgba(59,188,217,0.35); border-style: solid;
  }
  .lp-corner-tl { top: 20px; left: 20px; border-width: 1.5px 0 0 1.5px; }
  .lp-corner-tr { top: 20px; right: 20px; border-width: 1.5px 1.5px 0 0; }
  .lp-corner-bl { bottom: 20px; left: 20px; border-width: 0 0 1.5px 1.5px; }
  .lp-corner-br { bottom: 20px; right: 20px; border-width: 0 1.5px 1.5px 0; }

  /* ── Hero tagline ── */
  .lp-tagline {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(59,188,217,0.55);
    border: 1px solid rgba(59,188,217,0.15);
    padding: 0.35rem 0.85rem;
    border-radius: 4px;
    display: inline-block;
    background: rgba(59,188,217,0.04);
  }

  /* ── Brand title ── */
  .lp-brand {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: clamp(5rem, 14vw, 10rem);
    letter-spacing: -0.02em;
    line-height: 0.9;
    text-transform: uppercase;
    color: #D91828;
    text-shadow:
      0 0 80px rgba(217,24,40,0.3),
      4px 4px 0px rgba(0,0,0,0.4);
    margin: 0;
  }
  .lp-brand span { color: #3BBCD9; text-shadow: 0 0 80px rgba(59,188,217,0.3), 4px 4px 0px rgba(0,0,0,0.4); }

  .lp-brand-sub {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600; font-size: 1.05rem;
    letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(59,188,217,0.65);
    margin: 0;
  }

  /* ── Feature cards ── */
  .lp-feat-card {
    background: rgba(38,51,59,0.85);
    border-top: 3px solid #D91828;
    border-left: 1px solid rgba(255,255,255,0.06);
    border-right: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 2rem 1.75rem;
    position: relative; overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .lp-feat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(180deg, rgba(217,24,40,0.06) 0%, transparent 100%);
    pointer-events: none;
  }
  .lp-feat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(217,24,40,0.25);
  }
  .lp-feat-num {
    position: absolute; top: 1.25rem; right: 1.25rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.12em; color: rgba(59,188,217,0.25);
  }
  .lp-feat-icon-wrap {
    width: 48px; height: 48px;
    background: rgba(59,188,217,0.08);
    border: 1px solid rgba(59,188,217,0.15);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
  }
  .lp-feat-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.25rem;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: #3BBCD9; margin: 0 0 0.65rem 0;
  }
  .lp-feat-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; line-height: 1.65;
    color: rgba(255,255,255,0.45); font-weight: 300; margin: 0;
  }

  /* ── Section heading ── */
  .lp-section-h {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 0.9; margin: 0;
  }

  /* ── Stat block ── */
  .lp-stat {
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
  }
  .lp-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: clamp(3rem, 6vw, 5rem);
    letter-spacing: -0.03em; line-height: 1;
  }
  .lp-stat-unit {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin-top: 0.15rem;
  }

  /* ── Divider line ── */
  .lp-hline {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }
  .lp-vline {
    width: 1px; align-self: stretch;
    background: linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent);
  }

  /* ── Encryption badge ── */
  .lp-enc-badge {
    display: inline-flex; align-items: center; gap: 0.6rem;
    border: 1px solid rgba(217,145,13,0.3);
    background: rgba(217,145,13,0.07);
    padding: 0.5rem 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(217,145,13,0.7);
  }
  .lp-enc-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #D9910D;
    box-shadow: 0 0 6px #D9910D;
  }

  /* ── CTA buttons ── */
  .lp-btn-primary {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 1rem;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #fff;
    background: #D91828;
    border: none; cursor: pointer;
    padding: 1.1rem 2.75rem;
    position: relative; overflow: hidden;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background 0.22s, transform 0.18s, box-shadow 0.22s;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.4);
  }
  .lp-btn-primary:hover {
    background: #3BBCD9;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0,0,0,0.5);
  }
  .lp-btn-primary:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0 rgba(0,0,0,0.4); }

  .lp-btn-secondary {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 1rem;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #26333B;
    background: #3BBCD9;
    border: none; cursor: pointer;
    padding: 1.1rem 2.75rem;
    position: relative; overflow: hidden;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background 0.22s, transform 0.18s, box-shadow 0.22s;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.4);
  }
  .lp-btn-secondary:hover {
    background: #D91828;
    color: #fff;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0,0,0,0.5);
  }
  .lp-btn-secondary:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0 rgba(0,0,0,0.4); }

  /* ── Panel 3 background stripes ── */
  .lp-rust-stripes {
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
  }
  .lp-rust-stripes::before {
    content: '';
    position: absolute; inset: -50%;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 40px,
      rgba(0,0,0,0.06) 40px,
      rgba(0,0,0,0.06) 80px
    );
  }

  /* ── Panel 2 ── */
  .lp-stats-grid {
    display: flex; align-items: center; gap: 0;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(38,51,59,0.6);
    backdrop-filter: blur(8px);
  }
  .lp-stat-cell {
    flex: 1; padding: 2.5rem 2rem; text-align: center;
    position: relative;
  }
  .lp-stat-cell + .lp-stat-cell::before {
    content: '';
    position: absolute; top: 20%; left: 0;
    height: 60%; width: 1px;
    background: rgba(255,255,255,0.07);
  }

  /* ── Protocol list ── */
  .lp-protocol-row {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; color: rgba(255,255,255,0.4); letter-spacing: 0.06em;
  }
  .lp-protocol-row:last-child { border-bottom: none; }
  .lp-protocol-tag {
    font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    background: rgba(217,24,40,0.12);
    border: 1px solid rgba(217,24,40,0.2);
    color: #F87171;
    white-space: nowrap;
  }

  /* ── CTA card ── */
  .lp-cta-card {
    background: rgba(38,51,59,0.9);
    border: 1px solid rgba(255,255,255,0.07);
    border-bottom: 4px solid #D91828;
    padding: 3.5rem;
    position: relative; overflow: hidden;
    max-width: 640px; width: 100%;
  }
  .lp-cta-card::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(217,24,40,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .lp-cta-h {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: clamp(3.5rem, 7vw, 6rem);
    letter-spacing: -0.02em; text-transform: uppercase;
    line-height: 0.9; margin: 0 0 0.1em 0;
    color: #fff;
  }
  .lp-cta-h span { color: #D91828; }

  /* Scan line effect on hover for buttons */
  @keyframes lp-scan {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100%); }
  }
  .lp-btn-primary:hover::after,
  .lp-btn-secondary:hover::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
    animation: lp-scan 0.5s ease;
    pointer-events: none;
  }
`;

function injectLandingStyles() {
  if (document.getElementById('landing-page-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'landing-page-styles';
  tag.textContent = LANDING_CSS;
  document.head.appendChild(tag);
}

function Landing() {
  const navigate = useNavigate();
  const targetRef = useRef(null);

  if (typeof window !== 'undefined') injectLandingStyles();

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const shutterSpring = { mass: 1.5, stiffness: 100, damping: 14, restDelta: 0.001 };

  const rawY1 = useTransform(scrollYProgress, [0, 0.33], ["-100%", "0%"]);
  const rawY2 = useTransform(scrollYProgress, [0.33, 0.66], ["-100%", "0%"]);
  const rawY3 = useTransform(scrollYProgress, [0.66, 1],  ["-100%", "0%"]);

  const shutter1Y = useSpring(rawY1, shutterSpring);
  const shutter2Y = useSpring(rawY2, shutterSpring);
  const shutter3Y = useSpring(rawY3, shutterSpring);

  const features = [
    {
      icon: <Shield size={20} color="#3BBCD9" />,
      title: "Encrypted Node",
      text: "Data packets shredded immediately post-transmission. Zero persistence on network nodes.",
      num: "01",
    },
    {
      icon: <Printer size={20} color="#3BBCD9" />,
      title: "Physical Link",
      text: "Document released only via authenticated proximity token. No remote dispatch.",
      num: "02",
    },
    {
      icon: <Lock size={20} color="#3BBCD9" />,
      title: "Zero Cache",
      text: "No residual memory retained on hardware. Cold-wipe after every print cycle.",
      num: "03",
    },
  ];

  const protocols = [
    { tag: "ENC", text: "AES-256-GCM symmetric encryption at rest" },
    { tag: "TLS", text: "TLS 1.3 enforced on all transport layers" },
    { tag: "AUTH", text: "TOTP proximity token with 90-second TTL" },
    { tag: "PURGE", text: "Automatic data purge post-confirmation" },
  ];

  return (
    <div
      ref={targetRef}
      className="lp-root"
      style={{ position: 'relative', height: '400vh', background: '#26333B', overflow: 'visible', fontFamily: 'sans-serif' }}
    >
      {/* Grain overlay */}
      <div className="lp-grain" />

      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>

        {/* ═══════════════════════════════════════
            PANEL 0 — HERO
        ════════════════════════════════════════ */}
        <section
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '2rem',
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,188,217,0.06) 0%, transparent 60%), #26333B',
          }}
        >
          {/* Grid background */}
          <div className="lp-hero-grid" />

          {/* Corner marks */}
          <div className="lp-corner lp-corner-tl" />
          <div className="lp-corner lp-corner-tr" />
          <div className="lp-corner lp-corner-bl" />
          <div className="lp-corner lp-corner-br" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="lp-tagline">Privacy-Protected Printing System</span>
            </motion.div>

            {/* Brand */}
            <motion.h1
              className="lp-brand"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Privy<span>Print</span>
            </motion.h1>

            <motion.p
              className="lp-brand-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Secure · Encrypted · Ephemeral
            </motion.p>

            {/* Subtle CTA hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(59,188,217,0.35)', marginTop: '0.5rem',
              }}
            >
              <span>Scroll to explore</span>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <div className="lp-scroll-hint">
            <div className="lp-scroll-track" />
            <span>Scroll</span>
          </div>
        </section>


        {/* ═══════════════════════════════════════
            SHUTTER 1 — FEATURES (CYAN)
        ════════════════════════════════════════ */}
        <motion.section
          style={{
            y: shutter1Y,
            position: 'absolute', inset: 0, zIndex: 10,
            background: '#3BBCD9',
            display: 'flex', alignItems: 'center',
            padding: '3rem clamp(1.5rem, 6vw, 5rem)',
            borderBottom: '8px solid rgba(38,51,59,0.3)',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Subtle dot pattern */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(38,51,59,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(38,51,59,0.5)', marginBottom: '0.6rem',
                }}>
                  Core Architecture
                </div>
                <h2 className="lp-section-h" style={{ color: '#26333B', fontSize: 'clamp(3.5rem, 6vw, 6rem)' }}>
                  Hardened<br />Privacy.
                </h2>
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.68rem', lineHeight: 1.7,
                color: 'rgba(38,51,59,0.55)',
                maxWidth: '260px', textAlign: 'right',
              }}>
                Every print job is treated as a security event.<br />Nothing persists beyond the session.
              </div>
            </div>

            {/* Feature cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'rgba(38,51,59,0.15)' }}>
              {features.map((f, i) => (
                <div key={i} className="lp-feat-card">
                  <span className="lp-feat-num">{f.num}</span>
                  <div className="lp-feat-icon-wrap">{f.icon}</div>
                  <h3 className="lp-feat-title">{f.title}</h3>
                  <p className="lp-feat-text">{f.text}</p>
                </div>
              ))}
            </div>

          </div>
        </motion.section>


        {/* ═══════════════════════════════════════
            SHUTTER 2 — STATS + PROTOCOLS (DARK)
        ════════════════════════════════════════ */}
        <motion.section
          style={{
            y: shutter2Y,
            position: 'absolute', inset: 0, zIndex: 20,
            background: '#1A2229',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '3rem clamp(1.5rem, 6vw, 5rem)',
            borderBottom: '8px solid rgba(0,0,0,0.4)',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
            gap: '2.5rem',
          }}
        >
          {/* Top label */}
          <div style={{ textAlign: 'center' }}>
            <div className="lp-enc-badge">
              <span className="lp-enc-badge-dot" />
              Military-Grade Encryption Standard
            </div>
          </div>

          {/* Main heading */}
          <div style={{ textAlign: 'center', marginTop: '-2rem' }}>
            <h2 className="lp-section-h" style={{ color: '#D9910D', fontSize: 'clamp(4rem, 9vw, 4rem)' }}>
              Locked<br /><span style={{ color: '#D91828' }}>Pad.</span>
            </h2>
          </div>

          {/* Stats row */}
          <div className="lp-stats-grid" style={{ width: '100%', maxWidth: '680px' , height: '160px', marginBottom: '2.5rem', marginTop: '-2rem' }}>
            <div className="lp-stat-cell"
            >
              <div className="lp-stat-val" style={{ color: '#3BBCD9' }}>AES</div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.72rem', color: '#3BBCD9', letterSpacing: '0.1em',
              }}>256-Bit</div>
              <div className="lp-stat-unit">Encryption</div>
            </div>
            <div className="lp-stat-cell">
              <div className="lp-stat-val" style={{ color: '#D91828' }}>0</div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.72rem', color: '#F87171', letterSpacing: '0.1em',
              }}>Bytes</div>
              <div className="lp-stat-unit">Retained</div>
            </div>
            <div className="lp-stat-cell">
              <div className="lp-stat-val" style={{ color: '#D9910D' }}>90s</div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.72rem', color: '#FCD34D', letterSpacing: '0.1em',
              }}>Token TTL</div>
              <div className="lp-stat-unit">Expiry</div>
            </div>
          </div>

          {/* Protocol list */}
          <div style={{ width: '100%', maxWidth: '680px',height: 'auto', padding: '0 1rem', marginTop: '-4rem' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: '0.75rem', 
            }}>
              Active Protocols
            </div>
            {protocols.map((p, i) => (
              <div key={i} className="lp-protocol-row">
                <span className="lp-protocol-tag">{p.tag}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>

        </motion.section>


        {/* ═══════════════════════════════════════
            SHUTTER 3 — CTA (RUST)
        ════════════════════════════════════════ */}
        <motion.section
          style={{
            y: shutter3Y,
            position: 'absolute', inset: 0, zIndex: 30,
            background: '#0E1519',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '3rem 1.5rem',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
          }}
        >
          {/* Stripe texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: '-50%',
              background: `repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(217,24,40,0.025) 60px, rgba(217,24,40,0.025) 61px)`,
            }} />
          </div>

          {/* Large accent glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(217,24,40,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="lp-cta-card">

            {/* File icon badge */}
            <div style={{
              width: 52, height: 52,
              background: 'rgba(217,24,40,0.12)',
              border: '1px solid rgba(217,24,40,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.75rem',
            }}>
              <FileText size={24} color="#F87171" />
            </div>

            {/* Heading */}
            <h2 className="lp-cta-h">
              Initialize<br />
              <span>Privy</span> Print
            </h2>

            {/* Subtext */}
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.72rem', lineHeight: 1.75,
              color: 'rgba(255,255,255,0.3)',
              margin: '1.5rem 0 2.25rem 0',
              maxWidth: 400,
            }}>
              Upload your document, choose print parameters, and receive a one-time secure release token.
            </p>

            <div className="lp-hline" style={{ marginBottom: '2.25rem' }} />

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button className="lp-btn-primary" onClick={() => navigate('/signup')}>
                Start Printing
              </button>
              <button className="lp-btn-secondary" onClick={() => navigate('/admin/login')}>
                Admin Login
              </button>
            </div>

            {/* Mono note */}
            <div style={{
              marginTop: '2rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ color: 'rgba(52,211,153,0.5)' }}>●</span>
              No account required for guest print
            </div>
          </div>

        </motion.section>

      </div>

      {/* ── Floating status pill ── */}
      <div className="lp-status">
        <span className="lp-status-dot" />
        System Live
      </div>
    </div>
  );
}

export default Landing;