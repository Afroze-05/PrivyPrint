import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getAuth } from "../../services/authStorage";

export default function VoiceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/voice-requests", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch {
      console.error("Failed to load voice requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/voice-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchRequests(); // refresh
    } catch {
      console.error("Failed to update status");
    }
  };

  const statusColors = {
    pending: {
      bg: "rgba(255,107,53,0.1)",
      border: "rgba(255,107,53,0.3)",
      text: "#FF6B35",
    },
    printed: {
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.3)",
      text: "#22c55e",
    },
    rejected: {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.3)",
      text: "#ef4444",
    },
  };

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ background: "linear-gradient(180deg, #050505, #111)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Mic className="w-6 h-6 text-[#FF6B35]" />
          <h1 className="text-2xl font-black text-white tracking-tight">
            Voice Print <span className="text-[#FF6B35]">Requests</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-white/40">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading requests…</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-white/30 text-center py-20">
            No voice print requests yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => {
              const s = statusColors[req.status] || statusColors.pending;
              return (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border p-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      {/* Token */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30 uppercase tracking-widest">
                          Token
                        </span>
                        <span className="text-lg font-black text-white tracking-widest">
                          {req.token}
                        </span>
                      </div>

                      {/* Transcript */}
                      {req.transcript && (
                        <p className="text-sm text-white/50 italic mt-1">
                          "{req.transcript}"
                        </p>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-white/20" />
                        <span className="text-xs text-white/20">
                          {new Date(req.requestedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status badge + actions */}
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

                      {req.status === "pending" && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => updateStatus(req._id, "printed")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-green-400 border border-green-400/30 hover:bg-green-400/10 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Mark Printed
                          </button>
                          <button
                            onClick={() => updateStatus(req._id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
