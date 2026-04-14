import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Shield, X } from "lucide-react";
import { motion } from "framer-motion";

/**
 * SecurityOverlay Component
 * Detects unauthorized actions (PrintScreen, Copy, Paste, Right-click, Tab switch)
 * and displays a clean white + red security warning overlay.
 */
const SecurityOverlay = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef(null);
  const visibilityTimerRef = useRef(null);
  const countdownRef = useRef(null);

  const triggerAlert = () => {
    setIsActive(true);
    setCountdown(5);
    
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Start countdown
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto-dismiss after 5 seconds and navigate back to dashboard
    timerRef.current = setTimeout(() => {
      setIsActive(false);
      window.location.href = "/admin/dashboard";
    }, 5000);
  };

  const handleGoBack = () => {
    setIsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    window.location.href = "/admin/dashboard";
  };

  const handleRetry = () => {
    setIsActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Print Screen key (PrtSc)
      if (e.key === "PrintScreen") {
        e.preventDefault();
        triggerAlert();
      }
      
      // Ctrl+C (Copy), Ctrl+V (Paste), Ctrl+X (Cut)
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "x")) {
        e.preventDefault();
        triggerAlert();
      }
    };

    const handleCopy = (e) => {
      e.preventDefault();
      triggerAlert();
    };

    const handlePaste = (e) => {
      e.preventDefault();
      triggerAlert();
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerAlert();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left tab - trigger alert after 2 seconds if still hidden
        visibilityTimerRef.current = setTimeout(() => {
          if (document.hidden) {
            triggerAlert();
          }
        }, 2000);
      } else {
        // User returned - clear 2s timer
        if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current);
        }
      }
    };

    const handleBlur = () => {
        // Detect Alt+Tab (window loses focus)
        triggerAlert();
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("paste", handlePaste);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a0000ff", // PURE WHITE background
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#f54646ff", // RED ONLY text
        textAlign: "center",
        padding: "20px",
        userSelect: "none",
        pointerEvents: "all",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Alert Icon with Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1], 
          opacity: 1 
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.5 }
        }}
        style={{ marginBottom: "32px" }}
      >
        <AlertTriangle 
          size={64} 
          style={{ 
            color: "#dc2626",
            filter: "drop-shadow(0 4px 8px rgba(220, 38, 38, 0.2))"
          }} 
        />
      </motion.div>

      {/* Main Alert Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontSize: "3rem",
          fontWeight: 900,
          margin: "0 0 16px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontFamily: '"Orbitron", "Rajdhani", "Space Grotesk", sans-serif',
          color: "#dc2626"
        }}
      >
        SECURITY ALERT
      </motion.h1>

      {/* Alert Message */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          maxWidth: "600px",
          marginBottom: "32px",
          letterSpacing: "0.02em",
          fontFamily: '"Inter", sans-serif',
          color: "#dc2626"
        }}
      >
        Unauthorized Action Detected
      </motion.p>

      {/* Alert Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          backgroundColor: "#ffffff",
          border: "2px solid #dc2626",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 8px 32px rgba(220, 38, 38, 0.1)",
          marginBottom: "32px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <Shield size={24} style={{ color: "#dc2626", marginRight: "12px" }} />
          <span 
            style={{ 
              fontSize: "1.1rem", 
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              color: "#dc2626"
            }}
          >
            Security Violation
          </span>
        </div>
        
        <p style={{
          fontSize: "1rem",
          fontWeight: 500,
          lineHeight: 1.6,
          margin: 0,
          fontFamily: '"Inter", sans-serif',
          color: "#dc2626"
        }}>
          This activity has been flagged as suspicious. For security reasons, printing has been blocked.
        </p>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: "32px",
          fontFamily: '"Inter", sans-serif',
          color: "#dc2626"
        }}
      >
        Returning to safe screen in {countdown} second{countdown !== 1 ? 's' : ''}...
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ display: "flex", gap: "16px" }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          style={{
            padding: "12px 24px",
            border: "2px solid #dc2626",
            backgroundColor: "transparent",
            color: "#dc2626",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: '"Inter", sans-serif',
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc2626";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#dc2626";
          }}
        >
          Go Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetry}
          style={{
            padding: "12px 24px",
            border: "2px solid #dc2626",
            backgroundColor: "transparent",
            color: "#dc2626",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: '"Inter", sans-serif',
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc2626";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#dc2626";
          }}
        >
          Retry
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SecurityOverlay;
