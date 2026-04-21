import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, CheckCircle } from "lucide-react";
import StarRating from "./StarRating";
import { api } from "../services/api";

export default function RatingSubmission({
  jobId,
  onSuccess,
  onCancel,
  showFeedback = true,
  title = "Rate Your Experience",
  subtitle = "How would you rate your printing experience?",
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating before submitting");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/rate", {
        jobId,
        rating,
        feedback: feedback.trim(),
      });

      if (response.status === 201) {
        setSubmitted(true);
        if (onSuccess) {
          onSuccess(response.data.rating);
        }
      }
    } catch (err) {
      console.error("Failed to submit rating:", err);
      if (err.response?.status === 409) {
        setError("You have already rated this print job");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid rating data");
      } else {
        setError("Failed to submit rating. Please try again.");
      }
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
        return "";
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{
            background: "rgba(34, 197, 94, 0.15)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: "#22c55e" }} />
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-2">
          Thank You for Your Rating!
        </h3>

        <p className="text-gray-400 mb-4">{getRatingMessage(rating)}</p>

        <div className="flex items-center justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-600"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-500">
          Your feedback helps us improve our printing service.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className="relative backdrop-blur-xl border rounded-2xl p-6"
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
            background: "linear-gradient(to right, #FF6B35, transparent)",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <StarRating
                value={rating}
                onChange={setRating}
                size="w-10 h-10"
                showValue={false}
                className="justify-center"
              />
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-400 mt-3"
                >
                  {getRatingMessage(rating)}
                </motion.p>
              )}
            </div>

            {/* Feedback Textarea */}
            {showFeedback && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about our service..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {feedback.length}/500 characters
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {onCancel && (
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#999999",
                  }}
                >
                  Cancel
                </motion.button>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || rating === 0}
                whileHover={{ scale: rating > 0 && !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: rating > 0 && !isSubmitting ? 0.98 : 1 }}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  rating === 0 || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                style={{
                  background:
                    rating > 0 && !isSubmitting
                      ? "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)"
                      : "rgba(255,255,255,0.1)",
                  border:
                    rating > 0 && !isSubmitting
                      ? "none"
                      : "1px solid rgba(255,255,255,0.2)",
                  color: rating > 0 && !isSubmitting ? "#FFFFFF" : "#999999",
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Rating
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
