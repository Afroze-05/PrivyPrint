import { useNavigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card">
          <h2 style={{ marginTop: 0 }}>Home</h2>
          <div className="sp-divider" />
          <div className="sp-grid-2">
            <button
              type="button"
              className="sp-card"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (auth?.token && auth.role === "customer") navigate("/upload");
                else navigate("/signup");
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800 }}>👤 Customer</div>
              <div style={{ color: "var(--sp-muted)", marginTop: 6 }}>User Flow</div>
            </button>

            <button
              type="button"
              className="sp-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/login")}
            >
              <div style={{ fontSize: 22, fontWeight: 800 }}>🧑‍💻 Admin</div>
              <div style={{ color: "var(--sp-muted)", marginTop: 6 }}>Admin Login Page</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

