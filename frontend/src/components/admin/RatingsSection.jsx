import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Users, MessageSquare, Calendar, Filter, Search } from "lucide-react";
import StarRating from "../StarRating";

export default function RatingsSection() {
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRatings();
    fetchStats();
  }, [currentPage, filterRating]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const testToken = "test_admin_token_1775028546379";
      const response = await fetch(`/api/rate/reviews?page=${currentPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${testToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch ratings");
      
      const data = await response.json();
      setRatings(data.ratings || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error("Failed to fetch ratings:", err);
      setError("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const testToken = "test_admin_token_1775028546379";
      const response = await fetch("/api/rate/stats", {
        headers: {
          Authorization: `Bearer ${testToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch stats");
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = searchTerm === "" || 
      rating.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.feedback?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRating === "all" || rating.rating === parseInt(filterRating);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingDistribution = () => {
    if (!stats?.ratingDistribution) return [];
    
    return Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0
    }));
  };

  if (loading && ratings.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative backdrop-blur-xl border rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl"
                style={{ background: "rgba(255, 107, 53, 0.15)", border: "1px solid rgba(255, 107, 53, 0.3)" }}>
                <Star className="w-5 h-5" style={{ color: "#FF6B35" }} />
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={stats.averageRating} readonly size="w-4 h-4" showValue={false} />
              <span className="text-sm text-gray-400">Average Rating</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative backdrop-blur-xl border rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FF8A50, transparent)" }} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl"
                style={{ background: "rgba(255, 138, 80, 0.15)", border: "1px solid rgba(255, 138, 80, 0.3)" }}>
                <Users className="w-5 h-5" style={{ color: "#FF8A50" }} />
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">
              {stats.totalRatings}
            </div>
            <div className="text-sm text-gray-400">
              Total Ratings
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative backdrop-blur-xl border rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FFA05B, transparent)" }} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl"
                style={{ background: "rgba(255, 160, 91, 0.15)", border: "1px solid rgba(255, 160, 91, 0.3)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: "#FFA05B" }} />
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">
              {stats.trustScore}
            </div>
            <div className="text-sm text-gray-400">
              Trust Score
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative backdrop-blur-xl border rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #22c55e, transparent)" }} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl"
                style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                <MessageSquare className="w-5 h-5" style={{ color: "#22c55e" }} />
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-2">
              {ratings.filter(r => r.feedback && r.feedback.trim()).length}
            </div>
            <div className="text-sm text-gray-400">
              With Feedback
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating Distribution */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative backdrop-blur-xl border rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />
          
          <h3 className="text-lg font-semibold text-white mb-6">Rating Distribution</h3>
          
          <div className="space-y-3">
            {getRatingDistribution()
              .sort((a, b) => b.rating - a.rating)
              .map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-gray-400">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-gray-700 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{
                          background: rating >= 4 ? "#22c55e" : rating >= 3 ? "#FFA05B" : "#ef4444"
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 w-12 text-right">
                    {count}
                  </div>
                  <div className="text-sm text-gray-500 w-12 text-right">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user name, email, or feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Ratings List */}
      <div className="space-y-4">
        {filteredRatings.map((rating, index) => (
          <motion.div
            key={rating._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative backdrop-blur-xl border rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <p className="font-medium text-white">
                      {rating.userId?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {rating.userId?.email || "No email"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StarRating value={rating.rating} readonly size="w-4 h-4" showValue={false} />
                    <span className="text-sm text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(rating.timestamp || rating.createdAt)}
                    </div>
                  </div>
                </div>
                
                {rating.feedback && rating.feedback.trim() && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5 border-l-4 border-orange-500">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {rating.feedback}
                    </p>
                  </div>
                )}
                
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Job ID: {rating.jobId?.token || rating.jobId}</span>
                  {rating.jobId?.type && (
                    <span>• {rating.jobId.type} • {rating.jobId.copies || 1} copies</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredRatings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-gray-400">
              {searchTerm || filterRating !== "all" 
                ? "No ratings found matching your criteria" 
                : "No ratings yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Previous
          </button>
          
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
