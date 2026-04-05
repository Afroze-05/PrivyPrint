import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { setCustomerToken } from "../services/customerTokenStorage";
import { motion, AnimatePresence } from "framer-motion";
console.log(motion);
import {
  Upload,
  Printer,
  Hash,
  ArrowLeft,
  ChevronRight,
  Check,
  Mic,
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

  const [file, setFile] = useState(null);
  const [type, setType] = useState("B/W");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  console.log(uploadSuccess);

  // ✅ NEW: Store the token to show the user
  const [generatedToken, setGeneratedToken] = useState(null);

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

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      if (!auth?.token) throw new Error("Missing authentication token.");
      if (!file) throw new Error("Please select a PDF or image file.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("copies", String(copies));

      const res = await api.post("/upload", formData, {
        headers: authHeader(auth.token),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // ✅ NEW: Capture token from response
      const { token, expiresAt, status } = res.data;
      setGeneratedToken(token);

      setTimeout(() => {
        setUploadSuccess(true);
        setLoading(false);
        setIsUploaded(true);
      }, 500);

      setCustomerToken({ token, expiresAt, status: status || "waiting" });
      localStorage.setItem("printType", type);

      // ✅ INCREASED TIMEOUT: Gives user 6 seconds to see the Voice Print prompt
      setTimeout(() => {
        navigate("/token");
      }, 6000);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err?.response?.data?.message || err.message || "Upload failed.");
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden"
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

      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/home")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-[#FF6B35] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#EAEAEA] leading-tight">
          Upload <span className="text-[#FF6B35]">Document</span>
        </h1>

        <motion.form onSubmit={handleSubmit} className="relative">
          <div className="relative backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden bg-white/5 shadow-2xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* Success State Overlay */}
            <AnimatePresence>
              {isUploaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-50 bg-white p-8 flex flex-col items-center justify-between text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-black text-black">
                      SUCCESSFULLY SECURED
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Document is ready for printing
                    </p>

                    {/* ✅ TOKEN DISPLAY */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 w-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Your Print Token
                      </span>
                      <div className="text-4xl font-black text-[#FF6B35] tracking-tighter">
                        {generatedToken}
                      </div>
                    </div>
                  </div>

                  {/* ✅ VOICE PRINT PROMPT */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255, 107, 53, 0.1)",
                    }}
                    onClick={() => navigate("/voice-print")}
                    className="w-full mt-4 p-5 rounded-2xl border-2 border-dashed border-[#FF6B35]/30 bg-[#FF6B35]/5 flex flex-col items-center gap-2 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[#FF6B35]">
                      <Mic className="w-5 h-5 animate-pulse" />
                      <span className="font-bold text-sm uppercase tracking-widest">
                        Try Voice Print
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 italic">
                      Say: "Print token {generatedToken}"
                    </p>
                  </motion.button>

                  <p className="text-[10px] text-gray-400 mt-4">
                    Redirecting to status page shortly...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                {error}
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

            {!isUploaded && (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-12 mb-8 flex flex-col items-center gap-4 transition-all ${dragOver ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-white/10 bg-white/5"}`}
                >
                  <Upload
                    className={`w-8 h-8 ${dragOver ? "text-[#FF6B35]" : "text-gray-500"}`}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {file ? file.name : "Select your file"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF or Images supported
                    </p>
                  </div>
                </div>

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
                  disabled={loading || !file}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF8A50] disabled:opacity-50 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? "Processing..." : "Secure Upload"}
                  {!loading && <ChevronRight className="w-5 h-5" />}
                </button>
              </>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
