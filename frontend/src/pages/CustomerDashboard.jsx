import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTokens } from "../services/tokenStorage";
import { initializeSocket, getSocket, socketListeners, isConnected, disconnectSocket } from "../services/socket";
import api from "../services/api";

// Add CSS animation for slide-in effect
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Bell, 
  Wallet, 
  User, 
  FileText,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Download,
  TrendingUp,
  DollarSign,
  Wifi,
  WifiOff,
  Mail,
  Monitor
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Real-time state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  const [liveStatus, setLiveStatus] = useState({
    token: "--",
    status: "Waiting"
  });

  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [userProfile, setUserProfile] = useState(null);
  const [walletData, setWalletData] = useState({
    balance: 250,
    monthlySpending: 0
  });

  // Login session state
  const [loginSession, setLoginSession] = useState({
    lastLogin: null,
    currentStatus: 'offline',
    deviceInfo: {
      browser: 'Unknown',
      os: 'Unknown',
      deviceType: 'Unknown'
    },
    location: {
      ip: 'Unknown',
      country: 'Unknown'
    },
    sessionStatus: 'inactive'
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload Print", icon: Upload },
    { id: "history", label: "History", icon: History }
  ];


  // Initialize Socket.io and fetch initial data
  useEffect(() => {
    const socket = initializeSocket();
    if (socket) {
      setConnectionStatus('connected');
    }

    // Fetch initial data
    fetchUserData();
    fetchDocumentHistory();

    // Set up Socket.io event listeners
    setupSocketListeners();

    // Cleanup on unmount
    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, []);

  // Monitor connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(isConnected() ? 'connected' : 'disconnected');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch user profile and stats
  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/verify-token');
      setUserProfile(response.data.user);
      
      // Fetch document history to calculate stats
      const historyResponse = await api.get('/documents/user/history');
      const documents = historyResponse.data.documents || [];
      
      // Calculate stats from real data
      const calculatedStats = {
        total: documents.length,
        pending: documents.filter(doc => doc.status === 'waiting').length,
        completed: documents.filter(doc => doc.status === 'completed').length
      };
      setStats(calculatedStats);
      
      // Calculate monthly spending
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlySpending = documents
        .filter(doc => {
          const docDate = new Date(doc.createdAt);
          return doc.status === 'completed' && 
                 docDate.getMonth() === currentMonth && 
                 docDate.getFullYear() === currentYear;
        })
        .reduce((total, doc) => total + (doc.price || 0), 0);
      
      setWalletData(prev => ({ ...prev, monthlySpending }));
      
      // Update live status with most recent document
      if (documents.length > 0) {
        const latestDoc = documents[documents.length - 1];
        setLiveStatus({
          token: latestDoc.token,
          status: latestDoc.status === 'completed' ? 'Printed' : 
                  latestDoc.status === 'waiting' ? 'Waiting' : 
                  latestDoc.status === 'printing' ? 'Printing' :
                  latestDoc.status
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch document history
  const fetchDocumentHistory = async () => {
    try {
      const response = await api.get('/documents/user/history');
      const documents = response.data.documents || [];
      
      // Transform data for display
      const formattedHistory = documents.map(doc => ({
        id: doc._id,
        file: doc.fileUrl ? doc.fileUrl.split('/').pop() : 'Unknown',
        date: new Date(doc.createdAt).toLocaleDateString(),
        type: doc.type || 'B/W',
        copies: doc.copies || 1,
        price: doc.price || 0,
        status: doc.status
      }));
      
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching document history:', error);
    }
  };

  // Set up Socket.io event listeners
  const setupSocketListeners = () => {
    // Listen for document creation
    socketListeners.onDocumentCreated((data) => {
      console.log('Document created:', data);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1
      }));
      
      // Update live status
      setLiveStatus({
        token: data.token,
        status: 'Waiting'
      });
      
      // Add to history
      const newHistoryItems = data.files.map(file => ({
        id: file.id,
        file: file.filename,
        date: new Date(file.createdAt).toLocaleDateString(),
        type: file.type,
        copies: file.copies,
        price: file.price,
        status: 'waiting'
      }));
      
      setHistory(prev => [...newHistoryItems, ...prev].slice(0, 10));
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Document Uploaded',
        message: `${data.totalFiles} file(s) uploaded successfully with token ${data.token}`,
        time: new Date()
      });
    });

    // Listen for document printing
    socketListeners.onDocumentPrinting((data) => {
      console.log('Document printing:', data);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1
      }));
      
      // Update live status
      setLiveStatus({
        token: data.token,
        status: 'Printing'
      });
      
      // Update history
      setHistory(prev => prev.map(item => 
        item.file === data.filename 
          ? { ...item, status: 'printing' }
          : item
      ));
      
      // Add notification
      addNotification({
        type: 'info',
        title: 'Print Started',
        message: `Your document "${data.filename}" is now being printed`,
        time: new Date()
      });
    });

    // Listen for document completion
    socketListeners.onDocumentCompleted((data) => {
      console.log('Document completed:', data);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1
      }));
      
      // Update live status
      setLiveStatus({
        token: data.token,
        status: 'Printed'
      });
      
      // Update history
      setHistory(prev => prev.map(item => 
        item.file === data.filename 
          ? { ...item, status: 'completed' }
          : item
      ));
      
      // Update wallet spending
      setWalletData(prev => ({
        ...prev,
        monthlySpending: prev.monthlySpending + (data.price || 0)
      }));
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Print Completed',
        message: `Your document "${data.filename}" is ready for pickup`,
        time: new Date()
      });
    });

    // Listen for user data updates
    socketListeners.onUserDataUpdated((data) => {
      console.log('User data updated:', data);
      
      // Refresh user profile data
      fetchUserData();
      
      // Add notification for profile update
      addNotification({
        type: 'info',
        title: 'Profile Updated',
        message: 'Your profile information has been updated',
        time: new Date()
      });
    });

    // Listen for profile updates
    socketListeners.onProfileUpdated((data) => {
      console.log('Profile updated:', data);
      
      // Update user profile state
      if (data.user) {
        setUserProfile(prev => ({ ...prev, ...data.user }));
      }
      
      // Add notification
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated',
        time: new Date()
      });
    });

    // Listen for profile update events
    socketListeners.onProfileUpdate((data) => {
      console.log('Profile update event received:', data);
      
      // Update user profile state with new data
      if (data.user) {
        setUserProfile(prev => ({ ...prev, ...data.user }));
      }
      
      // Add notification for profile update
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated in real-time',
        time: new Date()
      });
    });

    // Listen for history updates
    socketListeners.onHistoryUpdated((data) => {
      console.log('History updated:', data);
      
      // Refresh document history
      fetchDocumentHistory();
      
      // Update stats if provided
      if (data.stats) {
        setStats(prev => ({ ...prev, ...data.stats }));
      }
    });

    // Listen for new notifications
    socketListeners.onNotificationReceived((data) => {
      console.log('New notification:', data);
      
      // Add notification to state
      addNotification({
        type: data.type || 'info',
        title: data.title || 'New Notification',
        message: data.message || 'You have a new notification',
        time: new Date(data.timestamp || Date.now())
      });
    });

    // Listen for stats updates
    socketListeners.onStatsUpdated((data) => {
      console.log('Stats updated:', data);
      
      // Update stats
      if (data.stats) {
        setStats(prev => ({ ...prev, ...data.stats }));
      }
    });

    // Listen for wallet updates
    socketListeners.onWalletUpdated((data) => {
      console.log('Wallet updated:', data);
      
      // Update wallet data
      if (data.walletData) {
        setWalletData(prev => ({ ...prev, ...data.walletData }));
      }
      
      // Add notification for wallet update
      addNotification({
        type: 'info',
        title: 'Wallet Updated',
        message: data.message || 'Your wallet information has been updated',
        time: new Date()
      });
    });

    // Listen for login success events
    socketListeners.onLoginSuccess((data) => {
      console.log('Login success event received:', data);
      
      // Update login session state
      if (data.session) {
        setLoginSession(prev => ({
          ...prev,
          lastLogin: data.session.loginTime,
          currentStatus: 'online',
          deviceInfo: data.session.device,
          location: {
            ip: data.session.ip,
            country: 'Unknown' // Could be enhanced with IP geolocation
          },
          sessionStatus: 'active'
        }));
      }
      
      // Update user profile with online status
      if (data.user) {
        setUserProfile(prev => ({ ...prev, ...data.user }));
      }
      
      // Add notification for login success
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: `Logged in from ${data.session?.device?.deviceType || 'Unknown device'}`,
        time: new Date()
      });
    });

    // Listen for session update events
    socketListeners.onSessionUpdate((data) => {
      console.log('Session update event received:', data);
      
      // Update login session state
      setLoginSession(prev => ({
        ...prev,
        sessionStatus: data.status,
        lastActivity: data.lastActivity || new Date()
      }));
      
      // Add notification for session update
      addNotification({
        type: 'info',
        title: 'Session Updated',
        message: `Session status: ${data.status}`,
        time: new Date()
      });
    });

    // Listen for logout events
    socketListeners.onLogoutEvent((data) => {
      console.log('Logout event received:', data);
      
      // Update login session state
      setLoginSession(prev => ({
        ...prev,
        currentStatus: 'offline',
        sessionStatus: 'inactive'
      }));
      
      // Update user profile with offline status
      if (data.user) {
        setUserProfile(prev => ({ ...prev, ...data.user }));
      }
      
      // Add notification for logout
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been logged out successfully',
        time: new Date()
      });
    });
  };

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
    setNotificationCount(prev => prev + 1);
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setNotificationCount(0);
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#1a1a1a] transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">PrivyPrint</h1>
          </div>
        </div>

        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "upload") {
                    setActivePage(item.id);
                    navigate("/upload");
                  } else {
                    setActivePage(item.id);
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  activePage === item.id
                    ? "bg-[#ff6b00] text-white shadow-lg shadow-[#ff6b00]/20"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white hover:shadow-md hover:shadow-[#ff6b00]/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-[#1a1a1a] border-b border-gray-800">
          <div className="px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {sidebarItems.find(item => item.id === activePage)?.label}
            </h2>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0f0f0f] border border-gray-800">
                {connectionStatus === 'connected' ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500 font-medium">Offline</span>
                  </>
                )}
              </div>
              
                          </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activePage === "dashboard" && <DashboardHome stats={stats} liveStatus={liveStatus} history={history} navigate={navigate} userProfile={userProfile} loginSession={loginSession} />}
          {activePage === "history" && <HistoryPage history={history} />}
        </div>
      </div>
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ stats, liveStatus, history, navigate, userProfile, loginSession }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'away': return 'Away';
      default: return 'Unknown';
    }
  };

  const formatLoginTime = (time) => {
    if (!time) return 'Never';
    return new Date(time).toLocaleString();
  };

  return (
    <div className="space-y-8">
      
      

      {/* Recent Documents - Real-time Updates */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ff6b00]" />
            Recent Documents
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No documents uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">Upload your first document to see it here instantly</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-gray-800 hover:border-[#ff6b00]/50 transition-all duration-300"
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'completed' 
                      ? 'bg-green-500/10' 
                      : item.status === 'printing'
                      ? 'bg-orange-500/10'
                      : 'bg-gray-500/10'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      item.status === 'completed' 
                        ? 'text-green-500' 
                        : item.status === 'printing'
                        ? 'text-orange-500'
                        : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.file}</p>
                    <p className="text-sm text-gray-400">{item.date} · {item.type} · {item.copies} copies</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Rs. {item.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : item.status === 'printing'
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    {item.status === 'completed' ? 'Completed' : item.status === 'printing' ? 'Printing' : 'Waiting'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// History Page Component
function HistoryPage({ history }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <History className="w-5 h-5 text-[#ff6b00]" />
        Print History
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">File Name</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Copies</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-gray-800/50 hover:bg-[#0f0f0f] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{item.file}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-400">{item.date}</td>
                <td className="py-3 px-4 text-gray-400">Color</td>
                <td className="py-3 px-4 text-gray-400">1</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-[#ff6b00] hover:text-[#ff8c00] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
