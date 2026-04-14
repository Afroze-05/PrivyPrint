import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function RatingThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rating = searchParams.get("rating");

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getRatingMessage = (rating) => {
    const ratingNum = parseInt(rating);
    switch (ratingNum) {
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
        return "Thank you for your feedback!";
    }
  };

  const getRatingColor = (rating) => {
    const ratingNum = parseInt(rating);
    if (ratingNum >= 4) return "#22c55e";
    if (ratingNum >= 3) return "#FFA05B";
    return "#ef4444";
  };

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
        className="relative backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full text-center"
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
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(34, 197, 94, 0.15)", border: "2px solid rgba(34, 197, 94, 0.3)" }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: "#22c55e" }} />
          </motion.div>

          {/* Title */}
          <h1
            className="text-2xl font-bold mb-4"
            style={{
              color: "#EAEAEA",
              fontFamily: '"Clash Display", "Inter", sans-serif',
              fontWeight: 700
            }}
          >
            Thank You for Your Rating!
          </h1>

          {/* Rating Display */}
          {rating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= parseInt(rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div 
                className="text-lg font-semibold"
                style={{ color: getRatingColor(rating) }}
              >
                {rating} out of 5 stars
              </div>
            </motion.div>
          )}

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm mb-6 leading-relaxed"
            style={{ color: "#999999" }}
          >
            {rating ? getRatingMessage(rating) : "Thank you for your feedback!"}
          </motion.p>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-4 rounded-xl text-xs"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p style={{ color: "#666666" }}>
              Your feedback helps us improve our printing service.
            </p>
            <p className="mt-2" style={{ color: "#666666" }}>
              You will be redirected to the homepage automatically...
            </p>
          </motion.div>

          {/* Manual Redirect Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              background: "rgba(255, 107, 53, 0.1)",
              border: "1px solid rgba(255, 107, 53, 0.2)",
              color: "#FF6B35"
            }}
          >
            Go to Homepage
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
