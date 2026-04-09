import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAuth } from "../services/authStorage";
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
  TrendingUp,
  X,
  LogOut,
  Menu
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const auth = getAuth();

  // Mock data
  const stats = {
    totalPrints: 24,
    pendingPrints: 3,
    completedPrints: 21
  };

  const liveStatus = {
    tokenNumber: "A024",
    status: "Waiting",
    estimatedTime: "5 mins"
  };

  const recentHistory = [
    { id: 1, fileName: "Resume.pdf", date: "2024-04-08", status: "Completed" },
    { id: 2, fileName: "Project_Report.docx", date: "2024-04-07", status: "Completed" },
    { id: 3, fileName: "Presentation.pdf", date: "2024-04-06", status: "Printing" },
    { id: 4, fileName: "Notes.jpg", date: "2024-04-05", status: "Completed" },
    { id: 5, fileName: "Assignment.pdf", date: "2024-04-04", status: "Completed" }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload Print", icon: Upload },
    { id: "history", label: "History", icon: History },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "Profile", icon: User }
  ];

  const handleLogout = () => {
    localStorage.removeItem('secureprint_auth');
    localStorage.removeItem('privyprint_test_token');
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Prints</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPrints}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Pending Prints</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingPrints}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completed Prints</p>
              <p className="text-3xl font-bold mt-2">{stats.completedPrints}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>
      </div>

      {/* Live Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Live Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Token Number</p>
            <p className="text-2xl font-bold text-orange-500">{liveStatus.tokenNumber}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center justify-center mt-1">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                liveStatus.status === 'Completed' ? 'bg-green-500' :
                liveStatus.status === 'Printing' ? 'bg-amber-500' : 'bg-gray-500'
              }`} />
              <p className="text-xl font-semibold">{liveStatus.status}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Estimated Time</p>
            <p className="text-xl font-semibold">{liveStatus.estimatedTime}</p>
          </div>
        </div>
      </motion.div>

      {/* Recent History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent History</h3>
          <button 
            onClick={() => setActiveSection('history')}
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentHistory.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">{item.fileName}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.status === 'Printing' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Upload Print Document</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="mt-4"
          />
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Print Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-orange-500" />
                <span className="text-sm">Color Print</span>
              </label>
            </div>
            <div>
              <label className="block text-sm mb-1">Number of Copies</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue="1"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Page Selection</label>
              <select className="w-full px-3 py-1 border border-gray-300 rounded-lg">
                <option value="all">All Pages</option>
                <option value="first">First Page Only</option>
                <option value="last">Last Page Only</option>
              </select>
            </div>
          </div>
        </div>

        <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium mt-4">
          Submit Print Job
        </button>
      </motion.div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Print History</h3>
        <div className="space-y-3">
          {recentHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium">{item.fileName}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.status === 'Printing' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Notifications</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="font-medium">Print Job Completed</p>
                <p className="text-sm text-gray-600">Your document "Resume.pdf" has been printed successfully.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <p className="font-medium">Low Balance Warning</p>
                <p className="text-sm text-gray-600">Your wallet balance is running low. Please recharge to continue printing.</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Wallet</h3>
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-xl text-white mb-6">
          <p className="text-orange-100">Current Balance</p>
          <p className="text-3xl font-bold mt-2">₹250.00</p>
        </div>
        
        <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium mb-6">
          Add Money
        </button>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Recent Transactions</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Print Job</p>
                <p className="text-sm text-gray-500">Resume.pdf</p>
              </div>
              <span className="text-red-500 font-medium">-₹15.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Recharge</p>
                <p className="text-sm text-gray-500">Wallet Top-up</p>
              </div>
              <span className="text-green-500 font-medium">+₹100.00</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-6">Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-medium">{auth?.user?.name || 'User'}</p>
              <p className="text-gray-500">{auth?.user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Member Since</span>
              <span className="font-medium">April 2024</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Prints</span>
              <span className="font-medium">{stats.totalPrints}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'upload':
        return renderUpload();
      case 'history':
        return renderHistory();
      case 'notifications':
        return renderNotifications();
      case 'wallet':
        return renderWallet();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">PrivyPrint</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-xl font-semibold">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
