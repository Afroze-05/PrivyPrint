// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { getAuth, clearAuth, setAuth } from "../../services/authStorage";
// import { motion } from "framer-motion";
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";
// import {
//   Users, Printer, BarChart2, ShieldCheck,
//   LogOut, Cpu, LayoutDashboard, ScrollText,
//   Search, Filter, Settings, Bell, TrendingUp,
//   FileText, Activity, Clock, CheckCircle, AlertCircle,
//   Calendar as CalendarIcon, RefreshCw, Download, Eye,
//   IndianRupee, TrendingDown, User, File, Star
// } from "lucide-react";
// // import CalendarView from "../../components/CalendarView";

// /* ── Premium Noise grain overlay ── */
// const NoiseSVG = () => (
//   <svg
//     className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// /* ── Subtle Dot-grid background ── */
// const GridDots = () => (
//   <div
//     className="absolute inset-0 pointer-events-none"
//     style={{
//       backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.3) 1px, transparent 1px)`,
//       backgroundSize: "36px 36px",
//       opacity: 0.03,
//     }}
//   />
// );

// /* ── Soft Ambient glow orb ── */
// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{
//       scale: [1, 1.1, 1.05, 1.15, 1],
//       opacity: [0.08, 0.12, 0.1, 0.15, 0.08]
//     }}
//     transition={{
//       duration: 12,
//       repeat: Infinity,
//       delay,
//       ease: "easeInOut",
//       times: [0, 0.25, 0.5, 0.75, 1],
//     }}
//   />
// );

// /* ── Star Rating Display Component ── */
// const StarRatingDisplay = ({ rating, size = "text-sm" }) => {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 !== 0;

//   return (
//     <div className={`flex items-center gap-1 ${size}`}>
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           className={`w-4 h-4 ${
//             star <= fullStars
//               ? 'text-yellow-400 fill-yellow-400'
//               : 'text-gray-600'
//           }`}
//         />
//       ))}
//       <span className="ml-1 text-gray-300">{rating.toFixed(1)}</span>
//     </div>
//   );
// };

// /* ── Premium Stat Card ── */
// const StatCard = ({ icon: Icon, label, value, accent = "#FF6B35", delay = 0, children, trend }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay, duration: 0.5 }}
//     className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
//     style={{
//       background: "rgba(255,255,255,0.03)",
//       backdropFilter: "blur(16px)",
//       border: "1px solid rgba(255,255,255,0.08)",
//       boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
//     }}
//   >
//     <div className="absolute top-0 left-0 right-0 h-[1px]"
//       style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />

//     <div className="relative z-10">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-3 rounded-xl"
//             style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
//             <Icon className="w-5 h-5" style={{ color: accent }} />
//           </div>
//           <span className="text-sm font-medium" style={{ color: "#999999", fontFamily: '"Inter", sans-serif' }}>
//             {label}
//           </span>
//         </div>
//         {trend && (
//           <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
//             {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
//             {Math.abs(trend)}%
//           </div>
//         )}
//       </div>

//       <div
//         className="text-3xl font-bold mb-2"
//         style={{
//           color: "#EAEAEA",
//           fontFamily: '"Clash Display", "Inter", sans-serif',
//           fontWeight: 700
//         }}
//       >
//         {value}
//       </div>
//       {children}
//     </div>
//   </motion.div>
// );

// /* ── Premium Panel ── */
// const Panel = ({ title, icon: Icon, accent = "#FF6B35", delay = 0, children }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay, duration: 0.5 }}
//     className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
//     style={{
//       background: "rgba(255,255,255,0.03)",
//       backdropFilter: "blur(16px)",
//       border: "1px solid rgba(255,255,255,0.08)",
//       boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
//     }}
//   >
//     <div className="absolute top-0 left-0 right-0 h-[1px]"
//       style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />

//     <div className="relative z-10">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="p-2 rounded-lg"
//           style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
//           <Icon className="w-4 h-4" style={{ color: accent }} />
//         </div>
//         <h3
//           className="text-lg font-semibold"
//           style={{
//             color: "#EAEAEA",
//             fontFamily: '"Clash Display", "Inter", sans-serif',
//             fontWeight: 600
//           }}
//         >
//           {title}
//         </h3>
//       </div>
//       {children}
//     </div>
//   </motion.div>
// );

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const auth = useMemo(() => getAuth(), []);

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [trustScore, setTrustScore] = useState(() =>
//     typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : auth?.trustScore || 0
//   );

//   // Chart data states
//   const [chartData, setChartData] = useState([]);
//   const [tokenData, setTokenData] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [timeRange, setTimeRange] = useState('day'); // 'day' or 'month'

//   // Loading states for charts
//   const [chartsLoading, setChartsLoading] = useState(true);
//   const [componentError, setComponentError] = useState(null);

//   // Active tab state
//   const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'history'

//   // History state
//   const [printHistory, setPrintHistory] = useState([]);
//   const [dailyRevenue, setDailyRevenue] = useState(null);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [revenueLoading, setRevenueLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all'); // 'all', 'B/W', 'Color'
//   const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
//   const [lastRefreshTime, setLastRefreshTime] = useState(null);

//   // Rating stats state
//   const [ratingStats, setRatingStats] = useState(null);
//   const [ratingStatsLoading, setRatingStatsLoading] = useState(false);

//   // Review log state
//   const [reviewLog, setReviewLog] = useState([]);
//   const [reviewLogLoading, setReviewLogLoading] = useState(false);

//   // Error boundary
//   if (componentError) {
//     return (
//       <div style={{ padding: "20px", color: "#fff", background: "#1a1a1a", minHeight: "100vh" }}>
//         <h1>Admin Dashboard Error</h1>
//         <p>Something went wrong loading the dashboard:</p>
//         <pre style={{ background: "#2a2a2a", padding: "10px", borderRadius: "5px" }}>
//           {componentError.toString()}
//         </pre>
//         <button onClick={() => setComponentError(null)} style={{ marginTop: "10px", padding: "10px 20px", background: "#FF6B35", color: "#fff", border: "none", borderRadius: "5px" }}>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Real-time data fetching functions
//   async function fetchChartData() {
//     setChartsLoading(true);
//     try {
//       // TEMPORARY: Use test token for dashboard testing
//       const testToken = "test_admin_token_1775028546379";
//       const [statsRes, documentsRes, tokensRes, activityRes] = await Promise.all([
//         api.get("/stats", { headers: { Authorization: `Bearer ${testToken}` } }),
//         api.get("/documents", { headers: { Authorization: `Bearer ${testToken}` } }),
//         api.get("/tokens", { headers: { Authorization: `Bearer ${testToken}` } }),
//         api.get("/activity", { headers: { Authorization: `Bearer ${testToken}` } })
//       ]);

//       // Process upload data from documents API (for Uploads Over Time chart)
//       if (documentsRes.data && Array.isArray(documentsRes.data)) {
//         const documents = documentsRes.data;
//         const uploadGroups = {};
//         documents.forEach(doc => {
//           const date = new Date(doc.createdAt).toISOString().split('T')[0];
//           if (!uploadGroups[date]) uploadGroups[date] = 0;
//           uploadGroups[date]++;
//         });

//         const uploadChartData = Object.entries(uploadGroups)
//           .map(([date, count]) => ({ date, count }))
//           .sort((a, b) => new Date(a.date) - new Date(b.date));

//         console.log('Upload chart data:', uploadChartData);
//         setChartData(uploadChartData);
//       } else {
//         console.log('No documents data received');
//         setChartData([]);
//       }

//       // Process token data from tokens API
//       if (tokensRes.data && Array.isArray(tokensRes.data)) {
//         const tokens = tokensRes.data;
//         const statusCounts = {
//           waiting: tokens.filter(t => t.status === 'waiting').length,
//           printing: tokens.filter(t => t.status === 'printing').length,
//           completed: tokens.filter(t => t.status === 'completed').length,
//           expired: tokens.filter(t => t.status === 'expired').length
//         };

//         const statusChartData = [
//           { name: 'Waiting', value: statusCounts.waiting, color: '#FFA05B' },
//           { name: 'Printing', value: statusCounts.printing, color: '#FF8A50' },
//           { name: 'Completed', value: statusCounts.completed, color: '#22c55e' },
//           { name: 'Expired', value: statusCounts.expired, color: '#ef4444' }
//         ];

//         console.log('Status chart data:', statusChartData);
//         setStatusData(statusChartData);

//         // Group tokens by date for Tokens Generated Per Day chart
//         const tokenGroups = {};
//         tokens.forEach(token => {
//           const date = new Date(token.createdAt).toISOString().split('T')[0];
//           if (!tokenGroups[date]) tokenGroups[date] = 0;
//           tokenGroups[date]++;
//         });

//         const tokenChartData = Object.entries(tokenGroups)
//           .map(([date, tokens]) => ({ date, tokens }))
//           .sort((a, b) => new Date(a.date) - new Date(b.date));

//         console.log('Token chart data:', tokenChartData);
//         setTokenData(tokenChartData);
//       } else {
//         console.log('No tokens data received');
//         setStatusData([]);
//         setTokenData([]);
//       }

//       // Process recent activity
//       if (activityRes.data && Array.isArray(activityRes.data)) {
//         setRecentActivity(activityRes.data);
//         console.log('Recent activity loaded:', activityRes.data);
//       } else {
//         console.log('No activity data received');
//         setRecentActivity([]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch chart data:', err);
//       // Set empty arrays on error to show "No data" messages
//       setChartData([]);
//       setTokenData([]);
//       setStatusData([]);
//       setRecentActivity([]);
//     } finally {
//       setChartsLoading(false);
//     }
//   }

//   // Fetch rating statistics
//   async function fetchRatingStats() {
//     setRatingStatsLoading(true);
//     try {
//       // TEMPORARY: Use test token for dashboard testing
//       const testToken = "test_admin_token_1775028546379";
//       const res = await api.get("/rate/stats", {
//         headers: { Authorization: `Bearer ${testToken}` }
//       });

//       setRatingStats(res.data);
//       console.log('Rating stats loaded:', res.data);
//     } catch (err) {
//       console.error('Failed to fetch rating stats:', err);
//       setRatingStats(null);
//     } finally {
//       setRatingStatsLoading(false);
//     }
//   }

//   // Fetch review log
//   async function fetchReviewLog() {
//     setReviewLogLoading(true);
//     try {
//       // TEMPORARY: Use test token for dashboard testing
//       const testToken = "test_admin_token_1775028546379";
//       const res = await api.get("/rate/reviews", {
//         headers: { Authorization: `Bearer ${testToken}` }
//       });

//       setReviewLog(res.data.ratings || []);
//       console.log('Review log loaded:', res.data.ratings);
//     } catch (err) {
//       console.error('Failed to fetch review log:', err);
//       setReviewLog([]);
//     } finally {
//       setReviewLogLoading(false);
//     }
//   }

//   // Real-time polling effect
//   useEffect(() => {
//     fetchChartData(); // Initial fetch
//     fetchRatingStats(); // Initial fetch for rating stats
//     fetchReviewLog(); // Initial fetch for review log

//     const interval = setInterval(fetchChartData, 10000); // Poll every 10 seconds
//     const ratingInterval = setInterval(fetchRatingStats, 30000); // Poll rating stats every 30 seconds
//     const reviewInterval = setInterval(fetchReviewLog, 60000); // Poll review log every 60 seconds

//     return () => {
//       clearInterval(interval);
//       clearInterval(ratingInterval);
//       clearInterval(reviewInterval);
//     };
//   }, []);

//   // Fetch print history and revenue
//   async function fetchHistoryData() {
//     setHistoryLoading(true);
//     setRevenueLoading(true);
//     try {
//       // TEMPORARY: Use test token for dashboard testing
//       const testToken = "test_admin_token_1775028546379";
//       const [historyRes, revenueRes] = await Promise.all([
//         api.get("/print-history", { headers: { Authorization: `Bearer ${testToken}` } }),
//         api.get("/daily-revenue", { headers: { Authorization: `Bearer ${testToken}` } })
//       ]);

//       setPrintHistory(historyRes.data || []);
//       setDailyRevenue(revenueRes.data || null);
//       setLastRefreshTime(new Date());
//       console.log('History data loaded:', historyRes.data);
//       console.log('Revenue data loaded:', revenueRes.data);
//     } catch (err) {
//       console.error('Failed to fetch history data:', err);
//       setPrintHistory([]);
//       setDailyRevenue(null);
//     } finally {
//       setHistoryLoading(false);
//       setRevenueLoading(false);
//     }
//   }

//   // Real-time updates for history data
//   useEffect(() => {
//     if (activeTab === 'history' && autoRefreshEnabled) {
//       fetchHistoryData(); // Initial fetch when history tab is opened

//       // Poll every 30 seconds only if auto-refresh is enabled
//       const interval = setInterval(fetchHistoryData, 30000);

//       return () => clearInterval(interval);
//     }
//   }, [activeTab, autoRefreshEnabled]);

//   // Custom tooltip component
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div
//           className="p-3 rounded-lg border"
//           style={{
//             background: 'rgba(0, 0, 0, 0.9)',
//             border: '1px solid rgba(255, 107, 53, 0.3)',
//             backdropFilter: 'blur(8px)'
//           }}
//         >
//           {label && (
//             <p className="text-xs font-medium mb-1" style={{ color: '#999999' }}>
//               {label}
//             </p>
//           )}
//           {payload.map((entry, index) => {
//             const safeName = entry.name || entry.dataKey || 'Unknown';
//             const safeValue = typeof entry.value === 'object' ? JSON.stringify(entry.value) : entry.value;

//             return (
//               <p key={index} className="text-sm font-semibold" style={{ color: '#EAEAEA' }}>
//                 {safeName}: {safeValue}
//               </p>
//             );
//           })}
//         </div>
//       );
//     }
//     return null;
//   };

//   async function loadStats() {
//     setError("");
//     setLoading(true);
//     try {
//       // TEMPORARY: Use test token for dashboard testing
//       const testToken = "test_admin_token_1775028546379";
//       const res = await api.get("/stats", {
//         headers: { Authorization: `Bearer ${testToken}` },
//       });
//       setStats(res.data);
//       if (typeof res.data?.trustScore === "number") {
//         setTrustScore(res.data.trustScore);
//         const currentAuth = getAuth();
//         setAuth({ ...currentAuth, trustScore: res.data.trustScore });
//       }
//     } catch (err) {
//       console.log(err);
//       console.warn("API failed, using fallback.");
//       const today = new Date().toISOString().split("T")[0];
//       const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
//       const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
//       setStats(prev => ({
//         ...prev,
//         totalPrints: dayStats.total,
//         printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
//       }));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadStats();
//     const syncData = () => {
//       const next = getAuth()?.trustScore;
//       if (typeof next === "number") setTrustScore(next);
//       const today = new Date().toISOString().split("T")[0];
//       const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
//       const dayStats = allStats[today];
//       if (dayStats) {
//         setStats(prev => ({
//           ...prev,
//           totalPrints: dayStats.total,
//           printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
//         }));
//       }
//     };
//     window.addEventListener("storage", syncData);
//     window.addEventListener("localStatsUpdated", syncData);
//     return () => {
//       window.removeEventListener("storage", syncData);
//       window.removeEventListener("localStatsUpdated", syncData);
//     };
//   }, []);

//   function handleLogout() {
//     clearAuth();
//     navigate("/");
//   }

//   const trustColor = trustScore > 60 ? "#FF6B35" : "#FF6B35";

//   // Helper functions for History section
//   const filteredHistory = printHistory.filter(item => {
//     const matchesSearch = searchTerm === '' ||
//       item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.token.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesFilter = filterType === 'all' || item.printType === filterType;

//     return matchesSearch && matchesFilter;
//   });

//   const formatPrice = (price, currency = '₹') => {
//     return `${currency}${price}`;
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Printed': return '#22c55e';
//       case 'Pending': return '#FFA05B';
//       case 'Failed': return '#ef4444';
//       default: return '#999999';
//     }
//   };

//   const getPrintTypeColor = (type) => {
//     return type === 'B/W' ? '#FF8A50' : '#FF6B35';
//   };

//   try {
//     return (
//       <div
//         className="relative min-h-screen overflow-hidden"
//         style={{
//           background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
//           fontFamily: '"Inter", sans-serif'
//         }}
//       >
//       <NoiseSVG />
//       <GridDots />
//       <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
//       <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />

//       {/* Sidebar */}
//       <motion.div
//         initial={{ opacity: 0, x: -40 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//         className="fixed left-0 top-0 h-full w-64 z-20"
//         style={{
//           background: "rgba(255,255,255,0.03)",
//           backdropFilter: "blur(16px)",
//           border: "1px solid rgba(255,255,255,0.08)"
//         }}
//       >
//         <div className="p-6">
//           {/* Logo */}
//           <div className="flex items-center gap-3 mb-8">
//             <div className="p-2 rounded-xl"
//               style={{ background: "rgba(255, 107, 53, 0.15)", border: "1px solid rgba(255, 107, 53, 0.3)" }}>
//               <ShieldCheck className="w-5 h-5" style={{ color: "#FF6B35" }} />
//             </div>
//             <div>
//               <h1
//                 className="text-xl font-bold"
//                 style={{
//                   color: "#EAEAEA",
//                   fontFamily: '"Clash Display", "Inter", sans-serif',
//                   fontWeight: 700
//                 }}
//               >
//                 Admin
//               </h1>
//               <p className="text-xs" style={{ color: "#999999" }}>PrivyPrint</p>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="space-y-2">
//             <motion.button
//               whileHover={{ scale: 1.02, x: 4 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveTab('dashboard')}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
//               style={{
//                 background: activeTab === 'dashboard' ? "rgba(255, 107, 53, 0.1)" : "rgba(255,255,255,0.03)",
//                 border: activeTab === 'dashboard' ? "1px solid rgba(255, 107, 53, 0.2)" : "1px solid rgba(255,255,255,0.08)",
//                 color: activeTab === 'dashboard' ? "#FF6B35" : "#999999"
//               }}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               <span className="text-sm font-medium">Dashboard</span>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.02, x: 4 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveTab('history')}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
//               style={{
//                 background: activeTab === 'history' ? "rgba(255, 107, 53, 0.1)" : "rgba(255,255,255,0.03)",
//                 border: activeTab === 'history' ? "1px solid rgba(255, 107, 53, 0.2)" : "1px solid rgba(255,255,255,0.08)",
//                 color: activeTab === 'history' ? "#FF6B35" : "#999999"
//               }}
//             >
//               <CalendarIcon className="w-4 h-4" />
//               <span className="text-sm font-medium">History</span>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.02, x: 4 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => navigate("/admin/print")}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
//               style={{
//                 background: "rgba(255,255,255,0.03)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 color: "#999999"
//               }}
//             >
//               <Printer className="w-4 h-4" />
//               <span className="text-sm font-medium">Print Panel</span>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.02, x: 4 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => navigate("/admin/logs")}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
//               style={{
//                 background: "rgba(255,255,255,0.03)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 color: "#999999"
//               }}
//             >
//               <ScrollText className="w-4 h-4" />
//               <span className="text-sm font-medium">Print Logs</span>
//             </motion.button>
//           </nav>
//           {/* Logout */}
//           <motion.button
//             onClick={handleLogout}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
//             style={{
//               background: "rgba(239, 68, 68, 0.1)",
//               border: "1px solid rgba(239, 68, 68, 0.2)",
//               color: "#ef4444"
//             }}
//           >
//             <LogOut className="w-4 h-4" />
//             <span className="text-sm font-medium">Logout</span>
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="ml-64 p-8">
//         {/* Top Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="flex items-center justify-between mb-8"
//         >
//           <div>
//             <h1
//               className="text-3xl font-bold mb-2"
//               style={{
//                 color: "#EAEAEA",
//                 fontFamily: '"Clash Display", "Inter", sans-serif',
//                 fontWeight: 700
//               }}
//             >
//               {activeTab === 'dashboard' ? 'Dashboard' : 'History'}
//             </h1>
//             <p style={{ color: "#999999" }}>
//               {activeTab === 'dashboard'
//                 ? `Welcome back, ${auth?.name || "Admin"}`
//                 : 'Track uploads, tokens, and prints by date'
//               }
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               className="p-3 rounded-xl"
//               style={{
//                 background: "rgba(255,255,255,0.03)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 color: "#999999"
//               }}
//             >
//               <Bell className="w-5 h-5" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               className="p-3 rounded-xl"
//               style={{
//                 background: "rgba(255,255,255,0.03)",
//                 border: "1px solid rgba(255,255,255,0.08)",
//                 color: "#999999"
//               }}
//             >
//               <Settings className="w-5 h-5" />
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Content based on active tab */}
//         {activeTab === 'dashboard' ? (
//           <>
//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <StatCard
//                 icon={Users}
//                 label="Total Users"
//                 value={stats?.totalUsers || "0"}
//                 accent="#FF6B35"
//                 delay={0.1}
//               />
//               <StatCard
//                 icon={Printer}
//                 label="Total Prints"
//                 value={stats?.totalPrints || "0"}
//                 accent="#FF8A50"
//                 delay={0.2}
//               />
//               <StatCard
//                 icon={FileText}
//                 label="Active Tokens"
//                 value={statusData.reduce((sum, item) => sum + item.value, 0) || "0"}
//                 accent="#FFA05B"
//                 delay={0.3}
//               />
//               <StatCard
//                 icon={ShieldCheck}
//                 label="Trust Score"
//                 value={trustScore}
//                 accent="#FF6B35"
//                 delay={0.4}
//               >
//                 {ratingStats && (
//                   <div className="mt-3 space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs" style={{ color: "#999999" }}>
//                         Avg Rating
//                       </span>
//                       <StarRatingDisplay rating={ratingStats.averageRating || 0} />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs" style={{ color: "#999999" }}>
//                         Total Ratings
//                       </span>
//                       <span className="text-xs font-medium" style={{ color: "#EAEAEA" }}>
//                         {ratingStats.totalRatings || 0}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </StatCard>
//             </div>

//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//               {/* Line Chart - Uploads Over Time */}
//               <Panel title="Uploads Over Time" icon={BarChart2} accent="#FF6B35" delay={0.5}>
//                 <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
//                   {chartData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={chartData}>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="rgba(255,255,255,0.05)"
//                           vertical={false}
//                         />
//                         <XAxis
//                           dataKey="date"
//                           stroke="#999999"
//                           tick={{ fill: '#999999', fontSize: 12 }}
//                           tickFormatter={(value) => new Date(value).toLocaleDateString()}
//                         />
//                         <YAxis
//                           stroke="#999999"
//                           tick={{ fill: '#999999', fontSize: 12 }}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Line
//                           type="monotone"
//                           dataKey="count"
//                           stroke="#FF6B35"
//                           strokeWidth={3}
//                           dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
//                           activeDot={{ r: 6 }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No data available</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>

//               {/* Bar Chart - Tokens Generated */}
//               <Panel title="Tokens Generated Per Day" icon={FileText} accent="#FF8A50" delay={0.6}>
//                 <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
//                   {tokenData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={tokenData}>
//                         <CartesianGrid
//                           strokeDasharray="3 3"
//                           stroke="rgba(255,255,255,0.05)"
//                           vertical={false}
//                         />
//                         <XAxis
//                           dataKey="date"
//                           stroke="#999999"
//                           tick={{ fill: '#999999', fontSize: 12 }}
//                           tickFormatter={(value) => new Date(value).toLocaleDateString()}
//                         />
//                         <YAxis
//                           stroke="#999999"
//                           tick={{ fill: '#999999', fontSize: 12 }}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar
//                           dataKey="tokens"
//                           fill="#FF8A50"
//                           radius={[8, 8, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No token data available</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>
//             </div>

//             {/* Pie Chart Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Pie Chart - Token Status */}
//               <Panel title="Token Status Distribution" icon={Activity} accent="#FFA05B" delay={0.7}>
//                 <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
//                   {statusData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={statusData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={60}
//                           outerRadius={100}
//                           paddingAngle={2}
//                           dataKey="value"
//                         >
//                           {statusData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip content={<CustomTooltip />} />
//                         <Legend
//                           verticalAlign="middle"
//                           align="right"
//                           wrapperStyle={{
//                             paddingTop: '20px',
//                             color: '#999999'
//                           }}
//                           formatter={(value, name) => {
//                             // Ensure we're working with primitive values
//                             const safeValue = typeof value === 'object' ? value?.value || 0 : value;
//                             const safeName = typeof name === 'object' ? name?.name || 'Unknown' : name;
//                             const item = statusData.find(d => d.name === safeName);
//                             const displayValue = item?.value || safeValue || 0;

//                             return (
//                               <span style={{ color: '#EAEAEA' }}>
//                                 {safeName}: {displayValue}
//                               </span>
//                             );
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No status data available</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>

//               {/* Recent Activity Panel */}
//               <Panel title="Recent Activity" icon={Activity} accent="#FF8A50" delay={0.8}>
//                 <div className="w-full h-[300px] min-h-[250px] overflow-y-auto flex-1 min-w-0">
//                   {recentActivity.length > 0 ? (
//                     <div className="space-y-4">
//                       {recentActivity.slice(0, 5).map((activity, index) => {
//                         // Get appropriate icon based on activity type
//                         const getActivityIcon = (type) => {
//                           switch (type) {
//                             case 'upload':
//                               return <FileText className="w-4 h-4 text-green-400" />;
//                             case 'print':
//                               return <Printer className="w-4 h-4 text-blue-400" />;
//                             default:
//                               return <Activity className="w-4 h-4 text-gray-400" />;
//                           }
//                         };

//                         return (
//                           <div key={index} className="flex items-center gap-3 p-3 rounded-xl"
//                             style={{ background: "rgba(255,255,255,0.03)" }}>
//                             {getActivityIcon(activity.type)}
//                             <div className="flex-1">
//                               <p className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                 {activity.message}
//                               </p>
//                               <p className="text-xs" style={{ color: "#999999" }}>
//                                 {new Date(activity.timestamp).toLocaleString()}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No recent activity</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>

//               {/* Rating Distribution Panel */}
//               <Panel title="Customer Ratings" icon={Star} accent="#FFD700" delay={0.9}>
//                 <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
//                   {ratingStatsLoading ? (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="flex items-center gap-3">
//                         <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#FF6B35" }} />
//                         <span style={{ color: "#999999" }}>Loading rating data...</span>
//                       </div>
//                     </div>
//                   ) : ratingStats && ratingStats.totalRatings > 0 ? (
//                     <div className="space-y-4">
//                       {/* Average Rating Display */}
//                       <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,215,0,0.1)" }}>
//                         <div className="flex items-center justify-center gap-2 mb-2">
//                           <StarRatingDisplay rating={ratingStats.averageRating} size="text-lg" />
//                         </div>
//                         <div className="text-2xl font-bold" style={{ color: "#FFD700" }}>
//                           {ratingStats.averageRating.toFixed(1)}
//                         </div>
//                         <div className="text-sm" style={{ color: "#999999" }}>
//                           Trust Score: {ratingStats.trustScore}
//                         </div>
//                       </div>

//                       {/* Rating Distribution */}
//                       <div className="space-y-2">
//                         {[5, 4, 3, 2, 1].map((star) => {
//                           const count = ratingStats.ratingDistribution[star] || 0;
//                           const percentage = ratingStats.totalRatings > 0
//                             ? (count / ratingStats.totalRatings) * 100
//                             : 0;

//                           return (
//                             <div key={star} className="flex items-center gap-3">
//                               <div className="flex items-center gap-1 w-12">
//                                 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                                 <span className="text-sm" style={{ color: "#999999" }}>{star}</span>
//                               </div>
//                               <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
//                                 <div
//                                   className="h-full rounded-full transition-all duration-500"
//                                   style={{
//                                     width: `${percentage}%`,
//                                     background: star >= 4 ? "#22c55e" : star >= 3 ? "#FFA05B" : "#ef4444"
//                                   }}
//                                 />
//                               </div>
//                               <div className="w-12 text-right">
//                                 <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                   {count}
//                                 </span>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>

//                       <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm" style={{ color: "#999999" }}>Total Ratings</span>
//                           <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                             {ratingStats.totalRatings}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No ratings available yet</p>
//                         <p className="text-xs mt-2">Customer ratings will appear here</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>

//               {/* Review Log Panel */}
//               <Panel title="Customer Reviews" icon={Star} accent="#FFD700" delay={1.0}>
//                 <div className="w-full h-[400px] min-h-[350px] flex-1 min-w-0">
//                   {reviewLogLoading ? (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="flex items-center gap-3">
//                         <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#FF6B35" }} />
//                         <span style={{ color: "#999999" }}>Loading reviews...</span>
//                       </div>
//                     </div>
//                   ) : reviewLog.length > 0 ? (
//                     <div className="h-full overflow-y-auto">
//                       <div className="space-y-3">
//                         {reviewLog.map((review, index) => (
//                           <div key={review._id || index} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
//                             <div className="flex items-center justify-between mb-2">
//                               <div className="flex items-center gap-2">
//                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: "rgba(255,107,53,0.2)", color: "#FF6B35" }}>
//                                   {review.userId?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
//                                 </div>
//                                 <div>
//                                   <div className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                     {review.userId?.name || 'Unknown User'}
//                                   </div>
//                                   <div className="text-xs" style={{ color: "#999999" }}>
//                                     {review.userId?.email || 'No email'}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 {[1,2,3,4,5].map(star => (
//                                   <Star
//                                     key={star}
//                                     className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                             <div className="flex items-center justify-between text-xs" style={{ color: "#666" }}>
//                               <span>Job: {review.jobId?.token || 'N/A'}</span>
//                               <span>{new Date(review.timestamp).toLocaleString()}</span>
//                             </div>
//                             {review.feedback && (
//                               <div className="mt-2 text-xs" style={{ color: "#999999", fontStyle: "italic" }}>
//                                 "{review.feedback}"
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>

//                       <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
//                         <div className="flex items-center justify-between text-sm">
//                           <span style={{ color: "#999999" }}>Showing latest {reviewLog.length} reviews</span>
//                           <button className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105" style={{ background: "rgba(255,107,53,0.1)", color: "#FF6B35" }}>
//                             View All Reviews
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex items-center justify-center">
//                       <div className="text-center" style={{ color: "#999999" }}>
//                         <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-sm">No customer reviews yet</p>
//                         <p className="text-xs mt-2">Customer reviews will appear here once ratings are submitted</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Panel>
//             </div>
//           </>
//         ) : (
//           // History Section
//           <>
//             {/* Daily Revenue Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="mb-8"
//             >
//               <div
//                 className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
//                 style={{
//                   background: "rgba(255,255,255,0.03)",
//                   backdropFilter: "blur(16px)",
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
//                 }}
//               >
//                 <div className="absolute top-0 left-0 right-0 h-[1px]"
//                   style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />

//                 <div className="relative z-10">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-3 rounded-xl"
//                         style={{ background: "rgba(255, 107, 53, 0.15)", border: "1px solid rgba(255, 107, 53, 0.3)" }}>
//                         <IndianRupee className="w-5 h-5" style={{ color: "#FF6B35" }} />
//                       </div>
//                       <div>
//                         <h3
//                           className="text-lg font-semibold"
//                           style={{
//                             color: "#EAEAEA",
//                             fontFamily: '"Clash Display", "Inter", sans-serif',
//                             fontWeight: 600
//                           }}
//                         >
//                           Today's Total Earnings
//                         </h3>
//                         <p className="text-sm" style={{ color: "#999999" }}>
//                           {dailyRevenue ? `From ${dailyRevenue.totalPrints} prints` : 'Loading...'}
//                         </p>
//                       </div>
//                     </div>

//                     {revenueLoading ? (
//                       <div className="animate-spin">
//                         <RefreshCw className="w-5 h-5" style={{ color: "#FF6B35" }} />
//                       </div>
//                     ) : dailyRevenue ? (
//                       <div className="text-right">
//                         <div
//                           className="text-2xl font-bold"
//                           style={{
//                             color: "#22c55e",
//                             fontFamily: '"Clash Display", "Inter", sans-serif',
//                             fontWeight: 700
//                           }}
//                         >
//                           {formatPrice(dailyRevenue.totalRevenue)}
//                         </div>
//                         <div className="flex items-center gap-2 text-xs" style={{ color: "#999999" }}>
//                           <span>{dailyRevenue.bwPages} B/W</span>
//                           <span>•</span>
//                           <span>{dailyRevenue.colorPages} Color</span>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="text-sm" style={{ color: "#999999" }}>
//                         No data available
//                       </div>
//                     )}
//                   </div>

//                   {dailyRevenue && (
//                     <div className="grid grid-cols-2 gap-4 mt-4">
//                       <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF8A50" }} />
//                           <span className="text-xs" style={{ color: "#999999" }}>B/W Revenue</span>
//                         </div>
//                         <div className="text-lg font-semibold" style={{ color: "#EAEAEA" }}>
//                           {formatPrice(dailyRevenue.breakdown.bwRevenue)}
//                         </div>
//                       </div>
//                       <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF6B35" }} />
//                           <span className="text-xs" style={{ color: "#999999" }}>Color Revenue</span>
//                         </div>
//                         <div className="text-lg font-semibold" style={{ color: "#EAEAEA" }}>
//                           {formatPrice(dailyRevenue.breakdown.colorRevenue)}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>

//             {/* Search and Filter Controls */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//               className="mb-6"
//             >
//               <div className="flex flex-col md:flex-row gap-4">
//                 {/* Search */}
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#999999" }} />
//                   <input
//                     type="text"
//                     placeholder="Search by filename, email, name, or token..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300"
//                     style={{
//                       background: "rgba(255,255,255,0.03)",
//                       border: "1px solid rgba(255,255,255,0.08)",
//                       color: "#EAEAEA",
//                       placeholderColor: "#999999"
//                     }}
//                   />
//                 </div>

//                 {/* Filter */}
//                 <div className="flex gap-2">
//                   {['all', 'B/W', 'Color'].map((type) => (
//                     <motion.button
//                       key={type}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setFilterType(type)}
//                       className="px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium"
//                       style={{
//                         background: filterType === type ? "rgba(255, 107, 53, 0.1)" : "rgba(255,255,255,0.03)",
//                         border: filterType === type ? "1px solid rgba(255, 107, 53, 0.2)" : "1px solid rgba(255,255,255,0.08)",
//                         color: filterType === type ? "#FF6B35" : "#999999"
//                       }}
//                     >
//                       {type === 'all' ? 'All Types' : type}
//                     </motion.button>
//                   ))}
//                 </div>

//                 {/* Auto-refresh Toggle */}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
//                   className="px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-2"
//                   style={{
//                     background: autoRefreshEnabled ? "rgba(34, 197, 94, 0.1)" : "rgba(255,255,255,0.03)",
//                     border: autoRefreshEnabled ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(255,255,255,0.08)",
//                     color: autoRefreshEnabled ? "#22c55e" : "#999999"
//                   }}
//                 >
//                   {autoRefreshEnabled ? (
//                     <>
//                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                       Auto-refresh ON
//                     </>
//                   ) : (
//                     <>
//                       <div className="w-2 h-2 rounded-full bg-gray-500" />
//                       Auto-refresh OFF
//                     </>
//                   )}
//                 </motion.button>

//                 {/* Refresh Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={fetchHistoryData}
//                   disabled={historyLoading}
//                   className="px-4 py-3 rounded-xl transition-all duration-300"
//                   style={{
//                     background: "rgba(255,255,255,0.03)",
//                     border: "1px solid rgba(255,255,255,0.08)",
//                     color: "#999999"
//                   }}
//                 >
//                   {historyLoading ? (
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <RefreshCw className="w-4 h-4" />
//                   )}
//                 </motion.button>
//               </div>

//               {/* Last Refresh Time */}
//               {lastRefreshTime && (
//                 <div className="flex items-center justify-between text-xs" style={{ color: "#666666" }}>
//                   <span>Last updated: {formatDateTime(lastRefreshTime)}</span>
//                   {autoRefreshEnabled && <span>Auto-refresh every 30 seconds</span>}
//                 </div>
//               )}
//             </motion.div>

//             {/* History Table */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//             >
//               <div
//                 className="relative backdrop-blur-xl border rounded-2xl overflow-hidden"
//                 style={{
//                   background: "rgba(255,255,255,0.03)",
//                   backdropFilter: "blur(16px)",
//                   border: "1px solid rgba(255,255,255,0.08)",
//                   boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
//                 }}
//               >
//                 <div className="absolute top-0 left-0 right-0 h-[1px]"
//                   style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />

//                 <div className="relative z-10 p-6">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 rounded-lg"
//                       style={{ background: "rgba(255, 107, 53, 0.15)", border: "1px solid rgba(255, 107, 53, 0.3)" }}>
//                       <ScrollText className="w-4 h-4" style={{ color: "#FF6B35" }} />
//                     </div>
//                     <h3
//                       className="text-lg font-semibold"
//                       style={{
//                         color: "#EAEAEA",
//                         fontFamily: '"Clash Display", "Inter", sans-serif',
//                         fontWeight: 600
//                       }}
//                     >
//                       Print History ({filteredHistory.length} records)
//                     </h3>
//                   </div>

//                   {/* Table Content */}
//                   <div className="overflow-x-auto">
//                     {historyLoading ? (
//                       <div className="flex items-center justify-center py-12">
//                         <div className="flex items-center gap-3">
//                           <RefreshCw className="w-5 h-5 animate-spin" style={{ color: "#FF6B35" }} />
//                           <span style={{ color: "#999999" }}>Loading print history...</span>
//                         </div>
//                       </div>
//                     ) : filteredHistory.length === 0 ? (
//                       <div className="flex flex-col items-center justify-center py-12">
//                         <ScrollText className="w-12 h-12 mb-4 opacity-50" style={{ color: "#999999" }} />
//                         <p className="text-lg font-medium mb-2" style={{ color: "#999999" }}>
//                           {searchTerm || filterType !== 'all' ? 'No matching records found' : 'No history available'}
//                         </p>
//                         <p className="text-sm" style={{ color: "#666666" }}>
//                           {searchTerm || filterType !== 'all'
//                             ? 'Try adjusting your search or filter criteria'
//                             : 'Print jobs will appear here once they are completed'
//                           }
//                         </p>
//                       </div>
//                     ) : (
//                       <table className="w-full">
//                         <thead>
//                           <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
//                             <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>File Name</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>User</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>Type</th>
//                             <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>Copies</th>
//                             <th className="text-right py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>Price</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>Status</th>
//                             <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#999999" }}>Time</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredHistory.map((item, index) => (
//                             <tr
//                               key={item.id}
//                               className="border-b transition-all duration-200 hover:bg-opacity-50"
//                               style={{
//                                 borderColor: "rgba(255,255,255,0.05)",
//                                 background: index % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"
//                               }}
//                             >
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2">
//                                   <File className="w-4 h-4" style={{ color: "#999999" }} />
//                                   <div>
//                                     <div className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                       {item.filename}
//                                     </div>
//                                     <div className="text-xs" style={{ color: "#666666" }}>
//                                       {item.token}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2">
//                                   <User className="w-4 h-4" style={{ color: "#999999" }} />
//                                   <div>
//                                     <div className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                       {item.userName}
//                                     </div>
//                                     <div className="text-xs" style={{ color: "#666666" }}>
//                                       {item.userEmail}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2">
//                                   <div
//                                     className="w-2 h-2 rounded-full"
//                                     style={{ backgroundColor: getPrintTypeColor(item.printType) }}
//                                   />
//                                   <span
//                                     className="text-sm font-medium"
//                                     style={{ color: getPrintTypeColor(item.printType) }}
//                                   >
//                                     {item.printType}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4 text-center">
//                                 <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
//                                   {item.copies}
//                                 </span>
//                               </td>
//                               <td className="py-3 px-4 text-right">
//                                 <span className="text-sm font-semibold" style={{ color: "#22c55e" }}>
//                                   {formatPrice(item.price)}
//                                 </span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2">
//                                   <div
//                                     className="w-2 h-2 rounded-full"
//                                     style={{ backgroundColor: getStatusColor(item.status) }}
//                                   />
//                                   <span
//                                     className="text-sm font-medium"
//                                     style={{ color: getStatusColor(item.status) }}
//                                   >
//                                     {item.status}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="text-xs" style={{ color: "#999999" }}>
//                                   {formatDateTime(item.timestamp)}
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//     );
//   } catch (error) {
//     console.error('Admin Dashboard Error:', error);
//     setComponentError(error);
//     return null;
//   }
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth, clearAuth, setAuth } from "../../services/authStorage";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Printer,
  BarChart2,
  ShieldCheck,
  LogOut,
  Cpu,
  LayoutDashboard,
  ScrollText,
  Search,
  Filter,
  Settings,
  Bell,
  TrendingUp,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Eye,
  IndianRupee,
  TrendingDown,
  User,
  File,
  Star,
  Mic, // [ADDED] for Voice Requests tab icon
} from "lucide-react";

/* ── Premium Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.68"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Subtle Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.3) 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.03,
    }}
  />
);

/* ── Soft Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{
      scale: [1, 1.1, 1.05, 1.15, 1],
      opacity: [0.08, 0.12, 0.1, 0.15, 0.08],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    }}
  />
);

/* ── Star Rating Display Component ── */
const StarRatingDisplay = ({ rating, size = "text-sm" }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className={`flex items-center gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= fullStars
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }`}
        />
      ))}
      <span className="ml-1 text-gray-300">{rating.toFixed(1)}</span>
    </div>
  );
};

/* ── Premium Stat Card ── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = "#FF6B35",
  delay = 0,
  children,
  trend,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
    }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-[1px]"
      style={{
        background: `linear-gradient(to right, ${accent}, transparent)`,
      }}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: "#999999", fontFamily: '"Inter", sans-serif' }}
          >
            {label}
          </span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <Activity className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div
        className="text-3xl font-bold mb-2"
        style={{
          color: "#EAEAEA",
          fontFamily: '"Clash Display", "Inter", sans-serif',
          fontWeight: 700,
        }}
      >
        {value}
      </div>
      {children}
    </div>
  </motion.div>
);

/* ── Premium Panel ── */
const Panel = ({
  title,
  icon: Icon,
  accent = "#FF6B35",
  delay = 0,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
    }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-[1px]"
      style={{
        background: `linear-gradient(to right, ${accent}, transparent)`,
      }}
    />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-lg"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <h3
          className="text-lg font-semibold"
          style={{
            color: "#EAEAEA",
            fontFamily: '"Clash Display", "Inter", sans-serif',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trustScore, setTrustScore] = useState(() =>
    typeof getAuth()?.trustScore === "number"
      ? getAuth().trustScore
      : auth?.trustScore || 0,
  );

  const [chartData, setChartData] = useState([]);
  const [tokenData, setTokenData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeRange, setTimeRange] = useState("day");

  const [chartsLoading, setChartsLoading] = useState(true);
  const [componentError, setComponentError] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [printHistory, setPrintHistory] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  const [ratingStats, setRatingStats] = useState(null);
  const [ratingStatsLoading, setRatingStatsLoading] = useState(false);

  const [reviewLog, setReviewLog] = useState([]);
  const [reviewLogLoading, setReviewLogLoading] = useState(false);

  // [ADDED] Voice requests state
  const [voiceRequests, setVoiceRequests] = useState([]);
  const [voiceRequestsLoading, setVoiceRequestsLoading] = useState(false);

  if (componentError) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#fff",
          background: "#1a1a1a",
          minHeight: "100vh",
        }}
      >
        <h1>Admin Dashboard Error</h1>
        <p>Something went wrong loading the dashboard:</p>
        <pre
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {componentError.toString()}
        </pre>
        <button
          onClick={() => setComponentError(null)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#FF6B35",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  async function fetchChartData() {
    setChartsLoading(true);
    try {
      const [statsRes, documentsRes, tokensRes, activityRes] = await Promise.all([
        api.get("/stats"),
        api.get("/documents"),
        api.get("/tokens"),
        api.get("/activity"),
      ]);

      // Use print data from stats API for print activity chart
      if (statsRes.data && statsRes.data.printsByDay) {
        const printData = statsRes.data.printsByDay;
        setChartData(printData.map(item => ({
          date: item.date,
          count: item.count
        })));
      } else {
        setChartData([]);
      }

      // Still use documents data for uploads chart
      if (documentsRes.data && Array.isArray(documentsRes.data)) {
        const documents = documentsRes.data;
        const uploadGroups = {};
        documents.forEach((doc) => {
          const date = new Date(doc.createdAt).toISOString().split("T")[0];
          if (!uploadGroups[date]) uploadGroups[date] = 0;
          uploadGroups[date]++;
        });
        const uploadChartData = Object.entries(uploadGroups)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        // Store upload data separately if needed
        console.log('Upload chart data:', uploadChartData);
      }

      if (tokensRes.data && Array.isArray(tokensRes.data)) {
        const tokens = tokensRes.data;
        const statusCounts = {
          waiting: tokens.filter((t) => t.status === "waiting").length,
          printing: tokens.filter((t) => t.status === "printing").length,
          completed: tokens.filter((t) => t.status === "completed").length,
          expired: tokens.filter((t) => t.status === "expired").length,
        };
        const statusChartData = [
          { name: "Waiting", value: statusCounts.waiting, color: "#FFA05B" },
          { name: "Printing", value: statusCounts.printing, color: "#FF8A50" },
          {
            name: "Completed",
            value: statusCounts.completed,
            color: "#22c55e",
          },
          { name: "Expired", value: statusCounts.expired, color: "#ef4444" },
        ];
        setStatusData(statusChartData);

        const tokenGroups = {};
        tokens.forEach((token) => {
          const date = new Date(token.createdAt).toISOString().split("T")[0];
          if (!tokenGroups[date]) tokenGroups[date] = 0;
          tokenGroups[date]++;
        });
        const tokenChartData = Object.entries(tokenGroups)
          .map(([date, tokens]) => ({ date, tokens }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setTokenData(tokenChartData);
      } else {
        setStatusData([]);
        setTokenData([]);
      }

      if (activityRes.data && Array.isArray(activityRes.data)) {
        setRecentActivity(activityRes.data);
      } else {
        setRecentActivity([]);
      }
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      setChartData([]);
      setTokenData([]);
      setStatusData([]);
      setRecentActivity([]);
    } finally {
      setChartsLoading(false);
    }
  }

  async function fetchRatingStats() {
    setRatingStatsLoading(true);
    try {
      const testToken = "test_admin_token_1775028546379";
      const res = await api.get("/rate/stats", {
        headers: { Authorization: `Bearer ${testToken}` },
      });
      setRatingStats(res.data);
    } catch (err) {
      console.error("Failed to fetch rating stats:", err);
      setRatingStats(null);
    } finally {
      setRatingStatsLoading(false);
    }
  }

  async function fetchReviewLog() {
    setReviewLogLoading(true);
    try {
      const testToken = "test_admin_token_1775028546379";
      const res = await api.get("/rate/reviews", {
        headers: { Authorization: `Bearer ${testToken}` },
      });
      setReviewLog(res.data.ratings || []);
    } catch (err) {
      console.error("Failed to fetch review log:", err);
      setReviewLog([]);
    } finally {
      setReviewLogLoading(false);
    }
  }

  // [ADDED] Fetch voice requests from backend
  async function fetchVoiceRequests() {
    setVoiceRequestsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/voice-requests", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await res.json();
      setVoiceRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load voice requests:", err);
      setVoiceRequests([]);
    } finally {
      setVoiceRequestsLoading(false);
    }
  }

  // [ADDED] Update voice request status (printed / rejected)
  async function updateVoiceRequestStatus(id, status) {
    try {
      await fetch(`http://localhost:5000/api/voice-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchVoiceRequests();
    } catch (err) {
      console.error("Failed to update voice request:", err);
    }
  }

  // UNTOUCHED — original polling effect
  useEffect(() => {
    fetchChartData();
    fetchRatingStats();
    fetchReviewLog();
    const interval = setInterval(fetchChartData, 10000);
    const ratingInterval = setInterval(fetchRatingStats, 30000);
    const reviewInterval = setInterval(fetchReviewLog, 60000);
    return () => {
      clearInterval(interval);
      clearInterval(ratingInterval);
      clearInterval(reviewInterval);
    };
  }, []);

  async function fetchHistoryData() {
    setHistoryLoading(true);
    setRevenueLoading(true);
    try {
      const testToken = "test_admin_token_1775028546379";
      const [historyRes, revenueRes] = await Promise.all([
        api.get("/print-history", {
          headers: { Authorization: `Bearer ${testToken}` },
        }),
        api.get("/daily-revenue", {
          headers: { Authorization: `Bearer ${testToken}` },
        }),
      ]);
      setPrintHistory(historyRes.data || []);
      setDailyRevenue(revenueRes.data || null);
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error("Failed to fetch history data:", err);
      setPrintHistory([]);
      setDailyRevenue(null);
    } finally {
      setHistoryLoading(false);
      setRevenueLoading(false);
    }
  }

  // [MODIFIED] Extended to include voiceRequests tab — history block is UNTOUCHED
  useEffect(() => {
    if (activeTab === "history" && autoRefreshEnabled) {
      fetchHistoryData();
      const interval = setInterval(fetchHistoryData, 30000);
      return () => clearInterval(interval);
    }
    // [ADDED] Voice requests polling block
    if (activeTab === "voiceRequests") {
      fetchVoiceRequests();
      const interval = setInterval(fetchVoiceRequests, 15000);
      return () => clearInterval(interval);
    }
  }, [activeTab, autoRefreshEnabled]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg border"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            border: "1px solid rgba(255, 107, 53, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          {label && (
            <p
              className="text-xs font-medium mb-1"
              style={{ color: "#999999" }}
            >
              {label}
            </p>
          )}
          {payload.map((entry, index) => {
            const safeName = entry.name || entry.dataKey || "Unknown";
            const safeValue =
              typeof entry.value === "object"
                ? JSON.stringify(entry.value)
                : entry.value;
            return (
              <p
                key={index}
                className="text-sm font-semibold"
                style={{ color: "#EAEAEA" }}
              >
                {safeName}: {safeValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  async function loadStats() {
    setError("");
    setLoading(true);
    try {
      const testToken = "test_admin_token_1775028546379";
      const res = await api.get("/stats", {
        headers: { Authorization: `Bearer ${testToken}` },
      });
      setStats(res.data);
      if (typeof res.data?.trustScore === "number") {
        setTrustScore(res.data.trustScore);
        const currentAuth = getAuth();
        setAuth({ ...currentAuth, trustScore: res.data.trustScore });
      }
    } catch (err) {
      console.log(err);
      console.warn("API failed, using fallback.");
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(
        localStorage.getItem("privyprint_local_stats") || "{}",
      );
      const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      setStats((prev) => ({
        ...prev,
        totalPrints: dayStats.total,
        printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
      }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
    const syncData = () => {
      const next = getAuth()?.trustScore;
      if (typeof next === "number") setTrustScore(next);
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(
        localStorage.getItem("privyprint_local_stats") || "{}",
      );
      const dayStats = allStats[today];
      if (dayStats) {
        setStats((prev) => ({
          ...prev,
          totalPrints: dayStats.total,
          printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
        }));
      }
    };
    window.addEventListener("storage", syncData);
    window.addEventListener("localStatsUpdated", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("localStatsUpdated", syncData);
    };
  }, []);

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  const trustColor = trustScore > 60 ? "#FF6B35" : "#FF6B35";

  const filteredHistory = printHistory.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.token.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.printType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price, currency = "₹") => `${currency}${price}`;

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "Printed":
        return "#22c55e";
      case "Pending":
        return "#FFA05B";
      case "Failed":
        return "#ef4444";
      default:
        return "#999999";
    }
  };

  const getPrintTypeColor = (type) => (type === "B/W" ? "#FF8A50" : "#FF6B35");

  // [ADDED] Helper for voice request status badge styling
  const getVoiceStatusStyle = (status) => {
    if (status === "printed")
      return {
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.3)",
        text: "#22c55e",
      };
    if (status === "rejected")
      return {
        bg: "rgba(239,68,68,0.1)",
        border: "rgba(239,68,68,0.3)",
        text: "#ef4444",
      };
    return {
      bg: "rgba(255,107,53,0.1)",
      border: "rgba(255,107,53,0.3)",
      text: "#FF6B35",
    };
  };

  try {
    return (
      <div
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* [REMOVED] stray <button onClick={() => navigate("/admin/voice-requests")}> that was here */}

        <NoiseSVG />
        <GridDots />
        <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
        <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />

        {/* ── Sidebar ── UNTOUCHED except Voice Requests nav item added */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 h-full w-64 z-20"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: "rgba(255, 107, 53, 0.15)",
                  border: "1px solid rgba(255, 107, 53, 0.3)",
                }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: "#FF6B35" }} />
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  Admin
                </h1>
                <p className="text-xs" style={{ color: "#999999" }}>
                  PrivyPrint
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {/* Dashboard — UNTOUCHED */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background:
                    activeTab === "dashboard"
                      ? "rgba(255, 107, 53, 0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    activeTab === "dashboard"
                      ? "1px solid rgba(255, 107, 53, 0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === "dashboard" ? "#FF6B35" : "#999999",
                }}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </motion.button>

              {/* History — UNTOUCHED */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("history")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background:
                    activeTab === "history"
                      ? "rgba(255, 107, 53, 0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    activeTab === "history"
                      ? "1px solid rgba(255, 107, 53, 0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === "history" ? "#FF6B35" : "#999999",
                }}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">History</span>
              </motion.button>

              {/* Print Panel — UNTOUCHED */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/print")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Printer className="w-4 h-4" />
                <span className="text-sm font-medium">Print Panel</span>
              </motion.button>

              {/* Print Logs — UNTOUCHED */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/logs")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <ScrollText className="w-4 h-4" />
                <span className="text-sm font-medium">Print Logs</span>
              </motion.button>

              {/* [ADDED] Voice Requests nav button */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("voiceRequests")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background:
                    activeTab === "voiceRequests"
                      ? "rgba(255, 107, 53, 0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    activeTab === "voiceRequests"
                      ? "1px solid rgba(255, 107, 53, 0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === "voiceRequests" ? "#FF6B35" : "#999999",
                }}
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">Voice Requests</span>
                {/* [ADDED] Live badge showing pending count */}
                {voiceRequests.filter((r) => r.status === "pending").length >
                  0 && (
                  <span
                    className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,107,53,0.2)",
                      color: "#FF6B35",
                      border: "1px solid rgba(255,107,53,0.3)",
                    }}
                  >
                    {voiceRequests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </motion.button>
            </nav>

            {/* Logout — UNTOUCHED */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="ml-64 p-8">
          {/* Top Bar — UNTOUCHED except title/subtitle extended for new tab */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{
                  color: "#EAEAEA",
                  fontFamily: '"Clash Display", "Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                {/* [MODIFIED] Added voiceRequests case — dashboard/history cases UNTOUCHED */}
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "history"
                    ? "History"
                    : "Voice Requests"}
              </h1>
              <p style={{ color: "#999999" }}>
                {activeTab === "dashboard"
                  ? `Welcome back, ${auth?.name || "Admin"}`
                  : activeTab === "history"
                    ? "Track uploads, tokens, and prints by date"
                    : "Voice print requests from customers"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Tab Content ── */}
          {activeTab === "dashboard" ? (
            /* ════════════════════════════════════════
               DASHBOARD TAB — 100% UNTOUCHED
            ════════════════════════════════════════ */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats?.totalUsers || "0"}
                  accent="#FF6B35"
                  delay={0.1}
                />
                <StatCard
                  icon={Printer}
                  label="Total Prints"
                  value={stats?.totalPrints || "0"}
                  accent="#FF8A50"
                  delay={0.2}
                />
                <StatCard
                  icon={FileText}
                  label="Active Tokens"
                  value={
                    statusData.reduce((sum, item) => sum + item.value, 0) || "0"
                  }
                  accent="#FFA05B"
                  delay={0.3}
                />
                <StatCard
                  icon={ShieldCheck}
                  label="Trust Score"
                  value={trustScore}
                  accent="#FF6B35"
                  delay={0.4}
                >
                  {ratingStats && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "#999999" }}>
                          Avg Rating
                        </span>
                        <StarRatingDisplay
                          rating={ratingStats.averageRating || 0}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "#999999" }}>
                          Total Ratings
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#EAEAEA" }}
                        >
                          {ratingStats.totalRatings || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </StatCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Panel
                  title="Uploads Over Time"
                  icon={BarChart2}
                  accent="#FF6B35"
                  delay={0.5}
                >
                  <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString()
                            }
                          />
                          <YAxis
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#FF6B35"
                            strokeWidth={3}
                            dot={{ fill: "#FF6B35", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  title="Tokens Generated Per Day"
                  icon={FileText}
                  accent="#FF8A50"
                  delay={0.6}
                >
                  <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
                    {tokenData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tokenData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.05)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                            tickFormatter={(value) =>
                              new Date(value).toLocaleDateString()
                            }
                          />
                          <YAxis
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar
                            dataKey="tokens"
                            fill="#FF8A50"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No token data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel
                  title="Token Status Distribution"
                  icon={Activity}
                  accent="#FFA05B"
                  delay={0.7}
                >
                  <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
                    {statusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{
                              paddingTop: "20px",
                              color: "#999999",
                            }}
                            formatter={(value, name) => {
                              const safeName =
                                typeof name === "object"
                                  ? name?.name || "Unknown"
                                  : name;
                              const item = statusData.find(
                                (d) => d.name === safeName,
                              );
                              return (
                                <span style={{ color: "#EAEAEA" }}>
                                  {safeName}: {item?.value || 0}
                                </span>
                              );
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No status data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  title="Recent Activity"
                  icon={Activity}
                  accent="#FF8A50"
                  delay={0.8}
                >
                  <div className="w-full h-[300px] min-h-[250px] overflow-y-auto flex-1 min-w-0">
                    {recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.slice(0, 5).map((activity, index) => {
                          const getActivityIcon = (type) => {
                            switch (type) {
                              case "upload":
                                return (
                                  <FileText className="w-4 h-4 text-green-400" />
                                );
                              case "print":
                                return (
                                  <Printer className="w-4 h-4 text-blue-400" />
                                );
                              default:
                                return (
                                  <Activity className="w-4 h-4 text-gray-400" />
                                );
                            }
                          };
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ background: "rgba(255,255,255,0.03)" }}
                            >
                              {getActivityIcon(activity.type)}
                              <div className="flex-1">
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#EAEAEA" }}
                                >
                                  {activity.message}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#999999" }}
                                >
                                  {new Date(
                                    activity.timestamp,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No recent activity</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  title="Customer Ratings"
                  icon={Star}
                  accent="#FFD700"
                  delay={0.9}
                >
                  <div className="w-full h-[300px] min-h-[250px] flex-1 min-w-0">
                    {ratingStatsLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          <RefreshCw
                            className="w-5 h-5 animate-spin"
                            style={{ color: "#FF6B35" }}
                          />
                          <span style={{ color: "#999999" }}>
                            Loading rating data...
                          </span>
                        </div>
                      </div>
                    ) : ratingStats && ratingStats.totalRatings > 0 ? (
                      <div className="space-y-4">
                        <div
                          className="text-center p-4 rounded-xl"
                          style={{ background: "rgba(255,215,0,0.1)" }}
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <StarRatingDisplay
                              rating={ratingStats.averageRating}
                              size="text-lg"
                            />
                          </div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: "#FFD700" }}
                          >
                            {ratingStats.averageRating.toFixed(1)}
                          </div>
                          <div className="text-sm" style={{ color: "#999999" }}>
                            Trust Score: {ratingStats.trustScore}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count =
                              ratingStats.ratingDistribution[star] || 0;
                            const percentage =
                              ratingStats.totalRatings > 0
                                ? (count / ratingStats.totalRatings) * 100
                                : 0;
                            return (
                              <div
                                key={star}
                                className="flex items-center gap-3"
                              >
                                <div className="flex items-center gap-1 w-12">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span
                                    className="text-sm"
                                    style={{ color: "#999999" }}
                                  >
                                    {star}
                                  </span>
                                </div>
                                <div
                                  className="flex-1 h-6 rounded-full overflow-hidden"
                                  style={{
                                    background: "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${percentage}%`,
                                      background:
                                        star >= 4
                                          ? "#22c55e"
                                          : star >= 3
                                            ? "#FFA05B"
                                            : "#ef4444",
                                    }}
                                  />
                                </div>
                                <div className="w-12 text-right">
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#EAEAEA" }}
                                  >
                                    {count}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div
                          className="pt-2 border-t"
                          style={{ borderColor: "rgba(255,255,255,0.1)" }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm"
                              style={{ color: "#999999" }}
                            >
                              Total Ratings
                            </span>
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#EAEAEA" }}
                            >
                              {ratingStats.totalRatings}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No ratings available yet</p>
                          <p className="text-xs mt-2">
                            Customer ratings will appear here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  title="Customer Reviews"
                  icon={Star}
                  accent="#FFD700"
                  delay={1.0}
                >
                  <div className="w-full h-[400px] min-h-[350px] flex-1 min-w-0">
                    {reviewLogLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="flex items-center gap-3">
                          <RefreshCw
                            className="w-5 h-5 animate-spin"
                            style={{ color: "#FF6B35" }}
                          />
                          <span style={{ color: "#999999" }}>
                            Loading reviews...
                          </span>
                        </div>
                      </div>
                    ) : reviewLog.length > 0 ? (
                      <div className="h-full overflow-y-auto">
                        <div className="space-y-3">
                          {reviewLog.map((review, index) => (
                            <div
                              key={review._id || index}
                              className="p-3 rounded-xl"
                              style={{ background: "rgba(255,255,255,0.03)" }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                                    style={{
                                      background: "rgba(255,107,53,0.2)",
                                      color: "#FF6B35",
                                    }}
                                  >
                                    {review.userId?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <div
                                      className="text-sm font-medium"
                                      style={{ color: "#EAEAEA" }}
                                    >
                                      {review.userId?.name || "Unknown User"}
                                    </div>
                                    <div
                                      className="text-xs"
                                      style={{ color: "#999999" }}
                                    >
                                      {review.userId?.email || "No email"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div
                                className="flex items-center justify-between text-xs"
                                style={{ color: "#666" }}
                              >
                                <span>Job: {review.jobId?.token || "N/A"}</span>
                                <span>
                                  {new Date(review.timestamp).toLocaleString()}
                                </span>
                              </div>
                              {review.feedback && (
                                <div
                                  className="mt-2 text-xs"
                                  style={{
                                    color: "#999999",
                                    fontStyle: "italic",
                                  }}
                                >
                                  "{review.feedback}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div
                          className="mt-4 pt-3 border-t"
                          style={{ borderColor: "rgba(255,255,255,0.1)" }}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span style={{ color: "#999999" }}>
                              Showing latest {reviewLog.length} reviews
                            </span>
                            <button
                              className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                              style={{
                                background: "rgba(255,107,53,0.1)",
                                color: "#FF6B35",
                              }}
                            >
                              View All Reviews
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div
                          className="text-center"
                          style={{ color: "#999999" }}
                        >
                          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">No customer reviews yet</p>
                          <p className="text-xs mt-2">
                            Customer reviews will appear here once ratings are
                            submitted
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </div>
            </>
          ) : activeTab === "history" ? (
            /* ════════════════════════════════════════
               HISTORY TAB — 100% UNTOUCHED
            ════════════════════════════════════════ */
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div
                  className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(to right, #FF6B35, transparent)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-xl"
                          style={{
                            background: "rgba(255, 107, 53, 0.15)",
                            border: "1px solid rgba(255, 107, 53, 0.3)",
                          }}
                        >
                          <IndianRupee
                            className="w-5 h-5"
                            style={{ color: "#FF6B35" }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-semibold"
                            style={{
                              color: "#EAEAEA",
                              fontFamily:
                                '"Clash Display", "Inter", sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            Today's Total Earnings
                          </h3>
                          <p className="text-sm" style={{ color: "#999999" }}>
                            {dailyRevenue
                              ? `From ${dailyRevenue.totalPrints} prints`
                              : "Loading..."}
                          </p>
                        </div>
                      </div>
                      {revenueLoading ? (
                        <div className="animate-spin">
                          <RefreshCw
                            className="w-5 h-5"
                            style={{ color: "#FF6B35" }}
                          />
                        </div>
                      ) : dailyRevenue ? (
                        <div className="text-right">
                          <div
                            className="text-2xl font-bold"
                            style={{
                              color: "#22c55e",
                              fontFamily:
                                '"Clash Display", "Inter", sans-serif',
                              fontWeight: 700,
                            }}
                          >
                            {formatPrice(dailyRevenue.totalRevenue)}
                          </div>
                          <div
                            className="flex items-center gap-2 text-xs"
                            style={{ color: "#999999" }}
                          >
                            <span>{dailyRevenue.bwPages} B/W</span>
                            <span>•</span>
                            <span>{dailyRevenue.colorPages} Color</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm" style={{ color: "#999999" }}>
                          No data available
                        </div>
                      )}
                    </div>
                    {dailyRevenue && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div
                          className="p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#FF8A50" }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "#999999" }}
                            >
                              B/W Revenue
                            </span>
                          </div>
                          <div
                            className="text-lg font-semibold"
                            style={{ color: "#EAEAEA" }}
                          >
                            {formatPrice(dailyRevenue.breakdown.bwRevenue)}
                          </div>
                        </div>
                        <div
                          className="p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#FF6B35" }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "#999999" }}
                            >
                              Color Revenue
                            </span>
                          </div>
                          <div
                            className="text-lg font-semibold"
                            style={{ color: "#EAEAEA" }}
                          >
                            {formatPrice(dailyRevenue.breakdown.colorRevenue)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#999999" }}
                    />
                    <input
                      type="text"
                      placeholder="Search by filename, email, name, or token..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#EAEAEA",
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "B/W", "Color"].map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFilterType(type)}
                        className="px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium"
                        style={{
                          background:
                            filterType === type
                              ? "rgba(255, 107, 53, 0.1)"
                              : "rgba(255,255,255,0.03)",
                          border:
                            filterType === type
                              ? "1px solid rgba(255, 107, 53, 0.2)"
                              : "1px solid rgba(255,255,255,0.08)",
                          color: filterType === type ? "#FF6B35" : "#999999",
                        }}
                      >
                        {type === "all" ? "All Types" : type}
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                    className="px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium flex items-center gap-2"
                    style={{
                      background: autoRefreshEnabled
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(255,255,255,0.03)",
                      border: autoRefreshEnabled
                        ? "1px solid rgba(34, 197, 94, 0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                      color: autoRefreshEnabled ? "#22c55e" : "#999999",
                    }}
                  >
                    {autoRefreshEnabled ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Auto-refresh ON
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-gray-500" />
                        Auto-refresh OFF
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchHistoryData}
                    disabled={historyLoading}
                    className="px-4 py-3 rounded-xl transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#999999",
                    }}
                  >
                    {historyLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                {lastRefreshTime && (
                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "#666666" }}
                  >
                    <span>Last updated: {formatDateTime(lastRefreshTime)}</span>
                    {autoRefreshEnabled && (
                      <span>Auto-refresh every 30 seconds</span>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div
                  className="relative backdrop-blur-xl border rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(to right, #FF6B35, transparent)",
                    }}
                  />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: "rgba(255, 107, 53, 0.15)",
                          border: "1px solid rgba(255, 107, 53, 0.3)",
                        }}
                      >
                        <ScrollText
                          className="w-4 h-4"
                          style={{ color: "#FF6B35" }}
                        />
                      </div>
                      <h3
                        className="text-lg font-semibold"
                        style={{
                          color: "#EAEAEA",
                          fontFamily: '"Clash Display", "Inter", sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Print History ({filteredHistory.length} records)
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      {historyLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex items-center gap-3">
                            <RefreshCw
                              className="w-5 h-5 animate-spin"
                              style={{ color: "#FF6B35" }}
                            />
                            <span style={{ color: "#999999" }}>
                              Loading print history...
                            </span>
                          </div>
                        </div>
                      ) : filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <ScrollText
                            className="w-12 h-12 mb-4 opacity-50"
                            style={{ color: "#999999" }}
                          />
                          <p
                            className="text-lg font-medium mb-2"
                            style={{ color: "#999999" }}
                          >
                            {searchTerm || filterType !== "all"
                              ? "No matching records found"
                              : "No history available"}
                          </p>
                          <p className="text-sm" style={{ color: "#666666" }}>
                            {searchTerm || filterType !== "all"
                              ? "Try adjusting your search or filter criteria"
                              : "Print jobs will appear here once they are completed"}
                          </p>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr
                              className="border-b"
                              style={{ borderColor: "rgba(255,255,255,0.08)" }}
                            >
                              {[
                                "File Name",
                                "User",
                                "Type",
                                "Pages",
                                "Copies",
                                "Price",
                                "Status",
                                "Time",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className={`${(h === "Copies" || h === "Pages") ? "text-center" : h === "Price" ? "text-right" : "text-left"} py-3 px-4 text-sm font-medium`}
                                  style={{ color: "#999999" }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHistory.map((item, index) => (
                              <tr
                                key={item.id}
                                className="border-b transition-all duration-200"
                                style={{
                                  borderColor: "rgba(255,255,255,0.05)",
                                  background:
                                    index % 2 === 0
                                      ? "rgba(255,255,255,0.01)"
                                      : "transparent",
                                }}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <File
                                      className="w-4 h-4"
                                      style={{ color: "#999999" }}
                                    />
                                    <div>
                                      <div
                                        className="text-sm font-medium"
                                        style={{ color: "#EAEAEA" }}
                                      >
                                        {item.filename}
                                      </div>
                                      <div
                                        className="text-xs"
                                        style={{ color: "#666666" }}
                                      >
                                        {item.token}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <User
                                      className="w-4 h-4"
                                      style={{ color: "#999999" }}
                                    />
                                    <div>
                                      <div
                                        className="text-sm font-medium"
                                        style={{ color: "#EAEAEA" }}
                                      >
                                        {item.userName}
                                      </div>
                                      <div
                                        className="text-xs"
                                        style={{ color: "#666666" }}
                                      >
                                        {item.userEmail}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: getPrintTypeColor(
                                          item.printType,
                                        ),
                                      }}
                                    />
                                    <span
                                      className="text-sm font-medium"
                                      style={{
                                        color: getPrintTypeColor(
                                          item.printType,
                                        ),
                                      }}
                                    >
                                      {item.printType}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#EAEAEA" }}
                                  >
                                    {item.pages}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#EAEAEA" }}
                                  >
                                    {item.copies}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span
                                    className="text-sm font-semibold"
                                    style={{ color: "#22c55e" }}
                                  >
                                    {formatPrice(item.price)}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: getStatusColor(
                                          item.status,
                                        ),
                                      }}
                                    />
                                    <span
                                      className="text-sm font-medium"
                                      style={{
                                        color: getStatusColor(item.status),
                                      }}
                                    >
                                      {item.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className="text-xs"
                                    style={{ color: "#999999" }}
                                  >
                                    {formatDateTime(item.timestamp)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : activeTab === "voiceRequests" ? (
            /* ════════════════════════════════════════
               [ADDED] VOICE REQUESTS TAB
            ════════════════════════════════════════ */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div
                className="relative backdrop-blur-xl border rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{
                    background:
                      "linear-gradient(to right, #FF6B35, transparent)",
                  }}
                />

                <div className="relative z-10 p-6">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: "rgba(255,107,53,0.15)",
                          border: "1px solid rgba(255,107,53,0.3)",
                        }}
                      >
                        <Mic className="w-4 h-4" style={{ color: "#FF6B35" }} />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: "#EAEAEA",
                            fontFamily: '"Clash Display", "Inter", sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          Voice Print Requests
                        </h3>
                        <p className="text-xs" style={{ color: "#999999" }}>
                          {
                            voiceRequests.filter((r) => r.status === "pending")
                              .length
                          }{" "}
                          pending · {voiceRequests.length} total ·
                          auto-refreshes every 15s
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fetchVoiceRequests}
                      className="p-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#999999",
                      }}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${voiceRequestsLoading ? "animate-spin" : ""}`}
                      />
                    </motion.button>
                  </div>

                  {/* Body */}
                  {voiceRequestsLoading && voiceRequests.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                      <div
                        className="flex items-center gap-3"
                        style={{ color: "#999999" }}
                      >
                        <RefreshCw
                          className="w-5 h-5 animate-spin"
                          style={{ color: "#FF6B35" }}
                        />
                        <span>Loading voice requests…</span>
                      </div>
                    </div>
                  ) : voiceRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Mic
                        className="w-14 h-14 mb-4 opacity-20"
                        style={{ color: "#FF6B35" }}
                      />
                      <p
                        className="text-lg font-medium mb-2"
                        style={{ color: "#999999" }}
                      >
                        No voice requests yet
                      </p>
                      <p className="text-sm" style={{ color: "#666666" }}>
                        Requests appear here when customers use the Voice Print
                        feature
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {voiceRequests.map((req) => {
                        const s = getVoiceStatusStyle(req.status);
                        const isPending = req.status === "pending";
                        return (
                          <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start justify-between gap-4 p-4 rounded-xl"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {/* Left — token + transcript + time */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[10px] font-black uppercase tracking-widest"
                                  style={{ color: "#999999" }}
                                >
                                  Token
                                </span>
                                <span
                                  className="text-lg font-black tracking-widest"
                                  style={{ color: "#EAEAEA" }}
                                >
                                  {req.token}
                                </span>
                              </div>
                              {req.transcript && (
                                <p
                                  className="text-sm italic truncate"
                                  style={{ color: "#999999" }}
                                >
                                  "{req.transcript}"
                                </p>
                              )}
                              <div className="flex items-center gap-1 mt-1">
                                <Clock
                                  className="w-3 h-3"
                                  style={{ color: "#666666" }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#666666" }}
                                >
                                  {new Date(req.requestedAt).toLocaleString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Right — badge + actions */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <span
                                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                style={{
                                  background: s.bg,
                                  border: `1px solid ${s.border}`,
                                  color: s.text,
                                }}
                              >
                                {req.status}
                              </span>
                              {isPending && (
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateVoiceRequestStatus(
                                        req._id,
                                        "printed",
                                      )
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                    style={{
                                      background: "rgba(34,197,94,0.1)",
                                      border: "1px solid rgba(34,197,94,0.3)",
                                      color: "#22c55e",
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3" /> Mark
                                    Printed
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateVoiceRequestStatus(
                                        req._id,
                                        "rejected",
                                      )
                                    }
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                    style={{
                                      background: "rgba(239,68,68,0.1)",
                                      border: "1px solid rgba(239,68,68,0.3)",
                                      color: "#ef4444",
                                    }}
                                  >
                                    <AlertCircle className="w-3 h-3" /> Reject
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    setComponentError(error);
    return null;
  }
}
