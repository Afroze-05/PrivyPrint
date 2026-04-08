import { useEffect, useState, useMemo } from "react";
import { Clock, FileText, Printer, CheckCircle, XCircle, Hourglass, RefreshCw, TrendingUp, IndianRupee, Calendar, Filter } from "lucide-react";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

/* ── Pricing Constants ── */
const PRICING = {
  'B/W': 2,  // ₹2 per page
  'Color': 5  // ₹5 per page
};

/* ── Glass Card ── */
const GlassCard = ({ children, className = "", accent = "#FF6B35" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative backdrop-blur-xl border rounded-2xl overflow-hidden ${className}`}
    style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
    }}
  >
    <div className="absolute top-0 left-0 right-0 h-[1px]"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

/* ── History Item Component ── */
const HistoryItem = ({ item, index }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case "completed":
      case "Printed":
        return <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />;
      case 'printing':
        return <Printer className="w-4 h-4" style={{ color: "#FFA05B" }} />;
      case 'waiting':
        return <Hourglass className="w-4 h-4" style={{ color: "#FF6B35" }} />;
      case 'expired':
        return <XCircle className="w-4 h-4" style={{ color: "#ef4444" }} />;
      default:
        return <FileText className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case "completed":
      case "Printed":
        return 'Printed';
      case 'printing': return 'Printing';
      case 'waiting': return 'Pending';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const calculatePrice = (type, copies, pages = 1) => {
    const pricePerPage = PRICING[type] || 0;
    return pricePerPage * copies * pages;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMs / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm border hover:bg-white/5 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.05)"
      }}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {getStatusIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate" style={{ 
            color: "#EAEAEA",
            fontFamily: '"Inter", sans-serif'
          }}>
            {item.filename || `Document ${item.token?.slice(-6) || 'Unknown'}`}
          </span>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            (item.printType || item.type) === "Color" 
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300"
              : "bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-gray-500/30 text-gray-300"
          }`}>
            {(item.printType || item.type) === "Color" ? "Color" : "B&W"}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(item.timestamp || item.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </span>
          {item.userId?.name && (
            <span>
              {item.userId.name}
            </span>
          )}
          <span>
            {item.copies} {item.copies === 1 ? 'copy' : 'copies'}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold" style={{ color: "#22c55e" }}>
          <IndianRupee className="w-4 h-4 inline mr-1" />
          {item.price || calculatePrice(item.printType || item.type, item.copies, item.pages)}
        </div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          {item.copies} × {item.pages || 1} × {PRICING[item.printType || item.type] || 0}
        </div>
      </div>

      {/* Token */}
      <div className="flex-shrink-0">
        <code className="text-xs font-mono px-2 py-1 rounded-lg backdrop-blur-sm" 
          style={{ 
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.7)"
          }}>
          {item.token?.slice(-8) || 'N/A'}
        </code>
      </div>
    </motion.div>
  );
};

export default function PrintHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState("all"); // all, today, completed, pending

  // Calculate today's revenue
  const todayRevenue = useMemo(() => {
    const today = new Date().toDateString();
    const todayItems = history.filter(item => 
      new Date(item.timestamp || item.createdAt).toDateString() === today
    );
    
    return todayItems.reduce((total, item) => {
      // Use backend price if available, otherwise calculate
      if (item.price) {
        return total + item.price;
      }
      const pricePerPage = PRICING[item.printType || item.type] || 0;
      const pages = item.pages || 1;
      const copies = item.copies || 1;
      return total + (pricePerPage * copies * pages);
    }, 0);
  }, [history]);

  // Fetch history data
  const fetchHistory = async () => {
    try {
      const response = await api.get("/print-history");
      setHistory(response.data);
      setLastUpdate(new Date());
      setError("");
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  // Filter history based on selected filter
  const filteredHistory = useMemo(() => {
    const today = new Date().toDateString();
    
    switch (filter) {
      case "today":
        return history.filter(item => 
          new Date(item.createdAt).toDateString() === today
        );
      case "completed":
      case "Printed":
        return history.filter(item => item.status === 'completed' || item.status === 'Printed');
      case "pending":
        return history.filter(item => item.status === "waiting" || item.status === "printing");
      default:
        return history;
    }
  }, [history, filter]);

  // Initial fetch
  useEffect(() => {
    fetchHistory();
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHistory();
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Sort history by creation time (newest first)
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [filteredHistory]);

  return (
    <GlassCard accent="#FF6B35" className="h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header with Revenue */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold flex items-center gap-3 mb-3" style={{
              color: "#EAEAEA",
              fontFamily: '"Clash Display", "Inter", sans-serif'
            }}>
              <Clock className="w-5 h-5" />
              Print History
            </h2>
            
            {/* Today's Revenue */}
            <div className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border" style={{
              background: "rgba(34, 197, 94, 0.1)",
              borderColor: "rgba(34, 197, 94, 0.2)"
            }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#22c55e" }} />
              <div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Today's Total Earnings
                </div>
                <div className="text-xl font-bold flex items-center" style={{ 
                  color: "#22c55e",
                  fontFamily: '"Clash Display", "Inter", sans-serif'
                }}>
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {todayRevenue}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 rounded-lg backdrop-blur-sm border text-sm appearance-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#EAEAEA",
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <Filter className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.5)" }} />
            </div>
            
            {lastUpdate && (
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchHistory}
              className="p-2 rounded-lg backdrop-blur-sm border transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)"
              }}
            >
              <RefreshCw className="w-4 h-4" style={{ color: "rgba(255,255,255,0.7)" }} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
              />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <XCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#ef4444" }} />
                <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
                  {error}
                </p>
              </div>
            </div>
          ) : sortedHistory.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {filter === "all" ? "No print history yet" : `No ${filter} print jobs found`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              <AnimatePresence>
                {sortedHistory.slice(0, 20).map((item, index) => (
                  <HistoryItem key={item.id || item.token} item={item} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {sortedHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>Showing {Math.min(sortedHistory.length, 20)} of {sortedHistory.length} items</span>
              <span>Real-time updates enabled</span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
