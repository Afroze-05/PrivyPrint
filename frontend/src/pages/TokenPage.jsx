import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/UI';

export default function TokenPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('activeToken') || 'SPX-0000';
  const type = localStorage.getItem('printType') || 'B/W';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-center"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
          style={{
            background: 'linear-gradient(135deg, #43A047, #2E7D32)',
            boxShadow: '0 12px 40px rgba(67,160,71,0.4)',
            animation: 'pulse-ring 2s infinite',
          }}
        >
          ✓
        </div>

        <h1 className="text-2xl font-black text-[#0A192F] mb-1">Document Uploaded!</h1>
        <p className="text-gray-500 text-sm mb-8">Your secure printing session is ready.</p>

        <Card className="overflow-hidden relative p-0">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1565C0] to-[#43A047]" />

          <div className="p-8 space-y-6">
            {/* Token display */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(145deg, #0A192F, #1565C0)',
                boxShadow: '0 8px 30px rgba(10,25,47,0.35)',
              }}
            >
              <p className="text-xs font-black text-blue-300 uppercase tracking-[0.2em] mb-3">
                🔑 Secure Access Token
              </p>
              <h2
                className="text-5xl font-black tracking-widest text-white mb-4"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
              >
                {token}
              </h2>
              <div className="flex justify-center gap-2">
                <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                  Mode: {type}
                </span>
                <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                  ⏳ Waiting
                </span>
              </div>
            </div>

            {/* QR placeholder */}
            <div className="flex flex-col items-center opacity-50">
              <div
                className="w-28 h-28 rounded-xl p-2"
                style={{ border: '3px solid #0A192F' }}
              >
                <div className="w-full h-full grid grid-cols-5 gap-0.5">
                  {Array(25)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="rounded-sm"
                        style={{
                          background:
                            Math.random() > 0.45 ? '#0A192F' : 'transparent',
                        }}
                      />
                    ))}
                </div>
              </div>
              <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-[#0A192F]">
                Scan at Kiosk
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full py-3.5" onClick={() => window.print()}>
                📥 &nbsp; Download Slip
              </Button>
              <Button variant="secondary" className="w-full py-3.5" onClick={() => navigate('/')}>
                ✅ &nbsp; Done
              </Button>
            </div>

            {/* Warning */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-[#E53935]"
              style={{ background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.15)' }}
            >
              ⚠️ Token expires in{' '}
              <span className="font-black">10 minutes</span>. Do not share this code.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
