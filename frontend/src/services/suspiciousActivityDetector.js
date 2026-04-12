import { api } from './api';

// Debounce function to prevent spam
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Get customer token from localStorage
const getCustomerToken = () => {
  try {
    const tokenData = localStorage.getItem("customerToken");
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      return parsed.token;
    }
  } catch (error) {
    console.error("Error getting customer token:", error);
  }
  return null;
};

// Trigger suspicious activity with debouncing
const triggerSuspiciousActivity = debounce(async (type) => {
  console.log("Suspicious Activity:", type);

  const token = getCustomerToken();
  if (!token) {
    console.warn("No customer token found, cannot send alert");
    return;
  }

  try {
    await api.post("/alerts/suspicious", {
      type,
      time: new Date(),
      token
    });
    console.log("Suspicious activity alert sent successfully");
  } catch (error) {
    console.error("Failed to send suspicious activity alert:", error);
  }
}, 5000); // 5 second debounce

// Event listeners for suspicious activity detection
export const setupSuspiciousActivityDetection = () => {
  // Tab Switch Detection
  const handleVisibilityChange = () => {
    if (document.hidden) {
      triggerSuspiciousActivity("tab_switch_detected");
    }
  };

  // Copy Action Detection
  const handleCopy = () => {
    triggerSuspiciousActivity("copy_action_detected");
  };

  // Paste Action Detection
  const handlePaste = () => {
    triggerSuspiciousActivity("paste_action_detected");
  };

  // Right Click Block + Detect
  const handleContextMenu = (e) => {
    e.preventDefault();
    triggerSuspiciousActivity("right_click_attempt");
  };

  // Add event listeners
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("copy", handleCopy);
  document.addEventListener("paste", handlePaste);
  document.addEventListener("contextmenu", handleContextMenu);

  console.log("Suspicious activity detection enabled");

  // Return cleanup function
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.removeEventListener("copy", handleCopy);
    document.removeEventListener("paste", handlePaste);
    document.removeEventListener("contextmenu", handleContextMenu);
    console.log("Suspicious activity detection disabled");
  };
};

// Optional: Camera AI Phone Detection (placeholder for future implementation)
export const setupPhoneDetection = () => {
  // This would require TensorFlow.js or similar library
  // For now, this is a placeholder that can be implemented later
  console.log("Phone detection not implemented yet");
  
  // Example implementation would be:
  // - Use camera access
  // - Run ML model to detect mobile phones
  // - Trigger alert if phone detected
  // triggerSuspiciousActivity("phone_detected_near_screen");
};

export default {
  setupSuspiciousActivityDetection,
  setupPhoneDetection,
  triggerSuspiciousActivity
};
