import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { api } from '../../services/api';

// Security Alert Component
const SecurityAlert = ({ isActive, message }) => {
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
      <div style={{ 
        fontSize: "80px", 
        marginBottom: "20px",
        animation: "pulse 1s infinite"
      }}>
        📱
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0 0 16px" }}>
        PHONE DETECTED
      </h1>
      <p style={{ fontSize: "1.25rem", fontWeight: "600", maxWidth: "600px", opacity: 0.9 }}>
        {message}
      </p>
      <div style={{ marginTop: 40, fontSize: "1.1rem", opacity: 0.9, fontWeight: 700 }}>
        Returning to dashboard in a few seconds...
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
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
  const [alertMessage, setAlertMessage] = useState('');
  const lastAlertTimeRef = useRef(0);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = await cocoSsd.load();
        modelRef.current = model;
        setIsModelLoaded(true);
        console.log('Phone detection model loaded successfully');
      } catch (error) {
        console.error('Failed to load phone detection model:', error);
      }
    };

    loadModel();

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
      console.log('Checking camera stream...', {
        hasVideoRef: !!existingVideoRef?.current,
        hasVideo: !!existingVideoRef?.current,
        hasSrcObject: !!existingVideoRef?.current?.srcObject,
        isActive: !!existingVideoRef?.current?.srcObject?.active,
        videoReady: existingVideoRef?.current?.readyState,
        retryCount
      });

      const video = existingVideoRef.current;
      if (video && video.srcObject && video.srcObject.active && video.readyState >= 2) {
        setIsCameraActive(true);
        console.log('✅ Using existing camera stream for phone detection');
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkCameraStream, 1000);
      } else {
        // Fallback: create own camera stream
        console.log('⚠️ Using fallback camera for phone detection');
        createFallbackCamera();
      }
    };

    const createFallbackCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (fallbackVideoRef.current) {
          fallbackVideoRef.current.srcObject = stream;
          setUseFallback(true);
          setIsCameraActive(true);
          console.log('✅ Fallback camera activated for phone detection');
        }
      } catch (error) {
        console.error('Failed to create fallback camera:', error);
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
          console.log('Video status:', {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            srcObjectActive: video.srcObject?.active,
            currentTime: video.currentTime
          });
        }

        const predictions = await modelRef.current.detect(video);
        console.log('Detection predictions:', predictions); // Debug log
        
        // Check for phone or camera detection with balanced confidence threshold
        // Also check for smaller bounding boxes to detect partial phones
        const forbiddenObjects = predictions.find(
          prediction => 
            (prediction.class === 'cell phone' || prediction.class === 'camera') && 
            prediction.score > 0.5 // Set back to 0.5 for balanced detection
        );

        console.log('All predictions:', predictions.map(p => ({
          class: p.class,
          confidence: (p.score * 100).toFixed(1) + '%',
          size: `${Math.round(p.bbox[2])}x${Math.round(p.bbox[3])}px`
        })));

        if (forbiddenObjects && !phoneDetected) {
          const objectType = forbiddenObjects.class === 'cell phone' ? 'Mobile Phone' : 'Camera';
          const confidence = (forbiddenObjects.score * 100).toFixed(1);
          const bbox = forbiddenObjects.bbox;
          const width = Math.round(bbox[2]);
          const height = Math.round(bbox[3]);
          
          console.log(`🚨 ${objectType} DETECTED:`, forbiddenObjects);
          console.log(`Detection details:`, {
            class: forbiddenObjects.class,
            confidence: confidence + '%',
            bbox: bbox,
            size: `${width}x${height}px`,
            position: `(${Math.round(bbox[0])}, ${Math.round(bbox[1])})`
          });
          
          // Additional check: ensure it's a reasonable size for a phone (not too small, not too large)
          const minSize = 30; // Minimum 30px for partial phone
          const maxSize = 500; // Maximum 500px (for close phones)
          
          if ((width >= minSize || height >= minSize) && (width <= maxSize && height <= maxSize)) {
            setPhoneDetected(true);
            await triggerSecurityAlert(objectType);
            
            // Prevent alert spam (wait 30 seconds before next alert)
            lastAlertTimeRef.current = Date.now();
            setTimeout(() => {
              setPhoneDetected(false);
            }, 30000);
          } else {
            console.log(`Ignoring detection - size ${width}x${height}px outside phone range`);
          }
        } else {
          // Log why no detection happened
          const phonePredictions = predictions.filter(p => p.class === 'cell phone' || p.class === 'camera');
          if (phonePredictions.length > 0) {
            console.log('Phone/camera found but confidence too low:', phonePredictions.map(p => ({
              class: p.class,
              confidence: (p.score * 100).toFixed(1) + '%',
              threshold: '50.0%'
            })));
          }
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      animationIdRef.current = requestAnimationFrame(detectPhone);
    };

    // Start detection loop
    animationIdRef.current = requestAnimationFrame(detectPhone);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isCameraActive, phoneDetected, existingVideoRef, useFallback]);

  // Trigger security alert
  const triggerSecurityAlert = async (objectType) => {
    const message = `Unauthorized ${objectType} detected during printing session`;
    
    try {
      // Send alert to backend
      await api.post('/alert', {
        type: 'PHONE_DETECTED',
        message: message
      });
      
      console.warn(`🚨 ${objectType} DETECTION ALERT: ${message}`);
    } catch (error) {
      // Fallback to console if backend fails
      console.error('Failed to send phone detection alert:', error);
      console.warn(`🚨 ${objectType} DETECTION ALERT: ${message}`);
    }

    // Show security alert overlay
    setAlertMessage(message);
    setShowSecurityAlert(true);
    
    // Auto-dismiss after 4 seconds and navigate back to dashboard
    setTimeout(() => {
      setShowSecurityAlert(false);
      window.location.href = "/admin/dashboard";
    }, 4000);
  };

  return (
    <>
      {/* Security Alert Overlay */}
      <SecurityAlert isActive={showSecurityAlert} message={alertMessage} />
      
      {/* Hidden container for detection */}
      <div style={{ display: 'none' }}>
        {/* Fallback video element for camera feed */}
        {useFallback && (
          <video
            ref={fallbackVideoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
            style={{ display: 'none' }}
          />
        )}
        
        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999
          }}>
            <div>Model: {isModelLoaded ? '✅' : '⏳'}</div>
            <div>Camera: {isCameraActive ? '✅' : '⏳'}</div>
            <div>Fallback: {useFallback ? '🔄' : '📹'}</div>
            <div>Phone/Camera: {phoneDetected ? '🚨 DETECTED' : '✅ Clear'}</div>
          </div>
        )}
      </div>
    </>
  );
}
