import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";
import { motion, AnimatePresence } from "framer-motion";
console.log(motion, api);
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Mail,
} from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // If no email is provided, redirect back to signup
  if (!email) {
    alert("Session expired. Please signup again.");
    navigate("/signup");
    return null;
  }

  const handleInputChange = (index, value) => {
    // Only allow single digit (0-9)
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    const otpString = newOtp.join("");
    setOtp(otpString);
    console.log("OTP updated:", otpString); // Debug OTP update

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = pastedData.padEnd(6, "");
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      console.log("OTP verification response:", res.data);

      if (res.data.token && res.data.user) {
        // 1. Trigger the success animation
        setSuccess(true);

        // 2. Store authentication data properly
        setAuth({ token: res.data.token, user: res.data.user });
        console.log("Auth data stored successfully");

        // 3. Get the role from the user data
        const userRole = res.data.user.role;

        // 4. Final Conditional Redirect
        setTimeout(() => {
          if (userRole === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500); // 1.5s delay to show the success checkmark
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
      console.log("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("OTP state:", otp, "length:", otp.length); // Debug OTP state

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-amber-950/20" />

      {/* Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate(-1)}
          className="absolute -top-16 left-0 flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: "24px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,53,0.15)",
          }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 pointer-events-none" />

          <div className="relative p-8">
            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  Verification Successful!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Redirecting to your dashboard...
                </motion.p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25"
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: '"Inter Tight", sans-serif' }}
                  >
                    Verify Your Email
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-white/60 text-sm"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    We've sent a 6-digit code to
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mt-2 text-white/80"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">{email}</span>
                  </motion.div>
                </div>

                {/* OTP Input */}
                <div className="space-y-6 relative z-30">
                  <div className="flex justify-center gap-3 mb-8">
                    {[...Array(6)].map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                      >
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otp[index] || ""}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-14 h-14 text-center text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                          style={{ fontFamily: '"Inter Tight", sans-serif' }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="text-red-400 text-sm">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verify Button */}
                  <motion.button
                    type="button"
                    disabled={loading || otp.length !== 6}
                    whileHover={{
                      scale: loading || otp.length !== 6 ? 1 : 1.02,
                    }}
                    whileTap={{ scale: loading || otp.length !== 6 ? 1 : 0.98 }}
                    onClick={handleVerify}
                    className={`w-full py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden group z-20 cursor-pointer pointer-events-auto ${
                      otp.length === 6 && !loading
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 ring-2 ring-orange-500/50 ring-offset-0 ring-offset-transparent"
                        : "bg-gray-600 opacity-50 cursor-not-allowed"
                    }`}
                    style={{ fontFamily: '"Inter Tight", sans-serif' }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify OTP
                          <Shield className="w-5 h-5" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
