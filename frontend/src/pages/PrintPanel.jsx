import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export default function PrintPanel() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(120);
  const [isPrinting, setIsPrinting] = useState(false);
  const [status, setStatus] = useState('');
  const [printDone, setPrintDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [trustScore, setTrustScore] = useState(98);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintDone(false);
    let page = 1;
    const interval = setInterval(() => {
      setStatus(`Printing page ${page} of 3...`);
      page++;
      if (page > 4) {
        clearInterval(interval);
        setStatus('✅ Printed Successfully');
        setIsPrinting(false);
        setPrintDone(true);
      }
    }, 1000);
  };

  const triggerAlert = () => {
    setShowAlert(true);
    setTrustScore((prev) => Math.max(prev - 15, 0));
  };

  const timerPct = Math.round((timer / 120) * 100);
  const timerColor = timer > 60 ? '#43A047' : timer > 30 ? '#F59E0B' : '#E53935';

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      {/* Nav */}
      <div
        className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(21,101,192,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg,#1565C0,#0A192F)' }}
          >
            🖨️
          </div>
          <span className="font-black text-[#0A192F] text-lg">Secure Print Control</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Trust score bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Trust</span>
            <div className="w-28 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${trustScore}%`,
                  background:
                    trustScore > 70
                      ? 'linear-gradient(90deg,#43A047,#66BB6A)'
                      : 'linear-gradient(90deg,#E53935,#EF5350)',
                }}
              />
            </div>
            <span className="text-xs font-black text-[#0A192F]">{trustScore}%</span>
          </div>

          {/* Countdown */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base font-black"
            style={{
              background: 'linear-gradient(135deg, #0A192F, #1565C0)',
              color: timerColor,
              boxShadow: '0 4px 14px rgba(10,25,47,0.3)',
            }}
          >
            ⏱ &nbsp;00:{timer < 10 ? `0${timer}` : timer}
          </div>

          <Button variant="ghost" className="text-sm py-2 px-3" onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview + token input */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="overflow-hidden p-0">
              {/* Preview area */}
              <div
                className="aspect-video flex flex-col items-center justify-center relative"
                style={{
                  background: 'linear-gradient(145deg, #F8FAFC, #EEF2FF)',
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                {/* Watermark */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
                  {Array(20)
                    .fill('TOKEN-9921 · 2026-03-25 · SHOP-ID-01')
                    .map((t, i) => (
                      <div
                        key={i}
                        className="text-[10px] font-black text-[#0A192F] p-3 whitespace-nowrap"
                        style={{ transform: 'rotate(-15deg)' }}
                      >
                        {t}
                      </div>
                    ))}
                </div>

                <div className="z-10 flex flex-col items-center gap-3">
                  <div className="text-5xl opacity-30">📄</div>
                  <p className="text-sm font-bold text-gray-400">Document Preview Protected</p>
                  {status && (
                    <div
                      className="px-5 py-2.5 rounded-xl text-sm font-bold"
                      style={{
                        background: printDone
                          ? 'rgba(67,160,71,0.12)'
                          : 'rgba(21,101,192,0.1)',
                        color: printDone ? '#43A047' : '#1565C0',
                        animation: isPrinting ? 'pulse 1.4s ease infinite' : 'none',
                      }}
                    >
                      {status}
                    </div>
                  )}
                </div>
              </div>

              {/* Token input */}
              <div className="p-5 flex gap-3">
                <Input placeholder="Enter token to load document..." />
                <Button className="whitespace-nowrap">Load Doc</Button>
              </div>
            </Card>
          </div>

          {/* Right: Camera + controls */}
          <div className="space-y-5">
            {/* Camera */}
            <Card className="p-0 overflow-hidden">
              <div
                className="px-5 py-3 flex items-center gap-2 border-b border-gray-50"
                style={{ borderLeft: '4px solid #43A047' }}
              >
                <div className="w-2 h-2 bg-[#43A047] rounded-full" style={{ boxShadow: '0 0 6px #43A047' }} />
                <span className="text-xs font-black text-[#43A047] uppercase tracking-wider">
                  Live Monitoring
                </span>
              </div>
              <div className="bg-[#0A192F] aspect-video flex items-center justify-center relative">
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-white/20 text-xs font-mono">Camera Stream Active</span>
              </div>
            </Card>

            {/* Actions */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2 text-[#1565C0]">
                <span className="text-lg">🔐</span>
                <span className="font-bold text-sm">Secure Viewing Enabled</span>
              </div>

              <div
                className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
                style={{ background: 'rgba(21,101,192,0.07)', color: '#1565C0' }}
              >
                📄 &nbsp;3 pages · B/W · 1 copy
              </div>

              <Button
                className="w-full py-3.5"
                onClick={handlePrint}
                disabled={isPrinting}
              >
                {isPrinting ? '⏳  Printing...' : '🖨️  Print Now'}
              </Button>

              <Button
                variant="danger"
                className="w-full py-3"
                onClick={triggerAlert}
              >
                ⚠️ &nbsp; Simulate Suspicious Activity
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Alert modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl max-w-md w-full text-center p-10 animate-fade-in-up"
            style={{
              borderTop: '6px solid #E53935',
              boxShadow: '0 30px 80px rgba(229,57,53,0.3)',
            }}
          >
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-[#E53935] mb-2">Security Alert</h2>
            <p className="text-gray-500 text-sm mb-6">
              Suspicious activity detected! Print session flagged and trust score reduced.
            </p>
            <Button variant="danger" onClick={() => setShowAlert(false)}>
              Acknowledge &amp; Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}