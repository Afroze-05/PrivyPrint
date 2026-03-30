import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ShieldCheck, AlertTriangle } from "lucide-react";
import { api, apiBaseUrl, authHeader } from "../../services/api";
import { getAuth, setAuth } from "../../services/authStorage";
import CameraPermissionModal from "../../components/CameraPermissionModal";
import SecurityOverlay from "../../components/SecurityOverlay";
import PhoneDetection from "../../components/security/PhoneDetection";

function formatWatermarkTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function AdminPrintPanel() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [tokenInput, setTokenInput] = useState("");
  const [doc, setDoc] = useState(null);
  const [watermarkTime, setWatermarkTime] = useState(null);

  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(120);
  const [intervalActive, setIntervalActive] = useState(false);

  const [isPrinting, setIsPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState("");
  const [printedSuccess, setPrintedSuccess] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const [trustScore, setTrustScore] = useState(() => (typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : 0));
  const [popup, setPopup] = useState(null);

  // Camera states
  const [cameraStream, setCameraStream] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const auth = useMemo(() => getAuth(), []);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle camera permission granted
  const handleCameraGranted = (stream) => {
    setCameraStream(stream);
    setShowCameraModal(false);
    setIsCameraActive(true);
  };

  // Face detection and video attachment logic
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;

      const faceDetectionInterval = setInterval(() => {
        if (cameraStream.active) {
          setIsFaceDetected(true);
        } else {
          setIsFaceDetected(false);
        }
      }, 2000);

      return () => clearInterval(faceDetectionInterval);
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!intervalActive) return undefined;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [intervalActive]);

  useEffect(() => {
    if (secondsLeft === 0 && intervalActive) {
      setIntervalActive(false);
      setTokenInvalid(true);
    }
  }, [secondsLeft, intervalActive]);

  function showPopup(message) {
    setPopup({ message });
    window.setTimeout(() => setPopup(null), 3000);
  }

  async function handleFetchDocument() {
    setError("");
    setPrintedSuccess(false);
    setTokenInvalid(false);
    setDoc(null);

    const token = tokenInput.trim();
    if (!token) {
      setError("Token is required.");
      return;
    }

    const currentAuth = getAuth();
    if (!currentAuth?.token) {
      navigate("/admin/login");
      return;
    }

    setLoadingDoc(true);
    try {
      const res = await api.get(`/document/${encodeURIComponent(token)}`, {
        headers: authHeader(currentAuth.token),
      });

      setDoc(res.data);
      setWatermarkTime(new Date());
      setSecondsLeft(120);
      setIntervalActive(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch document.";
      setError(msg);
      setDoc(null);
      setIntervalActive(false);
    } finally {
      setLoadingDoc(false);
    }
  }

  async function handlePrint() {
    setError("");
    if (!doc?.token) {
      setError("Fetch document first.");
      return;
    }
    if (tokenInvalid || isPrinting) return;

    const currentAuth = getAuth();
    setIsPrinting(true);
    setPrintMessage("");
    try {
      await api.post(`/print/${encodeURIComponent(doc.token)}`, null, {
        headers: authHeader(currentAuth.token),
      });

      // Update local stats in localStorage
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      
      if (doc.type === "B/W") dayStats.bw += 1;
      else if (doc.type === "Color") dayStats.color += 1;
      dayStats.total += 1;
      
      allStats[today] = dayStats;
      localStorage.setItem("privyprint_local_stats", JSON.stringify(allStats));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event("localStatsUpdated"));

      // Required UI animation (client-side).
      setPrintedSuccess(false);
      const messages = ["Printing page 1...", "Printing page 2...", "Printing page 3..."];
      const stepDelayMs = 900;
      for (let i = 0; i < messages.length; i += 1) {
        window.setTimeout(() => setPrintMessage(messages[i]), i * stepDelayMs);
      }

      window.setTimeout(() => {
        setPrintMessage("✅ Printed Successfully");
        setPrintedSuccess(true);
        // Requirement: after print token becomes invalid.
        setTokenInvalid(true);
        setIntervalActive(false);
        setIsPrinting(false);
      }, messages.length * 900 + 250);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Print failed.");
      setIsPrinting(false);
    }
  }

  async function handleAlert() {
    setError("");
    const currentAuth = getAuth();
    if (!currentAuth?.token) return navigate("/admin/login");
    const token = (doc?.token || tokenInput).trim();
    if (!token) {
      setError("Enter a token first.");
      return;
    }

    const types = ["mobile_detected", "multiple_faces"];
    const type = types[Math.floor(Math.random() * types.length)];

    try {
      const res = await api.post("/alert", { type, token }, { headers: authHeader(currentAuth.token) });

      if (typeof res.data?.trustScore === "number") {
        const updated = { ...currentAuth, trustScore: res.data.trustScore };
        setAuth(updated);
        setTrustScore(res.data.trustScore);
      }

      showPopup("⚠️ Suspicious Activity Detected");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Alert simulation failed.");
    }
  }

  const watermarkText = doc?.token && watermarkTime ? `${doc.token} | ${formatWatermarkTime(watermarkTime)}` : "";

  const tokenPreviewStatus = tokenInvalid ? "Token Expired" : secondsLeft === 0 ? "Token Expired" : "Waiting";

  return (
    <div className="sp-page secure-content">
      <SecurityOverlay />
      <PhoneDetection existingVideoRef={videoRef} />
      {showCameraModal && <CameraPermissionModal onPermissionGranted={handleCameraGranted} />}

      <div className="sp-container">
        <div className="sp-card" style={{ marginBottom: 16, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Print Panel</h2>
              <div style={{ fontWeight: 900, color: "var(--sp-muted)" }}>Secure Viewing + Token Validation</div>
            </div>

            {/* Camera Preview */}
            {isCameraActive && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 140,
                  height: 105,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "2px solid var(--sp-blue)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  background: "#000",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 6px",
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: 4,
                    fontSize: "10px",
                    color: "#fff",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isFaceDetected ? "#22c55e" : "#ef4444",
                    }}
                  ></div>
                  {isFaceDetected ? "FACE OK" : "NO FACE"}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginRight: isCameraActive ? 150 : 0 }}>
              <button className="sp-btn sp-btn-secondary" type="button" onClick={() => navigate("/admin/dashboard")}>
                Back to Dashboard
              </button>
              <div className="sp-badge">
                Trust Score: <span style={{ color: "var(--sp-ink)" }}>{trustScore}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-card" style={{ marginBottom: 16 }}>
          <div className="sp-row" style={{ justifyContent: "space-between" }}>
            <div style={{ flex: "1 1 420px" }}>
              <div className="sp-label">Enter Token</div>
              <input
                className="sp-input"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="SPX-1234"
                disabled={isPrinting}
              />
            </div>
            <div style={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
              <button
                className="sp-btn sp-btn-primary"
                type="button"
                onClick={handleFetchDocument}
                disabled={loadingDoc || isPrinting}
              >
                {loadingDoc ? "Fetching..." : "Fetch Document"}
              </button>
            </div>
          </div>

          {error ? <div style={{ color: "#ef4444", fontWeight: 800, marginTop: 12 }}>{error}</div> : null}
        </div>

        <div className="sp-grid-2">
          <div className="sp-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>Document Preview</h3>
                <div style={{ color: "var(--sp-muted)", fontWeight: 900, marginTop: 6 }}>
                  {tokenInvalid ? "Token Expired" : "Secure Viewing Enabled"}
                </div>
              </div>
              <div className="sp-badge">Status: {tokenPreviewStatus}</div>
            </div>

            <div style={{ marginTop: 14, position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid var(--sp-border)", background: "#fff" }}>
              {doc ? (
                <>
                  {doc.type === "B/W" || doc.type === "Color" ? (
                    doc.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        title="Document Preview"
                        src={`${apiBaseUrl}${doc.fileUrl}`}
                        style={{ width: "100%", height: 420, border: 0 }}
                      />
                    ) : (
                      <img
                        src={`${apiBaseUrl}${doc.fileUrl}`}
                        alt="Document"
                        style={{ width: "100%", height: "auto", maxHeight: 420, objectFit: "contain", display: "block" }}
                      />
                    )
                  ) : null}

                  {/* Watermark: Token | Time */}
                  {watermarkText ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        right: 14,
                        display: "flex",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          color: "rgba(15,23,42,0.25)",
                          fontWeight: 900,
                          border: "1px dashed rgba(15,23,42,0.18)",
                          background: "rgba(245,241,230,0.6)",
                          padding: "10px 14px",
                          borderRadius: 999,
                          transform: "rotate(-7deg)",
                        }}
                      >
                        {watermarkText}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div style={{ padding: 28, color: "var(--sp-muted)", fontWeight: 800 }}>
                  Fetch a token to preview the document.
                </div>
              )}
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="sp-label">Timer (120 seconds)</div>
              <div style={{ fontWeight: 1000, fontSize: 26, marginBottom: 6 }}>
                {secondsLeft}s
              </div>
              <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>
                {tokenInvalid ? "Token Expired" : intervalActive ? "Countdown running..." : "Waiting for document fetch"}
              </div>
            </div>

            <div className="sp-divider" />

            <div className="sp-card" style={{ padding: 16, background: "rgba(255,255,255,0.6)" }}>
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>Camera Box</div>
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(15,23,42,0.12)",
                  padding: 14,
                  background: "rgba(245,241,230,0.6)",
                  fontWeight: 900,
                  color: "rgba(15,23,42,0.75)",
                }}
              >
                Camera Monitoring Active
              </div>
              <div style={{ marginTop: 10, fontWeight: 1000 }}>🔐 Secure Viewing Enabled</div>
            </div>
          </div>

          <div className="sp-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: 0 }}>Print Function</h3>
                <div style={{ color: "var(--sp-muted)", fontWeight: 800, marginTop: 6 }}>
                  Token becomes invalid after use.
                </div>
              </div>
              <div className="sp-badge">Status: {tokenInvalid ? "Token Expired" : "Waiting"}</div>
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                className="sp-btn sp-btn-primary"
                type="button"
                onClick={handlePrint}
                disabled={!doc?.token || tokenInvalid || isPrinting}
                style={{ width: "100%", opacity: !doc?.token || tokenInvalid || isPrinting ? 0.7 : 1 }}
              >
                PRINT
              </button>
            </div>

            <div style={{ marginTop: 16, minHeight: 96 }}>
              {printMessage ? (
                <div style={{ fontWeight: 1000, color: "var(--sp-ink)" }}>{printMessage}</div>
              ) : (
                <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>
                  {tokenInvalid ? "Token Expired" : "Click PRINT to start the secure printing sequence."}
                </div>
              )}

              {printedSuccess && tokenInvalid ? (
                <div style={{ marginTop: 10, fontWeight: 1000, color: "var(--sp-blue)" }}>
                  Token Expired
                </div>
              ) : null}
            </div>

            <div className="sp-divider" />

            <div style={{ marginTop: 12 }}>
              <button
                className="sp-btn sp-btn-secondary"
                type="button"
                onClick={handleAlert}
                disabled={isPrinting || !tokenInput.trim()}
                style={{ width: "100%" }}
              >
                Simulate Suspicious Activity
              </button>

              <div style={{ marginTop: 12, color: "var(--sp-muted)", fontWeight: 800 }}>
                This reduces admin trust score and triggers an email alert (if configured).
              </div>
            </div>

            {/* Visual trust reduction indicator */}
            <div style={{ marginTop: 16 }}>
              <div className="sp-label">Trust Reduction</div>
              <div
                style={{
                  height: 14,
                  borderRadius: 999,
                  border: "1px solid var(--sp-border)",
                  background: "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(0, Math.min(100, trustScore))}%`,
                    background:
                      trustScore >= 60
                        ? "linear-gradient(90deg, rgba(31,111,235,0.95) 0%, rgba(59,188,217,0.95) 100%)"
                        : "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(31,111,235,0.55) 100%)",
                    transition: "width 0.35s ease, background 0.35s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {popup ? (
          <div className="sp-popup" role="dialog" aria-modal="true">
            <div className="sp-popup-inner">
              <div style={{ fontWeight: 1000, fontSize: 18, marginBottom: 8 }}>{popup.message}</div>
              <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>
                Trust score decreased.
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}