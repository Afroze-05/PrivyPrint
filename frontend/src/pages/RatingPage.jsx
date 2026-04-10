import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar, User } from "lucide-react";
import RatingSubmission from "../components/RatingSubmission";
import { api } from "../services/api";

export default function RatingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      setError("No print job ID provided");
      setLoading(false);
      return;
    }

    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/documents/${jobId}`);
      setJobDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      setError("Failed to load print job details");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSuccess = (rating) => {
    // Redirect to thank you page after successful rating
    navigate(`/rating-thank-you?rating=${rating}`);
  };

  const handleCancel = () => {
    // Go back to previous page or home
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
          }}
        >
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
              color: "#FFFFFF"
            }}
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-white/10"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-xl font-bold text-white">
            Rate Your Print Job
          </h1>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="relative backdrop-blur-xl border rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(to right, #FF6B35, transparent)" }} />
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Job Details
                </h3>
                
                {jobDetails && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {jobDetails.filename || "Unknown File"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {jobDetails.type || "Unknown Type"} • {jobDetails.copies || 1} {jobDetails.copies === 1 ? "copy" : "copies"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">
                          {new Date(jobDetails.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(jobDetails.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white">
                          {jobDetails.userEmail || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Job ID: {jobDetails.token || jobId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Status</span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: jobDetails.status === "completed" 
                              ? "rgba(34, 197, 94, 0.15)" 
                              : "rgba(255, 160, 91, 0.15)",
                            color: jobDetails.status === "completed" 
                              ? "#22c55e" 
                              : "#FFA05B",
                            border: jobDetails.status === "completed" 
                              ? "1px solid rgba(34, 197, 94, 0.3)" 
                              : "1px solid rgba(255, 160, 91, 0.3)"
                          }}
                        >
                          {jobDetails.status?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Rating Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <RatingSubmission
              jobId={jobId}
              onSuccess={handleRatingSuccess}
              onCancel={handleCancel}
              title="How was your printing experience?"
              subtitle="Your feedback helps us improve our service for everyone."
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
