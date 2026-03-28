import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // UPDATED LINE BELOW:
      // We ensure 'otp' is a string and remove any accidental spaces
      await api.post("/auth/verify-otp", {
        email,
        otp: String(otp).trim(),
      });

      alert("Verification successful!");
      navigate("/login-selection");
    } catch (err) {
      // If you get "Invalid Code" here, the backend didn't find a match
      alert(err.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sp-page">
      <div className="sp-card" style={{ maxWidth: 450, margin: "80px auto" }}>
        <h2>Secure Verification</h2>
        <p>
          A code was sent to <strong>{email}</strong>
        </p>
        <form onSubmit={handleVerify}>
          <input
            className="sp-input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            className="sp-btn sp-btn-primary"
            style={{ width: "100%", marginTop: "20px" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
