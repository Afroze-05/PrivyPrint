import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { setCustomerToken } from "../services/customerTokenStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Printer, Hash, Cpu,
  ArrowLeft, ChevronRight, X, ImageIcon,
} from "lucide-react";

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, #3BBCD9 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.08,
    }}
  />
);

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="h-px w-6 bg-[#3BBCD9]/50" />
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
    try {
      if (!auth?.token) throw new Error("Missing authentication token.");
      if (!file) throw new Error("Please select a PDF or image file.");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("copies", String(copies));

      const res = await api.post("/upload", formData, {
        headers: {
          ...authHeader(auth.token),
          "Content-Type": "multipart/form-data",
        },
      });

      const { token, expiresAt, status } = res.data;
      setCustomerToken({ token, expiresAt, status: status || "waiting" });
      navigate("/token");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  const isPDF = file?.type === "application/pdf";
  const fileSizeKB = file ? (file.size / 1024).toFixed(1) : null;

  return (
    <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 py-12 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#3BBCD9" size={460} top="-8%" left="-6%" delay={0} />
      <GlowOrb color="#D91828" size={340} top="50%" left="62%" delay={2} />
      <GlowOrb color="#D9910D" size={220} top="70%" left="10%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/20 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#3BBCD9]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/15 to-transparent" />

      {/* System tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-[#3BBCD9]/40" />
        <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
          PrivyPrint OS v4.2
        </span>
      </div>

      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate("/home")}
        className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#3BBCD9] transition-colors duration-300 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-[9px] font-black tracking-[0.45em] uppercase">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-8 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
          <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
            Secure Upload
          </span>
        </motion.div>

        {/* Title */}
        <h1
          style={{ fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace', lineHeight: 0.88 }}
          className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase select-none mb-5"
        >
          Upload{" "}
          <span className="text-[#3BBCD9]" style={{ textShadow: "0 0 45px rgba(59,188,217,0.4)" }}>
            Document
          </span>
        </h1>
        <div className="w-full h-[2px] bg-gradient-to-r from-[#3BBCD9] via-[#D9910D] to-transparent mb-8" />

        {/* Form panel */}
        <form onSubmit={handleSubmit}>
          <div
            className="relative bg-[#0E1A21] border border-white/6 p-7 overflow-hidden"
            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3BBCD9] via-[#D9910D] to-transparent" />
            <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#3BBCD9]/30" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top left, rgba(59,188,217,0.04) 0%, transparent 60%)" }} />

            <div className="relative z-10 flex flex-col gap-7">

              {/* ── File drop zone ── */}
              <div>
                <SectionLabel>File Upload (PDF / Image)</SectionLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <motion.div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  animate={{ borderColor: dragOver ? "rgba(59,188,217,0.5)" : "rgba(255,255,255,0.07)" }}
                  className="relative cursor-pointer border border-dashed border-white/8 hover:border-[#3BBCD9]/40 transition-all duration-300 p-8 flex flex-col items-center gap-3 bg-[#0C1519]/60"
                  style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" }}
                >
                  {dragOver && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ background: "rgba(59,188,217,0.04)" }}
                    />
                  )}

                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-4 w-full"
                      >
                        <div className="p-3 bg-[#3BBCD9]/10 border border-[#3BBCD9]/20 flex-shrink-0">
                          {isPDF
                            ? <FileText className="w-6 h-6 text-[#3BBCD9]" />
                            : <ImageIcon className="w-6 h-6 text-[#3BBCD9]" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-white/30 font-bold tracking-widest mt-0.5 uppercase">
                            {isPDF ? "PDF Document" : "Image"} · {fileSizeKB} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="p-1.5 border border-white/10 hover:border-[#D91828]/40 text-white/20 hover:text-[#D91828] transition-all duration-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3 text-center"
                      >
                        <div className="p-4 bg-[#3BBCD9]/6 border border-[#3BBCD9]/15">
                          <Upload className="w-7 h-7 text-[#3BBCD9]/60" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white/40 uppercase tracking-widest">
                            Drop file here
                          </p>
                          <p className="text-[10px] text-white/20 font-bold tracking-widest mt-1 uppercase">
                            or click to browse · PDF / Image
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* ── Print type ── */}
              <div>
                <SectionLabel>Select Type</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["B/W", "Color"].map((opt) => (
                    <motion.button
                      key={opt}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setType(opt)}
                      className="relative flex items-center gap-3 p-4 border transition-all duration-300 overflow-hidden"
                      style={{
                        borderColor: type === opt ? "rgba(59,188,217,0.5)" : "rgba(255,255,255,0.07)",
                        background: type === opt ? "rgba(59,188,217,0.06)" : "transparent",
                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                      }}
                    >
                      {type === opt && (
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#3BBCD9] to-transparent" />
                      )}
                      <Printer
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: type === opt ? "#3BBCD9" : "rgba(255,255,255,0.2)" }}
                      />
                      <span
                        className="text-xs font-black uppercase tracking-[0.3em] transition-colors duration-300"
                        style={{ color: type === opt ? "white" : "rgba(255,255,255,0.3)" }}
                      >
                        {opt}
                      </span>
                      {/* Selected dot */}
                      <div
                        className="ml-auto w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                          background: type === opt ? "#3BBCD9" : "transparent",
                          boxShadow: type === opt ? "0 0 6px #3BBCD9" : "none",
                          border: type === opt ? "none" : "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── Copies ── */}
              <div>
                <SectionLabel>Number of Copies</SectionLabel>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Hash className="w-4 h-4 text-white/20 group-focus-within:text-[#3BBCD9] transition-colors duration-300" />
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-full bg-[#0C1519] border border-white/8 text-white text-sm font-black
                      placeholder:text-white/20 focus:outline-none focus:border-[#3BBCD9]/50
                      transition-all duration-300 py-4 pr-4 pl-11 tracking-widest"
                    style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#3BBCD9]/0 group-focus-within:bg-[#3BBCD9]/50 transition-all duration-300" />
                </div>
              </div>

              {/* ── Error ── */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D91828] flex-shrink-0" />
                  <span className="text-[#D91828] text-xs font-bold">{error}</span>
                </motion.div>
              )}

              {/* ── Submit ── */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="relative overflow-hidden group w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </motion.button>

            </div>
          </div>
        </form>
      </motion.div>

      {/* Floating status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#3BBCD9]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
      >
        <span className="text-[10px] font-black text-[#3BBCD9] uppercase tracking-[0.35em]">
          System Live
        </span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}