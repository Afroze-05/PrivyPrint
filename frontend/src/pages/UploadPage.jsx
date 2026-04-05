import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { setCustomerToken } from "../services/customerTokenStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Printer, Hash, Cpu,
  ArrowLeft, ChevronRight, X, ImageIcon, Check,
} from "lucide-react";

/* ── Premium Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Subtle Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.3) 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.03,
    }}
  />
);

/* ── Soft Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ 
      scale: [1, 1.1, 1.05, 1.15, 1], 
      opacity: [0.08, 0.12, 0.1, 0.15, 0.08] 
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B35]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="h-px w-6 bg-[#FF6B35]/50" />
    <span className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase">{children}</span>
  </div>
);

export default function UploadPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [type, setType] = useState("B/W");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) setFile(dropped);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    
    try {
      if (!auth?.token) throw new Error("Missing authentication token.");
      if (!file) throw new Error("Please select a PDF or image file.");

      console.log('🔍 Upload Debug - Token exists:', !!auth?.token);
      console.log('🔍 Upload Debug - Token length:', auth?.token?.length);
      console.log('🔍 Upload Debug - User role:', auth?.role);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("copies", String(copies));

      const res = await api.post("/upload", formData, {
        headers: authHeader(auth.token),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadSuccess(true);
        setLoading(false);
        setIsUploaded(true);
      }, 500);

      const { token, expiresAt, status } = res.data;
      console.log('📤 UploadPage - API response:', res.data);
      console.log('📤 UploadPage - Generated token:', token);
      setCustomerToken({ token, expiresAt, status: status || "waiting" });
      localStorage.setItem('printType', type);
      console.log('📤 UploadPage - Token stored in localStorage');
      console.log('📤 UploadPage - Print type stored:', type);
      
      setTimeout(() => {
        navigate("/token");
      }, 2000);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err?.response?.data?.message || err.message || "Upload failed.");
      setLoading(false);
    }
  }

  const isPDF = file?.type === "application/pdf";
  const fileSizeKB = file ? (file.size / 1024).toFixed(1) : null;

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <NoiseSVG />
      <GridDots />
      <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
      <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={() => navigate("/home")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#999999"
        }}
        whileHover={{ 
          scale: 1.05,
          color: "#FF6B35",
          borderColor: "rgba(255, 107, 53, 0.2)",
          transition: { duration: 0.3 }
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#FF6B35"
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-sm font-medium">Secure Upload Active</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{
            fontFamily: '"Clash Display", "Inter", sans-serif',
            color: "#EAEAEA",
            fontWeight: 700,
            lineHeight: 1.1
          }}
        >
          Upload{" "}
          <motion.span
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Document
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg mb-12"
          style={{
            color: "#999999",
            lineHeight: 1.6
          }}
        >
          Securely upload your PDF or image for encrypted printing
        </motion.p>

        {/* Upload Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div
            className="relative backdrop-blur-xl border rounded-2xl p-8 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
            }}
          >
            {/* File Upload Area */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            
            {/* Success State Overlay */}
            <AnimatePresence>
              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-green-400/10 backdrop-blur-md rounded-xl border border-green-400/30"
                  style={{ zIndex: 10 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">File Uploaded Securely</h3>
                  <p className="text-sm text-white/70">Token Generated Successfully</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Bar */}
            <AnimatePresence>
              {loading && uploadProgress > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 left-4 right-4 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A50]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white/70">{uploadProgress}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isUploaded ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  className="relative cursor-pointer border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 transition-all duration-300"
                  style={{
                    background: dragOver ? "rgba(255, 107, 53, 0.02)" : "rgba(255,255,255,0.01)",
                    borderColor: dragOver ? "rgba(255, 107, 53, 0.5)" : "rgba(255,255,255,0.08)"
                  }}
                >
                  {/* Upload Icon */}
                  <motion.div
                    animate={{ 
                      y: dragOver ? [0, -10, 0] : [0, 5, 0],
                      scale: dragOver ? 1.1 : 1
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="p-4 rounded-full"
                    style={{
                      background: dragOver 
                        ? "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)"
                        : "rgba(255, 107, 53, 0.1)",
                      border: "1px solid rgba(255, 107, 53, 0.2)"
                    }}
                  >
                    <Upload 
                      className="w-8 h-8" 
                      style={{ color: dragOver ? "white" : "#FF6B35" }}
                    />
                  </motion.div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-white mb-2">
                      {dragOver ? "Drop file here" : "Drag & drop your file"}
                    </p>
                    <p className="text-xs text-gray-500">
                      or click to browse • PDF & Images supported
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white text-black border-green-400 shadow-lg rounded-xl p-12 flex flex-col items-center gap-4"
                  style={{
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1), 0 0 20px rgba(34,197,94,0.1)"
                  }}
                >
                  {/* Big Tick Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center"
                    style={{
                      boxShadow: "0 0 30px rgba(34,197,94,0.3)"
                    }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Success Content */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-black mb-2">
                      Uploaded Successfully
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Your file is secured
                    </p>
                    {file && (
                      <p className="text-sm text-gray-500 font-medium">
                        {file.name}
                      </p>
                    )}
                  </div>

                  {/* Reset Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsUploaded(false);
                      setFile(null);
                      setUploadSuccess(false);
                      setUploadProgress(0);
                    }}
                    className="mt-4 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-300"
                  >
                    Upload Another File
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Print Options - Hide after upload */}
            {!isUploaded && (
              <div className="space-y-6">
                {/* Print Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Print Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["B/W", "Color"].map((opt) => (
                      <motion.button
                        key={opt}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setType(opt)}
                        className="relative p-4 rounded-xl border transition-all duration-300"
                        style={{
                          background: type === opt 
                            ? "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)"
                            : "rgba(255,255,255,0.03)",
                          border: type === opt 
                            ? "1px solid rgba(255, 107, 53, 0.3)"
                            : "1px solid rgba(255,255,255,0.08)"
                        }}
                      >
                        <Printer 
                          className="w-5 h-5 mx-auto mb-2"
                          style={{ color: type === opt ? "white" : "#FF6B35" }}
                        />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: type === opt ? "white" : "#EAEAEA" }}
                        >
                          {opt}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Copies */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Number of Copies</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Hash className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#EAEAEA",
                        fontFamily: '"Inter", sans-serif'
                      }}
                      placeholder="Enter number of copies"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)"
                }}
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Submit Button - Hide after upload */}
            {!isUploaded && (
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 disabled:opacity-50"
                style={{
                  background: uploadSuccess 
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                  fontFamily: '"Clash Display", "Inter", sans-serif'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Uploading...</span>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex items-center justify-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>Uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>Upload Document</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Floating status indicator */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: "#FF6B35" }}>
            System Live
          </span>
          <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full animate-pulse" style={{ boxShadow: "0 0 10px rgba(255, 107, 53, 0.5)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}