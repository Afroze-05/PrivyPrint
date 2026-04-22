import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { Smartphone, Shield, AlertTriangle } from "lucide-react";

// Security Alert Component
const SecurityAlert = ({ isActive, message, countdown, onGoBack, onRetry }) => {
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
        backgroundColor: "black", // PURE WHITE background
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#dc2626", // RED ONLY text
        textAlign: "center",
        padding: "20px",
        userSelect: "none",
        pointerEvents: "all",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Phone Icon with Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: 1,
          rotate: [0, 2, -2, 0], // Subtle shake on load
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5, ease: "easeOut" },
          opacity: { duration: 0.5 },
        }}
        style={{ marginBottom: "32px" }}
      >
        <Smartphone
          size={64}
          style={{
            color: "#dc2626",
            filter: "drop-shadow(0 4px 8px rgba(220, 38, 38, 0.2))",
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
          color: "#dc2626",
        }}
      >
        PHONE DETECTED
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
          color: "#dc2626",
        }}
      >
        Mobile Camera Detected
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
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <AlertTriangle
            size={24}
            style={{ color: "#dc2626", marginRight: "12px" }}
          />
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              color: "#dc2626",
            }}
          >
            Security Violation
          </span>
        </div>

        <p
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: '"Inter", sans-serif',
            color: "#dc2626",
          }}
        >
          {message}
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
          color: "#dc2626",
        }}
      >
        Returning to safe screen in {countdown} second
        {countdown !== 1 ? "s" : ""}...
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
          onClick={onGoBack}
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
            transition: "all 0.3s ease",
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
          onClick={onRetry}
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
            transition: "all 0.3s ease",
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

export default function PhoneDetection({ existingVideoRef }) {
  const modelRef = useRef(null);
  const animationIdRef = useRef(null);
  const fallbackVideoRef = useRef(null);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const lastAlertTimeRef = useRef(0);
  const countdownRef = useRef(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready(); //tf is used to run the cocossd ai model directly in the browser (it is like the engine to the model )
        const model = await cocoSsd.load(); //model is trained to detect phone and camera among other objects, we will use it to detect if user has phone or camera during printing session.
        modelRef.current = model;
        setIsModelLoaded(true);
        console.log("Phone detection model loaded successfully");
      } catch (error) {
        console.error("Failed to load phone detection model:", error);
      }
    };

    loadModel();
    // Cleanup on unmount
    // We cancel any ongoing animation frames to prevent memory leaks and unnecessary processing after the component is unmounted.
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Check for existing camera stream
  useEffect(() => {
    if (!isModelLoaded) return;

    let retryCount = 0;
    const maxRetries = 10;

    // Check if existing video has stream
    const checkCameraStream = () => {
      console.log("Checking camera stream...", {
        hasVideoRef: !!existingVideoRef?.current,
        hasVideo: !!existingVideoRef?.current,
        hasSrcObject: !!existingVideoRef?.current?.srcObject,
        isActive: !!existingVideoRef?.current?.srcObject?.active,
        videoReady: existingVideoRef?.current?.readyState,
        retryCount,
      });

      const video = existingVideoRef.current;
      if (
        video &&
        video.srcObject && // Checks whether the camera stream is available on the video element? This checks if the video element has a srcObject, which is where the camera stream would be attached. If this is null or undefined, it means we don't have access to the camera stream through this video element.
        video.srcObject.active &&
        video.readyState >= 2
      ) {
        setIsCameraActive(true);
        console.log(" Using existing camera stream for phone detection");
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkCameraStream, 1000);
      } else {
        // Fallback: create own camera stream
        console.log(" Using fallback camera for phone detection");
        createFallbackCamera();
      }
    };

    const createFallbackCamera = async () => {
      try {
        //Camera ON karna manually
        // if camera is not available then we manually create it
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (fallbackVideoRef.current) {
          fallbackVideoRef.current.srcObject = stream;
          setUseFallback(true);
          setIsCameraActive(true);
          console.log("Fallback camera activated for phone detection");
        }
      } catch (error) {
        console.error("Failed to create fallback camera:", error);
      }
    };

    // Initial check
    checkCameraStream();
  }, [isModelLoaded, existingVideoRef]);

  // Run phone detection
  useEffect(() => {
    if (!isCameraActive || !modelRef.current) return;

    let frameCount = 0;
    const detectPhone = async () => {
      let video;

      // Use existing video if available, otherwise use fallback
      if (!useFallback && existingVideoRef?.current) {
        video = existingVideoRef.current;
      } else if (useFallback && fallbackVideoRef.current) {
        video = fallbackVideoRef.current;
      } else {
        return;
      }

      if (!modelRef.current || !video) return;

      try {
        // Run detection every frame for better responsiveness (removed frame skipping)
        frameCount++;

        // Log video status every 60 frames (once per second approx)
        if (frameCount % 60 === 0) {
          console.log("Video status:", {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            srcObjectActive: video.srcObject?.active,
            currentTime: video.currentTime,
          });
        }

        const predictions = await modelRef.current.detect(video);
        console.log("Detection predictions:", predictions); // Debug log

        // Check for phone or camera detection with balanced confidence threshold
        // Also check for smaller bounding boxes to detect partial phones
        const forbiddenObjects = predictions.find(
          (prediction) =>
            (prediction.class === "cell phone" ||
              prediction.class === "camera") &&
            prediction.score > 0.5, // Set back to 0.5 for balanced detection
        );

        console.log(
          "All predictions:",
          predictions.map((p) => ({
            class: p.class,
            confidence: (p.score * 100).toFixed(1) + "%",
            size: `${Math.round(p.bbox[2])}x${Math.round(p.bbox[3])}px`,
          })),
        );

        if (forbiddenObjects && !phoneDetected) {
          const objectType =
            forbiddenObjects.class === "cell phone" ? "Mobile Phone" : "Camera";
          const confidence = (forbiddenObjects.score * 100).toFixed(1);
          const bbox = forbiddenObjects.bbox;
          const width = Math.round(bbox[2]);
          const height = Math.round(bbox[3]);

          console.log(`${objectType} DETECTED:`, forbiddenObjects);
          console.log(`Detection details:`, {
            class: forbiddenObjects.class,
            confidence: confidence + "%",
            bbox: bbox,
            size: `${width}x${height}px`,
            position: `(${Math.round(bbox[0])}, ${Math.round(bbox[1])})`,
          });

          // Additional check: ensure it's a reasonable size for a phone (not too small, not too large)
          const minSize = 30; // Minimum 30px for partial phone
          const maxSize = 500; // Maximum 500px (for close phones)

          if (
            (width >= minSize || height >= minSize) &&
            width <= maxSize &&
            height <= maxSize
          ) {
            setPhoneDetected(true);
            await triggerSecurityAlert(objectType);

            // Prevent alert spam (wait 30 seconds before next alert)
            lastAlertTimeRef.current = Date.now();
            setTimeout(() => {
              setPhoneDetected(false);
            }, 30000);
          } else {
            console.log(
              `Ignoring detection - size ${width}x${height}px outside phone range`,
            );
          }
        } else {
          // Log why no detection happened
          const phonePredictions = predictions.filter(
            (p) => p.class === "cell phone" || p.class === "camera",
          );
          if (phonePredictions.length > 0) {
            console.log(
              "Phone/camera found but confidence too low:",
              phonePredictions.map((p) => ({
                class: p.class,
                confidence: (p.score * 100).toFixed(1) + "%",
                threshold: "50.0%",
              })),
            );
          }
        }
      } catch (error) {
        console.error("Detection error:", error);
      }

      animationIdRef.current = requestAnimationFrame(detectPhone);
    };

    // Start detection loop
    animationIdRef.current = requestAnimationFrame(detectPhone);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isCameraActive, phoneDetected, existingVideoRef, useFallback]);

  // Trigger security alert
  const triggerSecurityAlert = async (objectType) => {
    const message = `Unauthorized ${objectType} detected during printing session`;

    try {
      // Send alert to backend
      await api.post("/alert", {
        type: "PHONE_DETECTED",
        message: message,
      });

      console.warn(` ${objectType} DETECTION ALERT: ${message}`);
    } catch (error) {
      // Fallback to console if backend fails
      console.error("Failed to send phone detection alert:", error);
      console.warn(` ${objectType} DETECTION ALERT: ${message}`);
    }

    // Show security alert overlay
    setAlertMessage(message);
    setShowSecurityAlert(true);
    setCountdown(5);

    // Start countdown
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-dismiss after 5 seconds and navigate back to dashboard
    setTimeout(() => {
      setShowSecurityAlert(false);
      window.location.href = "/admin/dashboard";
    }, 5000);
  };

  const handleGoBack = () => {
    setShowSecurityAlert(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    window.location.href = "/admin/dashboard";
  };

  const handleRetry = () => {
    setShowSecurityAlert(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  return (
    <>
      {/* Security Alert Overlay */}
      <SecurityAlert
        isActive={showSecurityAlert}
        message={alertMessage}
        countdown={countdown}
        onGoBack={handleGoBack}
        onRetry={handleRetry}
      />

      {/* Hidden container for detection */}
      <div style={{ display: "none" }}>
        {/* Fallback video element for camera feed */}
        {useFallback && (
          <video
            ref={fallbackVideoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
            style={{ display: "none" }}
          />
        )}

        {/* Debug info (remove in production) */}
        {import.meta.env.DEV && (
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "12px",
              zIndex: 9999,
            }}
          >
            <div>Model: {isModelLoaded ? "✅" : "⏳"}</div>
            <div>Camera: {isCameraActive ? "✅" : "⏳"}</div>
            <div>Fallback: {useFallback ? "🔄" : "📹"}</div>
            <div>
              Phone/Camera: {phoneDetected ? "🚨 DETECTED" : "✅ Clear"}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
