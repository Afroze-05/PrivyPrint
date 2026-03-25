import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base =
    'relative inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 active:scale-95 cursor-pointer border-0 overflow-hidden';

  const variants = {
    primary: `
      bg-gradient-to-br from-[#1565C0] to-[#0D47A1]
      text-white
      shadow-[0_4px_15px_rgba(21,101,192,0.4)]
      hover:shadow-[0_8px_25px_rgba(21,101,192,0.55)]
      hover:-translate-y-0.5
    `,
    secondary: `
      bg-white border-2 border-[#1565C0] text-[#1565C0]
      shadow-[0_2px_10px_rgba(21,101,192,0.1)]
      hover:bg-[#EBF3FD] hover:shadow-[0_4px_15px_rgba(21,101,192,0.2)]
      hover:-translate-y-0.5
    `,
    danger: `
      bg-gradient-to-br from-[#E53935] to-[#B71C1C]
      text-white
      shadow-[0_4px_15px_rgba(229,57,53,0.4)]
      hover:shadow-[0_8px_25px_rgba(229,57,53,0.55)]
      hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent text-[#1565C0]
      hover:bg-[#EBF3FD]
    `,
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-3xl border border-gray-100 transition-all duration-300
      shadow-[0_4px_6px_-1px_rgba(21,101,192,0.08),0_10px_30px_-5px_rgba(10,25,47,0.12)]
      hover:shadow-[0_8px_25px_-5px_rgba(21,101,192,0.18),0_20px_60px_-10px_rgba(10,25,47,0.16)]
      p-8 ${className}`}
  >
    {children}
  </div>
);

export const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-xs font-bold text-[#0A192F] uppercase tracking-widest">
        {label}
      </label>
    )}
    <input
      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200
        bg-white text-[#0A192F] placeholder-gray-400
        focus:border-[#1565C0] focus:ring-4 focus:ring-[#1565C0]/10
        outline-none transition-all duration-200 text-sm font-medium"
      {...props}
    />
  </div>
);

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-50 text-[#1565C0] border-blue-100',
    success: 'bg-green-50 text-[#43A047] border-green-100',
    danger: 'bg-red-50 text-[#E53935] border-red-100',
    warning: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export const StatCard = ({ label, value, icon, trend }) => (
  <Card className="p-6 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      {icon && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center text-white text-lg shadow-md">
          {icon}
        </div>
      )}
    </div>
    <p className="text-3xl font-black text-[#0A192F]">{value}</p>
    {trend && <p className="text-xs text-[#43A047] font-semibold">{trend}</p>}
  </Card>
);