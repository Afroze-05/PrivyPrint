import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";
import { LogIn, Mail, Lock } from "lucide-react";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      setAuth({ token, ...user });
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Ambient Fiery Glow Background Elements */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(242, 103, 22, 0.05)" }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(166, 47, 3, 0.03)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full"
      >
        {/* Card Container */}
        <div 
          className="bg-[#140404] rounded-xl border border-white/5 p-8 relative shadow-[0_0_40px_rgba(242,103,22,0.08)]"
        >
          {/* Top Icon */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#f26716]/10 flex items-center justify-center border border-[#f26716]/20 shadow-[0_0_20px_rgba(242,103,22,0.15)]"
            >
              <LogIn size={28} className="text-[#f26716]" />
            </div>
            
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Customer Login
            </h2>
            <p className="text-white/50 text-sm mt-2">
              Secure access to your print portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <Mail 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#f26716] transition-colors" 
                size={18} 
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-[#0d0d0d] border border-white/10 rounded-lg text-white placeholder:text-white/30 outline-none focus:border-[#f26716] focus:ring-4 focus:ring-[#f26716]/10 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#f26716] transition-colors" 
                size={18} 
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-[#0d0d0d] border border-white/10 rounded-lg text-white placeholder:text-white/30 outline-none focus:border-[#f26716] focus:ring-4 focus:ring-[#f26716]/10 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#f26716] text-xs font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Login Button */}
            <motion.button
              whileActive={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f26716] hover:bg-[#ff7a2f] text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(242,103,22,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Login to System"
              )}
            </motion.button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-white/50 text-xs">
              New to PrivyPrint?{" "}
              <Link 
                to="/signup" 
                className="text-[#f26716] font-medium hover:underline transition-all"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}