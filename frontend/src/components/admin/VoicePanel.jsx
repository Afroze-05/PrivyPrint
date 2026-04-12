import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Search,
  Clock,
  User,
  Mail,
  Loader2,
  RefreshCw,
  AudioLines,
} from "lucide-react";
import { api } from "../../services/api";

export default function VoicePanel() {
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch voice history - Ensure this matches your backend route for VoicePrint submissions
  const fetchVoiceHistory = async () => {
    setLoading(true);
    try {
      // If VoicePrint.jsx saves to a specific history, ensure this endpoint is correct
      const res = await api.get("/voice/history");
      setVoiceHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch voice history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoiceHistory();
  }, []);

  // Filter history based on user search
  const filteredHistory = voiceHistory.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.token?.toLowerCase().includes(searchLower) ||
      item.user?.name?.toLowerCase().includes(searchLower) ||
      item.transcript?.toLowerCase().includes(searchLower)
    );
  });

  const statusColors = {
    pending: {
      bg: "rgba(255,107,53,0.1)",
      text: "#FF6B35",
      border: "#FF6B3530",
    },
    verified: {
      bg: "rgba(34,197,94,0.1)",
      text: "#22c55e",
      border: "#22c55e30",
    },
    rejected: {
      bg: "rgba(239,68,68,0.1)",
      text: "#ef4444",
      border: "#ef444430",
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl border rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "rgba(255,107,53,0.15)",
                border: "1px solid rgba(255,107,53,0.3)",
              }}
            >
              <AudioLines className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Submitted Voice Prints
            </h3>
          </div>
          <button
            onClick={fetchVoiceHistory}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by token, user, or content..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
        </div>

        {/* List of Voice Submissions */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-white/40">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
            <span>Syncing voice records...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-xl">
            {searchTerm
              ? "No matching records found."
              : "No voice prints have been sent yet."}
          </div>
        ) : (
          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredHistory.map((voice) => (
              <motion.div
                key={voice._id || voice.token}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border p-4 bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    {/* User Metadata */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <User className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span className="text-sm font-medium">
                          {voice.user?.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-xs">
                          {voice.user?.email || "No email provided"}
                        </span>
                      </div>
                    </div>

                    {/* Token & Transcript */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60 font-mono">
                        {voice.token}
                      </span>
                      {voice.transcript && (
                        <p className="text-sm text-white/70 italic line-clamp-1">
                          "{voice.transcript}"
                        </p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-white/20 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {new Date(
                        voice.requestedAt || voice.createdAt,
                      ).toLocaleString()}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                    style={{
                      background:
                        statusColors[voice.status]?.bg ||
                        statusColors.pending.bg,
                      color:
                        statusColors[voice.status]?.text ||
                        statusColors.pending.text,
                      borderColor:
                        statusColors[voice.status]?.border ||
                        statusColors.pending.border,
                    }}
                  >
                    {voice.status || "pending"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
