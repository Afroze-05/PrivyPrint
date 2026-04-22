import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Home, ArrowLeft, CheckCircle, Heart } from "lucide-react";

export default function RatingThankYouPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rating = searchParams.get("rating");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const getRatingMessage = (rating) => {
    const ratingValue = parseInt(rating);
    switch (ratingValue) {
      case 5:
        return "Excellent! We're thrilled you had a perfect experience!";
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
    const ratingValue = parseInt(rating);
    switch (ratingValue) {
      case 5:
        return "#22c55e";
      case 4:
        return "#3b82f6";
      case 3:
        return "#f59e0b";
      case 2:
        return "#f97316";
      case 1:
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStars = (rating) => {
    const ratingValue = parseInt(rating);
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-8 h-8 ${
          star <= ratingValue
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              border: "2px solid rgba(34, 197, 94, 0.3)",
            }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: "#22c55e" }} />
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-6"
          >
            Your rating has been submitted successfully
          </motion.p>

          {/* Rating Display */}
          {rating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                {getStars(rating)}
              </div>
              <p
                className="text-lg font-medium"
                style={{ color: getRatingColor(rating) }}
              >
                {getRatingMessage(rating)}
              </p>
            </motion.div>
          )}

          {/* Heart Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mb-8"
          >
            <Heart className="w-8 h-8 text-orange-500" />
          </motion.div>

          {/* Appreciation Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mb-8 max-w-md mx-auto"
          >
            Your feedback helps us provide better printing services. We appreciate you taking the time to share your experience!
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <p className="text-sm text-gray-500">
              Redirecting to homepage in{" "}
              <span className="font-bold text-orange-500">{countdown}</span> seconds
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                color: "#FFFFFF",
              }}
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#999999",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
