import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { addToken } from "../services/tokenStorage";
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

// Generate 5-character token function
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function UploadPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
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
      const formattedFiles = droppedFiles.map(file => ({
        file,
        printType: "B/W",
        copies: 1
      }));
      setFiles(prevFiles => [...prevFiles, ...formattedFiles]);
    }
  }

  function removeFile(index) {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }

  const updatePrintType = (index, value) => {
    const updated = [...files];
    updated[index].printType = value;
    setFiles(updated);
  };

  const updateCopies = (index, value) => {
    const updated = [...files];
    updated[index].copies = parseInt(value) || 1;
    setFiles(updated);
  };

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const formattedFiles = selectedFiles.map(file => ({
        file,
        printType: "B/W",
        copies: 1
      }));
      setFiles(prevFiles => [...prevFiles, ...formattedFiles]);
    }
  }

  const handleGenerateToken = async () => {
  try {
    if (!files || files.length === 0) {
      alert("Please upload at least one file first");
      return;
    }

    if (!auth?.token) {
      alert("Authentication required. Please login again.");
      return;
    }

    const token = generateToken();
    console.log("Generating token:", token);
    console.log("Uploading", files.length, "files with individual print options");

    const formData = new FormData();
    
    // Append all files with their individual options
    files.forEach((fileItem, index) => {
      formData.append("files", fileItem.file);
      formData.append(`printType_${index}`, fileItem.printType);
      formData.append(`copies_${index}`, String(fileItem.copies));
    });
    
    formData.append("token", token);
    formData.append("totalFiles", String(files.length));

    const res = await api.post("/api/documents", formData, {
      headers: authHeader(auth.token),
    });

    console.log("Upload successful:", res.data);

    // Store token locally with summary information
    localStorage.setItem("customerToken", JSON.stringify({
      token: token,
      status: "waiting",
      totalFiles: files.length
    }));

    console.log("Token stored in localStorage, navigating to /token");

    // Navigate to TokenPage
    navigate("/token");

  } catch (err) {
    console.error("Token generation failed:", err);
    alert("Something went wrong: " + (err.response?.data?.message || err.message));
  }
};

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

                {/* File List with Per-File Options */}
                {files.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Selected Files:</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {files.map((fileItem, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl"
                        >
                          {/* File Info Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0"></div>
                              <span className="text-sm text-gray-300 truncate font-medium">
                                {fileItem.file.name}
                              </span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ({(fileItem.file.size / 1024 / 1024).toFixed(2)} MB)
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
                          
                          {/* Per-File Print Options */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Print Type */}
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                                Print Type
                              </label>
                              <select
                                value={fileItem.printType}
                                onChange={(e) => updatePrintType(index, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#FF6B35] transition-colors"
                              >
                                <option value="B/W" className="bg-gray-900">Black & White</option>
                                <option value="Color" className="bg-gray-900">Color</option>
                              </select>
                            </div>
                            
                            {/* Copies */}
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                                Copies
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={fileItem.copies}
                                onChange={(e) => updateCopies(index, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-[#FF6B35] transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                <button
                  type="button"
                  onClick={handleGenerateToken}
                  disabled={loading || files.length === 0}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF8A50] disabled:opacity-50 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? "Generating Token..." : "Generate Token"}
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
