import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mic, MicOff, ArrowLeft, Loader2 } from "lucide-react";

const VoicePrint = () => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const recognitionRef = useRef(null);

  // Matches both numeric "4582" AND alphanumeric "copama3"
  // Looks for the word token/number/id followed by the actual token value
  const parseToken = (text) => {
    // Try: "token copama3" or "token 4582"
    const withKeyword = text.match(
      /(?:token|number|id)\s+([a-zA-Z0-9]{3,12})/i,
    );
    if (withKeyword) return withKeyword[1];

    // Fallback: last word that looks like a token (alphanumeric, 3-12 chars)
    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    if (/^[a-zA-Z0-9]{3,12}$/.test(lastWord)) return lastWord;

    return null;
  };

  const handleVoiceCommand = useCallback(async (text) => {
    const token = parseToken(text);

    if (!token) {
      setStatus("error");
      setMessage(
        `Couldn't find a token in: "${text}". Try saying "print token ABC123"`,
      );
      return;
    }

    setStatus("processing");
    setMessage(`Sending request for token "${token}"…`);

    try {
      const res = await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, transcript: text }), // send full transcript too
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || `Request sent for token "${token}"!`);
      } else {
        setStatus("error");
        setMessage(data.error || "Request failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach print server. Is the backend running?");
    }
  }, []);
  //voice Recognisition API setup and event handlers
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition; //webkit is for chrome / safari

    if (!SpeechRecognition) {
      setStatus("error");
      setMessage("Web Speech API not supported. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; //no continuos listening
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text); //  shows on screen immediately
      handleVoiceCommand(text);
    };

    recognition.onerror = (event) => {
      setStatus("error");
      setMessage(
        event.error === "not-allowed"
          ? "Microphone access denied. Allow mic in browser settings."
          : `Mic error: ${event.error}`,
      );
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, [handleVoiceCommand]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatus("error");
      setMessage("Speech recognition unavailable.");
      return;
    }
    setTranscript("");
    setMessage("");
    setStatus("listening");
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch (err) {
      setStatus("error");
      setMessage(`Could not start: ${err.message}`);
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    if (status === "listening") setStatus("idle");
  };

  const statusConfig = {
    idle: { color: "#999", label: "Ready" },
    listening: { color: "#E24B4A", label: "Listening…" },
    processing: { color: "#FF6B35", label: "Processing…" },
    success: { color: "#22c55e", label: "Success!" },
    error: { color: "#ef4444", label: "Error" },
  };

  const current = statusConfig[status];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
      }}
    >
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-[#FF6B35] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold tracking-widest uppercase">
          Back
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md flex flex-col items-center gap-8"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Voice <span className="text-[#FF6B35]">Print</span>
          </h1>
          <p className="text-sm text-white/40">
            Say:{" "}
            <em className="text-white/60">
              "Print my document with token copama3"
            </em>
          </p>
        </div>

        {/* Mic Button */}
        <motion.button
          onClick={listening ? stopListening : startListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all duration-300"
          style={{
            background: listening
              ? "rgba(226,75,74,0.15)"
              : "rgba(255,107,53,0.1)",
            borderColor: listening ? "#E24B4A" : "#FF6B35",
            boxShadow: listening
              ? "0 0 40px rgba(226,75,74,0.3)"
              : "0 0 20px rgba(255,107,53,0.15)",
          }}
          animate={listening ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {listening ? (
            <MicOff className="w-10 h-10 text-[#E24B4A]" />
          ) : (
            <Mic className="w-10 h-10 text-[#FF6B35]" />
          )}
        </motion.button>

        <p
          className="text-sm font-bold tracking-widest uppercase"
          style={{ color: current.color }}
        >
          {current.label}
        </p>

        {/* Transcript box — always visible, fills in after stop */}
        <div
          className="w-full rounded-xl border p-4 min-h-[80px] flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {listening ? (
            <div className="flex items-center gap-3 text-white/40">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Listening for your voice…</span>
            </div>
          ) : transcript ? (
            <p className="text-white text-sm text-center leading-relaxed">
              <span className="text-white/40 text-xs block mb-1 uppercase tracking-widest">
                You said
              </span>
              "{transcript}"
            </p>
          ) : (
            <p className="text-white/20 text-sm text-center">
              Your spoken text will appear here after you stop
            </p>
          )}
        </div>

        {/* Status message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl p-4 text-sm text-center"
            style={{
              background:
                status === "success"
                  ? "rgba(34,197,94,0.1)"
                  : status === "error"
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(255,107,53,0.1)",
              border: `1px solid ${current.color}30`,
              color: current.color,
            }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VoicePrint;
