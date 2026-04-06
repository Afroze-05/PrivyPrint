import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mic, Search, ShieldCheck, Clock, User, Mail, FileText, 
  CheckCircle, XCircle, Loader2, RefreshCw 
} from "lucide-react";
import { getAuth } from "../../services/authStorage";
import { api } from "../../services/api";

export default function VoicePanel() {
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenInput, setTokenInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();

  // Fetch voice history
  const fetchVoiceHistory = async () => {
    try {
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

  // Verify token
  const verifyToken = async () => {
    if (!tokenInput.trim()) return;
    
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      const res = await api.post("/voice/verify-token", { 
        token: tokenInput.trim() 
      });
      
      setVerificationResult(res.data);
    } catch (err) {
      console.error("Token verification failed:", err);
      setVerificationResult({
        error: "Verification failed",
        message: err.response?.data?.error || "Could not verify token. Please try again."
      });
    } finally {
      setVerifying(false);
    }
  };

  // Filter voice history
  const filteredHistory = voiceHistory.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.token?.toLowerCase().includes(searchLower) ||
      item.user?.name?.toLowerCase().includes(searchLower) ||
      item.user?.email?.toLowerCase().includes(searchLower) ||
      item.transcript?.toLowerCase().includes(searchLower)
    );
  });

  const statusColors = {
    pending: { bg: "rgba(255,107,53,0.1)", text: "#FF6B35", border: "#FF6B3530" },
    verified: { bg: "rgba(34,197,94,0.1)", text: "#22c55e", border: "#22c55e30" },
    rejected: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "#ef444430" },
  };

  return (
    <div className="space-y-6">
      {/* Token Verification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl border rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg" style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)" }}>
            <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Token Verification</h3>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verifyToken()}
            placeholder="Enter token to verify..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
          <button
            onClick={verifyToken}
            disabled={verifying || !tokenInput.trim()}
            className="px-6 py-3 rounded-xl font-medium text-white bg-[#FF6B35] hover:bg-[#FF8A50] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Verify Token
          </button>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4"
            style={{
              background: verificationResult.verified 
                ? "rgba(34,197,94,0.1)" 
                : "rgba(239,68,68,0.1)",
              border: verificationResult.verified 
                ? "1px solid rgba(34,197,94,0.3)" 
                : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {verificationResult.verified ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${verificationResult.verified ? 'text-green-400' : 'text-red-400'}`}>
                {verificationResult.message}
              </span>
            </div>
            
            {verificationResult.verified && (
              <div className="space-y-3 text-sm">
                {verificationResult.voiceData && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-4 h-4 text-white/60" />
                      <span className="font-medium text-white">Voice Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/40">User:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.voiceData.user?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Email:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.voiceData.user?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Status:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.voiceData.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Type:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.voiceData.type}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {verificationResult.documentData && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-white/60" />
                      <span className="font-medium text-white">Document Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/40">User:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.documentData.user?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Email:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.documentData.user?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Type:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.documentData.type}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40">Status:</span>
                        <span className="ml-2 text-white">
                          {verificationResult.documentData.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Voice History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl border rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)" }}>
              <Mic className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Voice Print History</h3>
          </div>
          <button
            onClick={fetchVoiceHistory}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by token, user, or transcript..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35] transition-colors"
          />
        </div>

        {/* Voice History List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading voice history...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            {searchTerm ? "No matching voice records found." : "No voice records yet."}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.map((voice) => (
              <motion.div
                key={voice._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4 hover:bg-white/5 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* User Info */}
                    {voice.user && (
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-3 h-3 text-white/40" />
                        <span className="text-sm font-medium text-white">
                          {voice.user.name}
                        </span>
                        <Mail className="w-3 h-3 text-white/40" />
                        <span className="text-xs text-white/60">
                          {voice.user.email}
                        </span>
                      </div>
                    )}

                    {/* Token and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/30 uppercase tracking-widest">
                        Token
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {voice.token}
                      </span>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          background: statusColors[voice.status]?.bg || statusColors.pending.bg,
                          color: statusColors[voice.status]?.text || statusColors.pending.text,
                          border: `1px solid ${statusColors[voice.status]?.border || statusColors.pending.border}`,
                        }}
                      >
                        {voice.status}
                      </span>
                    </div>

                    {/* Transcript */}
                    {voice.transcript && (
                      <div className="text-xs text-white/50 italic mb-2">
                        "{voice.transcript}"
                      </div>
                    )}

                    {/* Time */}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/20" />
                      <span className="text-xs text-white/20">
                        {new Date(voice.requestedAt).toLocaleString()}
                      </span>
                    </div>
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
