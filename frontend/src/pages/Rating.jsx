import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, MessageSquare, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import api, { publicApi } from "../services/api";

export default function Rating() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const rating = searchParams.get("rating");
  
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating ? parseInt(rating) : 0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setError("Invalid job ID. Please check your email link.");
      setLoading(false);
      return;
    }

    // Fetch job details
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/documents/${jobId}`);
        setJobDetails(response.data);
        
        // Check if already rated
        try {
          const ratingResponse = await api.get(`/rate/check/${jobId}`);
          if (ratingResponse.data.hasRated) {
            setIsSubmitted(true);
            setSelectedRating(ratingResponse.data.rating);
            setFeedback(ratingResponse.data.feedback || "");
          }
        } catch (err) {
          // If check fails, continue anyway
          console.log("Could not check existing rating");
        }
      } catch (err) {
        setError("Failed to load job details. Please try again later.");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // For email rating links, use GET request with query params
      if (rating) {
        const response = await publicApi.get(`/rate?jobId=${jobId}&rating=${selectedRating}`);
        if (response.status === 302 || response.request?.res?.responseUrl) {
          setIsSubmitted(true);
          setTimeout(() => {
            navigate(`/rating-thank-you?rating=${selectedRating}`);
          }, 2000);
        }
      } else {
        // For authenticated users, use POST request
        const response = await api.post("/rate", {
          jobId: jobId,
          rating: selectedRating,
          feedback: feedback.trim()
        });

        if (response.status === 201) {
          setIsSubmitted(true);
          setTimeout(() => {
            navigate(`/rating-thank-you?rating=${selectedRating}`);
          }, 2000);
        }
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You have already rated this print job.");
        setIsSubmitted(true);
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Invalid rating data.");
      } else {
        setError("Failed to submit rating. Please try again.");
      }
      console.error("Error submitting rating:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingMessage = (rating) => {
    switch (rating) {
      case 5:
        return "Excellent! We're thrilled you had a great experience!";
      case 4:
        return "Great! We're glad you enjoyed our service!";
      case 3:
        return "Good! We appreciate your feedback and will continue to improve.";
      case 2:
        return "Thank you for your feedback. We'll work to improve our service.";
      case 1:
        return "We're sorry to hear that. Your feedback helps us improve.";
      default:
        return "Please rate your experience";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#22c55e";
    if (rating >= 3) return "#FFA05B";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
          fontFamily: '"Inter", sans-serif'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p style={{ color: "#999999" }}>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !jobDetails) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
          fontFamily: '"Inter", sans-serif'
        }}
      >
        <div className="text-center">
          <div style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl font-medium"
            style={{
              background: "rgba(255, 107, 53, 0.1)",
              border: "1px solid rgba(255, 107, 53, 0.2)",
              color: "#FF6B35"
            }}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full"
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
          {/* Header */}
          <div className="text-center mb-6">
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                color: "#EAEAEA",
                fontFamily: '"Clash Display", "Inter", sans-serif',
                fontWeight: 700
              }}
            >
              Rate Your Experience
            </h1>
            <p style={{ color: "#999999", fontSize: "14px" }}>
              Your feedback helps us improve our printing service
            </p>
          </div>

          {/* Job Details */}
          {jobDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-4 rounded-xl mb-6"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <h3 style={{ color: "#FF6B35", fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                📄 Job Details
              </h3>
              <div style={{ fontSize: "14px", color: "#999999", lineHeight: "1.6" }}>
                <p><strong>File:</strong> {jobDetails.fileUrl?.split('/').pop() || 'Unknown'}</p>
                <p><strong>Type:</strong> {jobDetails.type}</p>
                <p><strong>Copies:</strong> {jobDetails.copies || 1}</p>
                <p><strong>Token:</strong> {jobDetails.token}</p>
              </div>
            </motion.div>
          )}

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h2 style={{ color: "#22c55e", fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>
                Thank You!
              </h2>
              <p style={{ color: "#999999", fontSize: "14px" }}>
                Your rating has been submitted successfully.
              </p>
              {selectedRating > 0 && (
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= selectedRating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <>
              {/* Rating Stars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-all duration-200"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredStar || selectedRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                
                {selectedRating > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <div 
                      className="font-semibold mb-2"
                      style={{ color: getRatingColor(selectedRating) }}
                    >
                      {selectedRating} out of 5 stars
                    </div>
                    <p style={{ color: "#999999", fontSize: "14px" }}>
                      {getRatingMessage(selectedRating)}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Feedback Textarea */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <label style={{ color: "#EAEAEA", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                  maxLength={500}
                  className="w-full p-3 rounded-xl resize-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#EAEAEA",
                    fontSize: "14px"
                  }}
                />
                <div style={{ color: "#666666", fontSize: "12px", textAlign: "right", marginTop: "4px" }}>
                  {feedback.length}/500
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg mb-4 text-center"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                >
                  <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRatingSubmit}
                disabled={isSubmitting || selectedRating === 0}
                className="w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: selectedRating > 0 && !isSubmitting 
                    ? "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)" 
                    : "rgba(255,255,255,0.1)",
                  border: selectedRating > 0 && !isSubmitting 
                    ? "none" 
                    : "1px solid rgba(255,255,255,0.2)",
                  color: selectedRating > 0 && !isSubmitting ? "#FFFFFF" : "#666666",
                  cursor: selectedRating > 0 && !isSubmitting ? "pointer" : "not-allowed"
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Rating
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
