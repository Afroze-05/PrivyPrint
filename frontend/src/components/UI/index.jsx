import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Premium Button Component
export const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'premium-btn font-semibold transition-all duration-300';
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-5 text-xl'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF6A00] to-[#FF8C42] text-white hover:shadow-lg hover:shadow-[#FF6A00]/25',
    secondary: 'glass-card border border-[#FF6A00]/30 text-[#FF6A00] hover:bg-[#FF6A00]/10',
    outline: 'border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white',
    ghost: 'text-[#FF6A00] hover:bg-[#FF6A00]/10'
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </motion.button>
  );
};

// Premium Input Component
export const PremiumInput = ({ 
  label, 
  error, 
  icon, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6A00]/60">
            {icon}
          </div>
        )}
        <input
          className={`premium-input w-full ${icon ? 'pl-10' : ''} ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm animate-fade-in-up">{error}</p>
      )}
    </div>
  );
};

// Premium Card Component
export const PremiumCard = ({ 
  children, 
  hover = true, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`glass-card p-6 ${hover ? 'hover:shadow-2xl hover:shadow-[#FF6A00]/10' : ''} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Premium Modal Component
export const PremiumModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className={`relative glass-card w-full ${sizeClasses[size]} ${className}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Loading Skeleton Component
export const Skeleton = ({ 
  lines = 3, 
  className = '',
  height = 'h-4' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${height} rounded-md`}
          style={{
            width: i === lines - 1 ? '60%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

// Premium Badge Component
export const PremiumBadge = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-[#FF6A00]/20 text-[#FF6A00] border-[#FF6A00]/30',
    secondary: 'bg-white/10 text-white/80 border-white/20',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// Premium Alert Component
export const PremiumAlert = ({ 
  children, 
  variant = 'info',
  className = ''
}) => {
  const variantClasses = {
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400'
  };

  return (
    <div className={`glass-card border p-4 rounded-xl ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Premium Progress Bar
export const PremiumProgress = ({ 
  value = 0, 
  max = 100,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FF8C42] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

// Premium Tooltip Component
export const PremiumTooltip = ({ 
  children, 
  content,
  position = 'top'
}) => {
  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${position}-0 left-1/2 transform -translate-x-1/2 ${position === 'top' ? '-translate-y-full mb-2' : 'mt-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50`}>
        <div className="glass-card px-3 py-2 text-sm text-white whitespace-nowrap rounded-lg">
          {content}
          <div className={`absolute ${position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2'} w-2 h-2 bg-inherit rotate-45`}></div>
        </div>
      </div>
    </div>
  );
};
