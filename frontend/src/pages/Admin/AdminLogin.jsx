import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { setAuth } from "../../services/authStorage";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      setAuth({ token, ...user });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Admin Login</h2>
          <div className="sp-divider" />

          <form onSubmit={handleLogin}>
            <div className="sp-field">
              <div className="sp-label">Email</div>
              <input
                className="sp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="admin@example.com"
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
                placeholder="Your password"
                required
              />
            </div>

            {error ? <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}>{error}</div> : null}

            <button className="sp-btn sp-btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: 14, color: "var(--sp-muted)", fontWeight: 700 }}>
            No admin account?{" "}
            <button
              type="button"
              className="sp-btn sp-btn-secondary"
              onClick={() => navigate("/admin/signup")}
              style={{ padding: "8px 12px", marginLeft: 8 }}
            >
              Create Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

