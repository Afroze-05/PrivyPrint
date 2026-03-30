import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * SecurityOverlay Component
 * Detects unauthorized actions (PrintScreen, Copy, Paste, Right-click, Tab switch)
 * and displays a full-screen red warning overlay.
 */
const SecurityOverlay = () => {
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);
  const visibilityTimerRef = useRef(null);

  const triggerAlert = () => {
    setIsActive(true);
    
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Auto-dismiss after 4 seconds and navigate back to dashboard
    timerRef.current = setTimeout(() => {
      setIsActive(false);
      window.location.href = "/admin/dashboard";
    }, 4000);
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
        // User left the tab - trigger alert after 2 seconds if still hidden
        visibilityTimerRef.current = setTimeout(() => {
          if (document.hidden) {
            triggerAlert();
          }
        }, 2000);
      } else {
        // User returned - clear the 2s timer
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
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ef4444", // Red background
        zIndex: 10000, // Above everything
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
        userSelect: "none",
        pointerEvents: "all",
      }}
    >
      <AlertTriangle size={80} style={{ marginBottom: 20 }} />
      <h1 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0 0 16px" }}>
        SECURITY ALERT
      </h1>
      <p style={{ fontSize: "1.25rem", fontWeight: "600", maxWidth: "600px", opacity: 0.9 }}>
      "⚠️ Security Alert: Unauthorized action detected" 
    </p>
    <div style={{ marginTop: 40, fontSize: "1.1rem", opacity: 0.9, fontWeight: 700 }}>
      Returning to dashboard in a few seconds...
    </div>
  </div>
);
};

export default SecurityOverlay;
