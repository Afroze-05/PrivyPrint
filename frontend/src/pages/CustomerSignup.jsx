import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";

export default function CustomerSignup() {
  const navigate = useNavigate();
  
  // Tab control: signup or login
  const [isLogin, setIsLogin] = useState(false);

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
      // Create user (customer).
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role: "customer",
      });

      // Auto-login after signup
      const loginRes = await api.post("/auth/login", { email, password });
      const { token, user } = loginRes.data;

      setAuth({ token, ...user });
      navigate("/upload");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginRes = await api.post("/auth/login", { email, password });
      const { token, user } = loginRes.data;

      setAuth({ token, ...user });
      navigate("/upload");
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ marginTop: 0 }}>{isLogin ? "Customer Login" : "Customer Signup"}</h2>
            <button 
              className="sp-btn sp-btn-secondary" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Switch to Signup" : "Switch to Login"}
            </button>
          </div>
          <div className="sp-divider" />

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="sp-field">
                <div className="sp-label">Email</div>
                <input
                  className="sp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
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
          ) : (
            <form onSubmit={handleCreateAccount}>
              <div className="sp-field">
                <div className="sp-label">Name</div>
                <input
                  className="sp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="sp-field">
                <div className="sp-label">Email</div>
                <input
                  className="sp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
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
                  placeholder="Create a strong password"
                  required
                />
              </div>

              {error ? (
                <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}>{error}</div>
              ) : null}

              <button
                className="sp-btn sp-btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
