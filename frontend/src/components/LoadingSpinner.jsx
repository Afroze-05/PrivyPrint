import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

/* ── Premium Loading Spinner Component ── */
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-4 border-white/20 border-t-white rounded-full`}
      />
      
      {/* Loading Text */}
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="body text-white/60"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

/* ── Skeleton Loading Component ── */
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="loading-skeleton h-4 w-full"
        />
      ))}
    </div>
  );
};

/* ── Pulse Loading Component ── */
export const PulseLoader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
      />
    </div>
  );
};

/* ── Progress Loading Component ── */
export const ProgressLoader = ({ progress = 0, showPercentage = true }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="body text-white/60">Processing...</span>
        {showPercentage && (
          <span className="body text-white font-medium">{Math.round(progress)}%</span>
        )}
      </div>
      
      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>
    </div>
  );
};

/* ── Dots Loading Component ── */
export const DotsLoader = ({ size = 'medium' }) => {
  const dotSizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  const dotClass = dotSizeClasses[size];

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
          className={`${dotClass} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
        />
      ))}
    </div>
  );
};

/* ── Glass Card Loading Component ── */
export const GlassCardLoader = ({ title = 'Loading', subtitle = 'Please wait...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card max-w-sm mx-auto"
    >
      <div className="flex flex-col items-center gap-4 py-8">
        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
        />
        
        {/* Text Content */}
        <div className="text-center">
          <h3 className="h4 text-white mb-2">{title}</h3>
          <p className="body text-white/60">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
