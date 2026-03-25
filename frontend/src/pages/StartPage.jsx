import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #F5F5DC 0%, #EEF2FF 60%, #DBEAFE 100%)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-100px] right-[-120px] w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1565C0, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-80px] left-[-100px] w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0A192F, transparent 70%)' }}
      />

      {/* Floating grid dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#1565C0 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in-up max-w-md w-full">
        {/* Logo icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 animate-float"
          style={{
            background: 'linear-gradient(135deg, #1565C0 0%, #0A192F 100%)',
            boxShadow: '0 20px 60px rgba(21,101,192,0.45)',
          }}
        >
          🔐
        </div>

        <h1
          className="font-black mb-2 leading-none tracking-tight"
          style={{
            fontSize: '4rem',
            background: 'linear-gradient(135deg, #0A192F 0%, #1565C0 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          PrivyPrint
        </h1>

        <p className="text-base text-gray-500 font-medium mb-2 tracking-wide">
          Privacy-Protected Printing System
        </p>

        {/* Pills row */}
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {['🔒 Encrypted', '🗑️ Auto-Delete', '🛡️ Watermarked'].map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full font-semibold text-[#1565C0] border border-blue-200"
              style={{ background: 'rgba(21,101,192,0.07)' }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => navigate('/upload')}
            className="w-full py-4 text-base"
          >
            🚀 &nbsp; Get Started
          </Button>
          <Button
            variant="secondary"
            className="w-full py-4 text-base"
            onClick={() => navigate('/admin-login')}
          >
            🔑 &nbsp; Admin Login
          </Button>
        </div>

        <p className="mt-8 text-xs text-gray-400 font-medium">
          Your document is deleted immediately after printing.
        </p>
      </div>
    </div>
  );
}