import { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  FileText, 
  Printer, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  X,
  Filter,
  Search
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyData, setHistoryData] = useState([]);
  const [activityDates, setActivityDates] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'uploads', 'tokens', 'prints'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from backend
  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      // TEMPORARY: Use test token for dashboard testing
      const testToken = "test_admin_token_1775028546379";
      const [documentsRes, logsRes] = await Promise.all([
        fetch('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${testToken}` }
        }),
        fetch('http://localhost:5000/api/logs', {
          headers: { Authorization: `Bearer ${testToken}` }
        })
      ]);

      const documents = await documentsRes.json();
      const logs = await logsRes.json();

      // Process data and mark activity dates
      const activitySet = new Set();
      const allData = [];

      // Process documents (uploads/tokens)
      documents.forEach(doc => {
        const date = new Date(doc.createdAt).toDateString();
        activitySet.add(date);
        allData.push({
          id: doc._id,
          type: 'upload',
          fileName: doc.fileUrl.split('/').pop() || 'Unknown file',
          date: doc.createdAt,
          token: doc.token,
          status: doc.status,
          copies: doc.copies,
          documentType: doc.type
        });
      });

      // Process logs (prints)
      logs.forEach(log => {
        const date = new Date(log.time).toDateString();
        activitySet.add(date);
        allData.push({
          id: log._id,
          type: 'print',
          fileName: `Print Job - ${log.token}`,
          date: log.time,
          token: log.token,
          status: 'completed'
        });
      });

      setActivityDates(activitySet);
      setHistoryData(allData);
    } catch (error) {
      console.error('Failed to fetch history data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = historyData;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected date
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString();
      filtered = filtered.filter(item => 
        new Date(item.date).toDateString() === selectedDateStr
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [historyData, filter, searchTerm, selectedDate]);

  // Custom tile content for activity indicators
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      const hasActivity = activityDates.has(dateStr);
      
      if (hasActivity) {
        return (
          <div className="relative">
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class for styling
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      const hasActivity = activityDates.has(dateStr);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      let classes = [];
      
      if (isSelected) {
        classes.push('react-calendar__tile--selected');
      }
      
      if (hasActivity) {
        classes.push('has-activity');
      }
      
      return classes.join(' ');
    }
    return '';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowHistoryPanel(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'printing':
        return <Printer className="w-4 h-4 text-blue-400" />;
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upload':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'print':
        return <Printer className="w-4 h-4 text-green-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl"
            style={{ background: "rgba(255, 107, 53, 0.15)", border: "1px solid rgba(255, 107, 53, 0.3)" }}>
            <CalendarIcon className="w-5 h-5" style={{ color: "#FF6B35" }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#EAEAEA", fontFamily: '"Clash Display", "Inter", sans-serif' }}>
              Activity Calendar
            </h2>
            <p className="text-sm" style={{ color: "#999999" }}>Track uploads, tokens, and prints</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />
            
            <style jsx>{`
              .react-calendar {
                background: transparent;
                border: none;
                font-family: 'Inter', sans-serif;
                color: #EAEAEA;
              }
              
              .react-calendar__navigation {
                display: flex;
                height: 44px;
                margin-bottom: 1em;
              }
              
              .react-calendar__navigation button {
                color: #EAEAEA !important;
                background: rgba(255,255,255,0.05) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-radius: 8px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
              }
              
              .react-calendar__navigation button:enabled:hover,
              .react-calendar__navigation button:enabled:focus {
                background: rgba(255, 107, 53, 0.2) !important;
                border-color: rgba(255, 107, 53, 0.4) !important;
              }
              
              .react-calendar__month-view__weekdays {
                text-align: center;
                text-transform: uppercase;
                font-weight: 500;
                font-size: 0.75em;
                color: #999999 !important;
                margin-bottom: 0.5em;
              }
              
              .react-calendar__month-view__weekdays__weekday {
                padding: 0.5em;
              }
              
              .react-calendar__month-view__days__day {
                position: relative;
                background: rgba(255,255,255,0.02) !important;
                border: 1px solid rgba(255,255,255,0.05) !important;
                border-radius: 8px !important;
                color: #EAEAEA !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                min-height: 40px !important;
                aspect-ratio: 1 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s ease !important;
              }
              
              .react-calendar__month-view__days__day:hover {
                background: rgba(255, 107, 53, 0.1) !important;
                border-color: rgba(255, 107, 53, 0.3) !important;
                transform: scale(1.05) !important;
              }
              
              .react-calendar__month-view__days__day--active {
                background: rgba(255, 107, 53, 0.2) !important;
                border-color: rgba(255, 107, 53, 0.4) !important;
                color: #FF6B35 !important;
                font-weight: 600 !important;
              }
              
              .react-calendar__month-view__days__day--selected {
                background: rgba(255, 107, 53, 0.3) !important;
                border-color: #FF6B35 !important;
                color: #FF6B35 !important;
                font-weight: 600 !important;
                box-shadow: 0 0 20px rgba(255, 107, 53, 0.3) !important;
              }
              
              .react-calendar__month-view__days__day--neighboringMonth {
                color: #666666 !important;
                opacity: 0.5 !important;
              }
              
              .react-calendar__month-view__days__day.has-activity {
                background: rgba(255, 107, 53, 0.05) !important;
                border-color: rgba(255, 107, 53, 0.2) !important;
              }
              
              .react-calendar__tile {
                padding: 0.5em 0.5em !important;
              }
              
              .react-calendar__tile:enabled:hover,
              .react-calendar__tile:enabled:focus {
                background: rgba(255, 107, 53, 0.1) !important;
              }
            `}</style>
            
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Stats Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FF8A50, transparent)" }} />
            
            <h3 className="text-lg font-semibold mb-4" style={{ color: "#EAEAEA", fontFamily: '"Clash Display", "Inter", sans-serif' }}>
              Activity Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-sm" style={{ color: "#EAEAEA" }}>Uploads</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "#EAEAEA" }}>
                  {historyData.filter(item => item.type === 'upload').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <Printer className="w-4 h-4 text-green-400" />
                  <span className="text-sm" style={{ color: "#EAEAEA" }}>Prints</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "#EAEAEA" }}>
                  {historyData.filter(item => item.type === 'print').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-sm" style={{ color: "#EAEAEA" }}>Active Days</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "#EAEAEA" }}>
                  {activityDates.size}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistoryPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative backdrop-blur-xl border rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FFA05B, transparent)" }} />
            
            <div className="p-6">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold" style={{ color: "#EAEAEA", fontFamily: '"Clash Display", "Inter", sans-serif' }}>
                    {selectedDate.toLocaleDateString()} - Activity Details
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryPanel(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                >
                  <X className="w-4 h-4" style={{ color: "#999999" }} />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" style={{ color: "#999999" }} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#EAEAEA"
                    }}
                  >
                    <option value="all">All Activity</option>
                    <option value="upload">Uploads</option>
                    <option value="print">Prints</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-4 h-4" style={{ color: "#999999" }} />
                  <input
                    type="text"
                    placeholder="Search by file name or token..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#EAEAEA"
                    }}
                  />
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      {getTypeIcon(item.type)}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
                            {item.fileName}
                          </span>
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: "#999999" }}>
                          <span>Token: {item.token}</span>
                          <span>{new Date(item.date).toLocaleTimeString()}</span>
                          {item.documentType && <span>Type: {item.documentType}</span>}
                          {item.copies && <span>Copies: {item.copies}</span>}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'printing' ? 'bg-blue-500/20 text-blue-400' :
                          item.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12" style={{ color: "#999999" }}>
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No activity found on this date</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
