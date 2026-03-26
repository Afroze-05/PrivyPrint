import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAccount(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password, role: "admin" });
      navigate("/admin/login");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Admin Signup</h2>
          <div className="sp-divider" />

          <form onSubmit={handleCreateAccount}>
            <div className="sp-field">
              <div className="sp-label">Name</div>
              <input className="sp-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="sp-field">
              <div className="sp-label">Email</div>
              <input
                className="sp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div className="sp-field">
              <div className="sp-label">Password</div>
              <input
                className="sp-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            {error ? <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}>{error}</div> : null}

            <button className="sp-btn sp-btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: 14, color: "var(--sp-muted)", fontWeight: 700 }}>
            Already have an account?{" "}
            <button
              type="button"
              className="sp-btn sp-btn-secondary"
              onClick={() => navigate("/admin/login")}
              style={{ padding: "8px 12px", marginLeft: 8 }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

