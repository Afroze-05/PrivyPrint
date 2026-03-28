import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setAuth } from "../services/authStorage";

export default function CustomerSignup() {
  const navigate = useNavigate();

  // Tab control from Afroze's version
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Logic for creating an account + OTP redirect
  async function handleCreateAccount(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role: "customer",
      });
      // Redirect to your OTP page with the email state
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  // Logic for login + OTP redirect if not verified
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
      // Check if backend says "notVerified"
      const isNotVerified = err?.response?.data?.notVerified;
      if (isNotVerified) {
        setError("Account not verified. Redirecting to OTP...");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 1500);
      } else {
        setError(
          err?.response?.data?.message || err.message || "Login failed.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {isLogin ? "Customer Login" : "Customer Signup"}
            </h2>
            <button
              className="sp-btn sp-btn-secondary"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Switch to Signup" : "Switch to Login"}
            </button>
          </div>
          <div className="sp-divider" />

          <form onSubmit={isLogin ? handleLogin : handleCreateAccount}>
            {!isLogin && (
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
            )}

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
                placeholder={
                  isLogin ? "Your password" : "Create a strong password"
                }
                required
              />
            </div>

            {error ? (
              <div
                style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}
              >
                {error}
              </div>
            ) : null}

            <button
              className="sp-btn sp-btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
