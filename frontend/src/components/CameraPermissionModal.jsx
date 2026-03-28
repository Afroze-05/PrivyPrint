import React, { useState, useEffect } from "react";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

/**
 * CameraPermissionModal Component
 * A mandatory modal that requests camera access.
 * It blocks the page until permission is granted or handled.
 */
const CameraPermissionModal = ({ onPermissionGranted }) => {
  const [status, setStatus] = useState("pending"); // pending | granted | denied | error
  const [errorMessage, setErrorMessage] = useState("");

  const requestCamera = async () => {
    setStatus("pending");
    setErrorMessage("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      // Permission granted
      setStatus("granted");
      onPermissionGranted(stream);
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStatus("denied");
        setErrorMessage("Camera access is required to continue.");
      } else {
        setStatus("error");
        setErrorMessage(err.message || "Could not access camera. Please check your connection.");
      }
    }
  };

  useEffect(() => {
    requestCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "granted") return null;

  return (
    <div className="sp-popup" style={{ zIndex: 9999 }}>
      <div className="sp-popup-inner" style={{ textAlign: "center", maxWidth: "420px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            background: status === "denied" || status === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(31, 111, 235, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          {status === "denied" || status === "error" ? (
            <CameraOff size={32} color="#ef4444" />
          ) : (
            <Camera size={32} color="var(--sp-blue)" />
          )}
        </div>

        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Camera Access Required</h3>
        <p style={{ color: "var(--sp-muted)", marginBottom: 24, fontSize: "0.95rem", lineHeight: 1.5 }}>
          {status === "pending"
            ? "We need camera access to ensure a secure printing environment. Please allow camera permissions in your browser."
            : errorMessage}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(status === "denied" || status === "error") && (
            <button className="sp-btn sp-btn-primary" onClick={requestCamera} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <RefreshCw size={18} />
              Retry Permission
            </button>
          )}
          
          {status === "pending" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--sp-blue)", fontWeight: 600 }}>
              <div className="animate-spin" style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%" }}></div>
              Waiting for permission...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPermissionModal;
