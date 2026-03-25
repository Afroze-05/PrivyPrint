import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #F5F5DC 0%, #EEF5FF 100%)' }}
    >
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Icon */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #1565C0, #0A192F)',
              boxShadow: '0 10px 30px rgba(21,101,192,0.4)',
            }}
          >
            🛡️
          </div>
          <h1 className="text-2xl font-black text-[#0A192F]">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Secure access for authorized personnel</p>
        </div>

        <Card>
          {/* Tab switcher */}
          <div
            className="flex gap-1 mb-8 p-1 rounded-2xl"
            style={{ background: '#F3F4F6' }}
          >
            {['Login', 'Register'].map((tab, i) => {
              const active = i === 0 ? !isRegister : isRegister;
              return (
                <button
                  key={tab}
                  onClick={() => setIsRegister(i === 1)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, #1565C0, #0D47A1)'
                      : 'transparent',
                    color: active ? '#fff' : '#9CA3AF',
                    boxShadow: active ? '0 4px 12px rgba(21,101,192,0.3)' : 'none',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <h2 className="text-xl font-black text-[#0A192F] mb-6">
            {isRegister ? '✨ Create Admin Account' : '🔑 Secure Login'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <Input label="Full Name" placeholder="John Doe" />
            )}
            <Input label="Email Address" type="email" placeholder="admin@privyprint.com" />
            <Input label="Password" type="password" placeholder="••••••••" />

            <Button type="submit" className="w-full py-4 text-base mt-2">
              {isRegister ? '🚀  Create Account' : '🔐  Sign In Securely'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
          Protected by PrivyPrint Security Framework
        </p>
      </div>
    </div>
  );
}