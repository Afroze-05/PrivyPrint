import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { setAuth, getAuth } from "../services/authStorage";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, FileText, UserPlus } from "lucide-react";

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAccount(e) {
    e.preventDefault();   //Don’t refresh page" 
    setError("");         //Clear old warning message
    setLoading(true);     //Show processing... and spinning
    try {
      console.log("Signup attempt:", { name, email, password, role: "customer" });
      
      const res = await api.post("/auth/signup", { name, email, password, role: "customer" });
      console.log("Signup response:", res.data);
      
      // Check if signup was successful and OTP was sent
      if (res.status === 201 && res.data.message) {
        // Navigate to OTP page with email state
        navigate("/verify-otp", { state: { email } });
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginRes = await api.post("/auth/login", { email, password });
      const { token, user } = loginRes.data;
      setAuth({ token, ...user });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-amber-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[90vh]">
          
          {/* LEFT SIDE - BRANDING */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center p-12 text-white"
          >
            <div className="space-y-8">
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/25"
              >
                <UserPlus size={40} className="text-white" />
              </motion.div>

              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  Join PrivyPrint
                </motion.h1>
                
                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl font-semibold text-white/90"
                  style={{ fontFamily: '"Inter Tight", sans-serif' }}
                >
                  {isLogin ? "Welcome Back" : "Get Started Today"}
                </motion.h2>
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg text-white/60 leading-relaxed max-w-md"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {isLogin 
                  ? "Sign in to access your secure printing dashboard and manage your documents."
                  : "Create your account and start printing securely with enterprise-grade protection."
                }
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">Free to get started</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-white/70">Instant access</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center p-8 lg:p-12"
          >
            <div className="w-full max-w-md">
              {/* Glassmorphic Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,107,53,0.2)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,53,0.15)'
                }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
                
                <div className="relative p-8 lg:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25"
                    >
                      {isLogin ? <FileText size={32} className="text-white" /> : <UserPlus size={32} className="text-white" />}
                    </motion.div>
                    
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: '"Inter Tight", sans-serif' }}
                    >
                      {isLogin ? "Sign In" : "Create Account"}
                    </motion.h2>
                    
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-white/60"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {isLogin ? "Access your secure print portal" : "Join thousands of secure printing users"}
                    </motion.p>
                  </div>

                  {/* Form */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? "login" : "signup"}
                      initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <form onSubmit={isLogin ? handleLogin : handleCreateAccount} className="space-y-6">
                        {/* Name Field (only for signup) */}
                        {!isLogin && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="relative"
                          >
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                            <input
                              type="text"
                              placeholder="Full name"
                              className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                              style={{
                                fontFamily: '"Inter", sans-serif'
                              }}
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </motion.div>
                        )}

                        {/* Email Field */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                          className="relative"
                        >
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                          <input
                            type="email"
                            placeholder="Email address"
                            className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                            style={{
                              fontFamily: '"Inter", sans-serif'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="relative"
                        >
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                          <input
                            type="password"
                            placeholder={isLogin ? "Password" : "Create a password"}
                            className="w-full pl-12 pr-4 py-4 bg-white/4 border border-white/10 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                            style={{
                              fontFamily: '"Inter", sans-serif'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm font-medium text-center"
                            style={{ fontFamily: '"Inter", sans-serif' }}
                          >
                            {error}
                          </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          style={{ fontFamily: '"Inter Tight", sans-serif' }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <span className="relative flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                {isLogin ? "Signing in..." : "Creating account..."}
                              </>
                            ) : (
                              <>
                                {isLogin ? "Sign In" : "Create Account"}
                                <ArrowRight size={20} />
                              </>
                            )}
                          </span>
                        </motion.button>
                      </form>
                    </motion.div>
                  </AnimatePresence>

                  {/* Toggle Mode */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                    className="text-center mt-8"
                  >
                    <p className="text-white/60" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        className="text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-200"
                      >
                        {isLogin ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}