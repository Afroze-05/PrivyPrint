import { io } from 'socket.io-client';
import { getAuth } from './authStorage';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Socket configuration
const SOCKET_CONFIG = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};

// Initialize socket connection
export const initializeSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  const authData = getAuth();
  const token = authData?.token;
  
  if (!token) {
    console.warn('No authentication token found for socket connection');
    return null;
  }

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    ...SOCKET_CONFIG,
    auth: {
      token: token
    }
  });

  // Socket event handlers
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    reconnectAttempts = 0;
    
    // Authenticate with user data
    const user = authData?.user;
    if (user) {
      socket.emit('authenticate', {
        userId: user.id || user._id,
        role: user.role
      });
    }
  });

  socket.on('authenticated', (data) => {
    console.log('Socket authenticated successfully:', data);
  });

  socket.on('authentication_error', (error) => {
    console.error('Socket authentication failed:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected to WebSocket server after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('WebSocket reconnection error:', error);
    reconnectAttempts++;
  });

  socket.on('reconnect_failed', () => {
    console.error('Failed to reconnect to WebSocket server after', MAX_RECONNECT_ATTEMPTS, 'attempts');
  });

  return socket;
};

// Get current socket instance
export const getSocket = () => socket;

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event listeners for real-time updates
export const socketListeners = {
  // Document events
  onDocumentCreated: (callback) => {
    if (socket) socket.on('document_created', callback);
  },
  
  onDocumentPrinting: (callback) => {
    if (socket) socket.on('document_printing', callback);
  },
  
  onDocumentCompleted: (callback) => {
    if (socket) socket.on('document_completed', callback);
  },

  // User data events
  onUserDataUpdated: (callback) => {
    if (socket) socket.on('user:data_updated', callback);
  },

  onProfileUpdated: (callback) => {
    if (socket) socket.on('user:profile_updated', callback);
  },

  onProfileUpdate: (callback) => {
    if (socket) socket.on('profile:update', callback);
  },

  // History events
  onHistoryUpdated: (callback) => {
    if (socket) socket.on('history:updated', callback);
  },

  // Notification events
  onNotificationReceived: (callback) => {
    if (socket) socket.on('notification:new', callback);
  },

  // Stats events
  onStatsUpdated: (callback) => {
    if (socket) socket.on('user:stats_updated', callback);
  },

  // Wallet events
  onWalletUpdated: (callback) => {
    if (socket) socket.on('user:wallet_updated', callback);
  },

  // Login and session events
  onLoginSuccess: (callback) => {
    if (socket) socket.on('login:success', callback);
  },

  onSessionUpdate: (callback) => {
    if (socket) socket.on('session:update', callback);
  },

  onLogoutEvent: (callback) => {
    if (socket) socket.on('logout:event', callback);
  },

  // Admin events
  onAdminPrintCompleted: (callback) => {
    if (socket) socket.on('admin_print_completed', callback);
  },

  // Remove listeners
  offDocumentCreated: (callback) => {
    if (socket) socket.off('document_created', callback);
  },
  
  offDocumentPrinting: (callback) => {
    if (socket) socket.off('document_printing', callback);
  },
  
  offDocumentCompleted: (callback) => {
    if (socket) socket.off('document_completed', callback);
  },

  offUserDataUpdated: (callback) => {
    if (socket) socket.off('user:data_updated', callback);
  },

  offProfileUpdated: (callback) => {
    if (socket) socket.off('user:profile_updated', callback);
  },

  offProfileUpdate: (callback) => {
    if (socket) socket.off('profile:update', callback);
  },

  offHistoryUpdated: (callback) => {
    if (socket) socket.off('history:updated', callback);
  },

  offNotificationReceived: (callback) => {
    if (socket) socket.off('notification:new', callback);
  },

  offStatsUpdated: (callback) => {
    if (socket) socket.off('user:stats_updated', callback);
  },

  offWalletUpdated: (callback) => {
    if (socket) socket.off('user:wallet_updated', callback);
  },

  // Login and session events
  offLoginSuccess: (callback) => {
    if (socket) socket.off('login:success', callback);
  },

  offSessionUpdate: (callback) => {
    if (socket) socket.off('session:update', callback);
  },

  offLogoutEvent: (callback) => {
    if (socket) socket.off('logout:event', callback);
  },

  offAdminPrintCompleted: (callback) => {
    if (socket) socket.off('admin_print_completed', callback);
  }
};

// Connection status helpers
export const isConnected = () => socket && socket.connected;

export const getConnectionStatus = () => {
  if (!socket) return 'disconnected';
  if (socket.connected) return 'connected';
  return 'connecting';
};
