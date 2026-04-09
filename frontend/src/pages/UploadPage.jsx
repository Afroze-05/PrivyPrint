import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ArrowLeft,
  ChevronRight,
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
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

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

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  }

  const handleGenerateToken = () => {
    if (files.length === 0) {
      alert("Please upload at least one file");
      return;
    }
    const token = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // STORE TOKEN BEFORE NAVIGATION (VERY IMPORTANT)
    localStorage.setItem("customerToken", JSON.stringify({
      token: token,
      status: "waiting"
    }));

    console.log("Token stored:", token);

    // NAVIGATE TO TOKEN PAGE
    navigate("/token");
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
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/home")}
          className="absolute -top-16 left-0 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-[#FF6B35] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-[#EAEAEA] leading-tight text-center">
            Upload <span className="text-[#FF6B35]">Document</span>
          </h1>

          <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden bg-white/5 shadow-2xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

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
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl"
                    >
                      {/* File Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-300 truncate font-medium">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateToken}
              disabled={files.length === 0}
              className="w-full bg-[#FF6B35] hover:bg-[#FF8A50] disabled:opacity-50 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
            >
              Generate Token
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
