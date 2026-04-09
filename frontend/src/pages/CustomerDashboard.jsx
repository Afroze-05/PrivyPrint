import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTokens } from "../services/tokenStorage";
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
  DollarSign
} from "lucide-react";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState({
    total: 24,
    pending: 3,
    completed: 21
  });

  const [liveStatus, setLiveStatus] = useState({
    token: "--",
    status: "Waiting"
  });

  const [history] = useState([
    { id: 1, file: "document.pdf", date: "2024-04-08", status: "completed" },
    { id: 2, file: "presentation.pptx", date: "2024-04-07", status: "pending" },
    { id: 3, file: "notes.docx", date: "2024-04-06", status: "completed" }
  ]);
  const [files, setFiles] = useState([]);
  const [printOptions, setPrintOptions] = useState({
    color: false,
    copies: 1
  });

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload Print", icon: Upload },
    { id: "history", label: "History", icon: History },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "profile", label: "Profile", icon: User }
  ];

  const [isDragging, setIsDragging] = useState(false);

  // Update live status from shared token storage
  useEffect(() => {
    const allTokens = getAllTokens();
    if (allTokens.length > 0) {
      // Get the most recent token
      const latestToken = allTokens[allTokens.length - 1];
      setLiveStatus({
        token: latestToken.token,
        status: latestToken.status === 'completed' ? 'Printed' : 
                latestToken.status === 'waiting' ? 'Waiting' : 
                latestToken.status === 'printing' ? 'Printing' :
                latestToken.status
      });
    }
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  const handleGenerateToken = () => {
    if (files.length === 0) {
      alert("Please upload at least one file");
      return;
    }
    const token = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // STORE TOKEN BEFORE NAVIGATION (VERY IMPORTANT)
    localStorage.setItem("customerToken", JSON.stringify({
      token: token,
      status: "waiting"
    }));

    console.log("Token stored:", token);

    // NAVIGATE TO TOKEN PAGE
    navigate("/token");
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
                  setActivePage(item.id);
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
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              {sidebarItems.find(item => item.id === activePage)?.label}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activePage === "dashboard" && <DashboardHome stats={stats} liveStatus={liveStatus} history={history} navigate={navigate} />}
          {activePage === "upload" && (
            <UploadPage 
              files={files}
              setFiles={setFiles}
              printOptions={printOptions}
              setPrintOptions={setPrintOptions}
              handleFileChange={handleFileChange}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              isDragging={isDragging}
              generateToken={handleGenerateToken}
            />
          )}
          {activePage === "history" && <HistoryPage history={history} />}
          {activePage === "notifications" && <NotificationsPage />}
          {activePage === "wallet" && <WalletPage />}
          {activePage === "profile" && <ProfilePage />}
        </div>
      </div>
    </div>
  );
}

// Dashboard Home Component
function DashboardHome({ stats, liveStatus, history, navigate }) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-[#ff6b00]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b00]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Prints</h3>
            <div className="p-2 bg-[#ff6b00]/10 rounded-lg">
              <FileText className="w-6 h-6 text-[#ff6b00]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-[#ff6b00]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b00]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Pending Prints</h3>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Processing now</span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 hover:border-[#ff6b00]/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#ff6b00]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Completed Prints</h3>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.completed}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4" />
            <span>Ready for pickup</span>
          </div>
        </div>
      </div>

      {/* Live Status Card */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#ff6b00]" />
          Live Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff6b00]/10 rounded">
                <Printer className="w-4 h-4 text-[#ff6b00]" />
              </div>
              <span className="font-medium text-gray-300">Token</span>
            </div>
            <button
              onClick={() => navigate("/token")}
              className="text-[#ff6b00] font-mono font-bold hover:text-[#ff8c00] transition-colors cursor-pointer"
            >
              {liveStatus.token}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded ${
                liveStatus.status === 'Ready' ? 'bg-green-500/10' : 'bg-orange-500/10'
              }`}>
                <AlertCircle className={`w-4 h-4 ${
                  liveStatus.status === 'Ready' ? 'text-green-500' : 'text-orange-500'
                }`} />
              </div>
              <span className="font-medium text-gray-300">Status</span>
            </div>
            <span className={`font-medium ${
              liveStatus.status === 'Ready' ? 'text-green-500' : 'text-orange-500'
            }`}>{liveStatus.status}</span>
          </div>
        </div>
      </div>

      {/* History Preview */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-[#ff6b00]" />
          Recent History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">File Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
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
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Upload Page Component
function UploadPage({ 
  files, 
  setFiles, 
  printOptions, 
  setPrintOptions, 
  handleFileChange, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  isDragging, 
  generateToken 
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#ff6b00]" />
          Upload New Document
        </h3>
        
        <div className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-[#ff6b00] bg-[#ff6b00]/5' 
                : 'border-gray-700 bg-[#0f0f0f] hover:border-gray-600'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Drag and drop your files here, or</p>
            <label className="inline-block">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-[#ff6b00] text-white rounded-lg hover:bg-[#ff8c00] transition-colors cursor-pointer">
                Browse Files
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, PPT, PPTX (Max 10MB)</p>
          </div>

          {/* Selected Files Display */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-gray-400 font-medium">Selected Files ({files.length})</h4>
              {files.map((file, index) => (
                <div key={index} className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#ff6b00]" />
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Print Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Print Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrintOptions(prev => ({ ...prev, color: false }))}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                    !printOptions.color
                      ? 'bg-[#ff6b00] text-white border-[#ff6b00]'
                      : 'bg-[#0f0f0f] text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  Black & White
                </button>
                <button
                  onClick={() => setPrintOptions(prev => ({ ...prev, color: true }))}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                    printOptions.color
                      ? 'bg-[#ff6b00] text-white border-[#ff6b00]'
                      : 'bg-[#0f0f0f] text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  Color
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Number of Copies
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={printOptions.copies}
                onChange={(e) => setPrintOptions(prev => ({ 
                  ...prev, 
                  copies: parseInt(e.target.value) || 1 
                }))}
                className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#ff6b00] transition-colors"
              />
            </div>
          </div>

          {/* Suggestion Box */}
          <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-[#ff6b00] text-lg">💡</div>
              <div>
                <p className="text-white font-medium">Cost Saving Tip</p>
                <p className="text-gray-300 text-sm mt-1">Use Black & White to save up to 60% on printing costs</p>
              </div>
            </div>
          </div>

          {/* Generate Token Button */}
          <button
            onClick={generateToken}
            disabled={files.length === 0}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              files.length > 0
                ? 'bg-[#ff6b00] text-white hover:bg-[#ff8c00] hover:shadow-lg hover:shadow-[#ff6b00]/20'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {files.length > 0 ? 'Generate Token' : 'Select files to continue'}
          </button>
        </div>
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

// Notifications Page Component
function NotificationsPage() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-[#ff6b00]" />
        Notifications
      </h3>
      
      <div className="space-y-4">
        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Print Completed</p>
              <p className="text-gray-400 text-sm mt-1">Your document "presentation.pptx" is ready for pickup</p>
              <p className="text-gray-500 text-xs mt-2">2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500/10 rounded">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Print Processing</p>
              <p className="text-gray-400 text-sm mt-1">Your document is currently being processed</p>
              <p className="text-gray-500 text-xs mt-2">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wallet Page Component
function WalletPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#ff6b00]" />
            Current Balance
          </h3>
          <p className="text-3xl font-bold text-white">₹250.00</p>
          <p className="text-gray-400 text-sm mt-2">Available for printing</p>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending</h3>
          <p className="text-3xl font-bold text-white">₹120.50</p>
          <p className="text-gray-400 text-sm mt-2">April 2024</p>
        </div>
      </div>
      
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Funds</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="py-2 px-4 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-300 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all">
            ₹50
          </button>
          <button className="py-2 px-4 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-300 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all">
            ₹100
          </button>
          <button className="py-2 px-4 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-300 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all">
            ₹200
          </button>
          <button className="py-2 px-4 bg-[#0f0f0f] border border-gray-700 rounded-lg text-gray-300 hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all">
            ₹500
          </button>
        </div>
      </div>
    </div>
  );
}

// Profile Page Component
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or auth context
    const authData = localStorage.getItem("secureprint_auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        setUser(parsedAuth.user);
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }, []);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl text-white mb-4">Profile</h2>
      
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#FF6B35]/20">
        {/* User Avatar and Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user ? getUserInitials(user.name) : "U"}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{user?.name || "User"}</h3>
            <p className="text-gray-400 text-sm">{user?.role || "customer"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <p className="text-white"><strong>Name:</strong> {user?.name || "Not available"}</p>
          </div>
          <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <p className="text-gray-400"><strong>Email:</strong> {user?.email || "Not available"}</p>
          </div>
          <div className="p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
            <p className="text-gray-400"><strong>Role:</strong> {user?.role || "customer"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
