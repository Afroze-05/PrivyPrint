import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { setCustomerToken } from "../services/customerTokenStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Printer,
  Hash,
  ArrowLeft,
  ChevronRight,
  Check,
  Mic,
  Timer,
  AlertTriangle,
  X,
} from "lucide-react";

/* ── Background Components (Noise, Grid, Orb) ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.68"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

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

const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{
      scale: [1, 1.1, 1.05, 1.15, 1],
      opacity: [0.08, 0.12, 0.1, 0.15, 0.08],
    }}
    transition={{ duration: 12, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export default function UploadPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [type, setType] = useState("B/W");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ NEW: Store the token to show the user
  const [generatedToken, setGeneratedToken] = useState(null);

  // Debug modal state
  useEffect(() => {
    console.log("🔍 Modal state changed:", { showSuccessModal, isUploaded, uploadSuccess });
  }, [showSuccessModal, isUploaded, uploadSuccess]);

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }
  }

  function removeFile(index) {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setUploadProgress(0);
    
    console.log("Starting multiple file upload...");

    // Clear any existing timer state for fresh session
    localStorage.removeItem('tokenTimerStart');
    localStorage.removeItem('tokenDuration');

    if (!auth?.token) throw new Error("Missing authentication token.");
    if (files.length === 0) throw new Error("Please select at least one PDF or image file.");

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + (100 / files.length) / 10, 90));
    }, 100);

    try {
      // Upload files one by one
      const uploadedTokens = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}:`, file.name);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("copies", String(copies));

        const res = await api.post("/upload", formData, {
          headers: authHeader(auth.token),
        });

        console.log(`File ${i + 1} uploaded successfully!`, res.data);
        
        // Store token for this file
        const { token, expiresAt, status } = res.data;
        uploadedTokens.push({ token, file: file.name, expiresAt, status: status || "waiting" });
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // For now, use the first token as the main token (you can modify this logic later)
      const mainToken = uploadedTokens[0];
      setGeneratedToken(mainToken.token);
      
      console.log("All files uploaded successfully!");

      setTimeout(() => {
        setUploadSuccess(true);
        setLoading(false);
        setIsUploaded(true);
        
        setCustomerToken({ 
          token: mainToken.token, 
          expiresAt: mainToken.expiresAt, 
          status: mainToken.status 
        });
        localStorage.setItem("printType", type);
        
        console.log("Tokens stored, showing modal...");
        
        // Show success modal after a short delay
        setTimeout(() => {
          setShowSuccessModal(true);
          console.log("Success modal should be visible now");
        }, 200);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      
      // Better error handling with specific messages
      let errorMessage = "Upload failed. Please try again.";
      
      if (err?.response?.status === 413) {
        errorMessage = "One or more files are too large. Please choose smaller files.";
      } else if (err?.response?.status === 400) {
        errorMessage = "Invalid file format. Please use PDF or image files.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Authentication expired. Please login again.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
      setFiles([]); // Reset files on error
      setUploadProgress(0); // Reset progress
      // Ensure user cannot proceed to token page on error
      setIsUploaded(false);
      setUploadSuccess(false);
      setShowSuccessModal(false);
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <NoiseSVG />
      <GridDots />
      <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
      <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />

      {/* Upload Form Container - Perfectly Centered */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-12">
        {/* Back Button - Only show when not uploaded */}
        {!isUploaded && (
          <motion.button
            onClick={() => navigate("/home")}
            className="absolute -top-16 left-0 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-[#FF6B35] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        )}

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-green-400/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-400/30 bg-green-400/10 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
                  <p className="text-gray-400 mb-6">
                    {files.length === 1 
                      ? "Your document has been secured and is ready for printing." 
                      : `Your ${files.length} documents have been secured and are ready for printing.`
                    }
                  </p>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        console.log("🔘 View Token button clicked");
                        setShowSuccessModal(false);
                        console.log("📍 Navigating to token page...");
                        navigate("/token");
                      }}
                      className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                      View Token
                    </motion.button>
                    
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full py-2 border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
                    >
                      Stay on Upload Page
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Form or Success State */}
        {isUploaded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
            }}
          >
            <NoiseSVG />
            <GridDots />
            <GlowOrb color="#22c55e" size={600} top="-10%" left="-5%" delay={0} />
            <GlowOrb color="#16a34a" size={400} top="40%" left="60%" delay={3} />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 max-w-2xl w-full">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full border-2 border-green-400/30 bg-green-400/10 flex items-center justify-center mb-8"
              >
                <Check className="w-12 h-12 text-green-400" />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter leading-tight">
                  Upload <span className="text-green-400">Successful!</span>
                </h1>
                <p className="text-xl text-gray-400 mb-2">
                  {files.length === 1 
                    ? "Document is secured and ready for printing"
                    : `${files.length} documents are secured and ready for printing`
                  }
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-full">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Upload Successful! Click below to continue.</span>
                </div>
              </motion.div>

              {/* Token Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md"
              >
                <div className="p-8 border border-[#FF6B35]/20 bg-black/40 backdrop-blur-xl rounded-3xl mb-8">
                  <div className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                    Your Print Token
                  </div>
                  <div className="text-5xl font-black text-[#FF6B35] tracking-tighter mb-6 leading-none">
                    {generatedToken}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Token expires in 60 seconds</span>
                  </div>
                </div>
              </motion.div>

              {/* Voice Print Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                  }}
                  onClick={() => navigate("/voice-print")}
                  className="w-full p-6 rounded-2xl border-2 border-dashed border-[#FF6B35]/30 bg-[#FF6B35]/5 flex flex-col items-center gap-4 transition-all mb-6"
                >
                  <div className="flex items-center gap-3 text-[#FF6B35]">
                    <Mic className="w-6 h-6 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-widest">
                      Try Voice Print
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 italic">
                    Say: "Print token {generatedToken}"
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate("/token")}
                  className="w-full py-5 font-black uppercase tracking-[0.4em] text-white text-lg bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] flex items-center justify-center gap-3 rounded-xl transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                  Proceed to Token Page
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#EAEAEA] leading-tight text-center">
              Upload <span className="text-[#FF6B35]">Document</span>
            </h1>

            <motion.form onSubmit={handleSubmit} className="relative">
              <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden bg-white/5 shadow-2xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium">{error}</p>
                        <p className="text-red-400/70 text-sm mt-1">Please try again or contact support if the issue persists.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Progress Bar (Only during loading) */}
                {loading && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FF6B35]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center gap-4 transition-all ${dragOver ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-white/10 bg-white/5"}`}
                >
                  <Upload
                    className={`w-8 h-8 ${dragOver ? "text-[#FF6B35]" : "text-gray-500"}`}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {files.length === 0 ? "Select your files" : `${files.length} file(s) selected`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF or Images supported (multiple files allowed)
                    </p>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Selected Files:</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-300 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {["B/W", "Color"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setType(opt)}
                      className={`p-4 rounded-xl border transition-all ${type === opt ? "bg-[#FF6B35] border-[#FF6B35] text-white" : "bg-white/5 border-white/10 text-gray-400"}`}
                    >
                      <Printer className="w-4 h-4 mx-auto mb-2" />
                      <span className="text-xs font-bold uppercase">{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
                    Copies
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      min={1}
                      value={copies}
                      onChange={(e) => setCopies(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || files.length === 0}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF8A50] disabled:opacity-50 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? "Processing..." : `Secure Upload${files.length > 1 ? ` (${files.length} files)` : ''}`}
                  {!loading && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </div>
    </div>
  );
}