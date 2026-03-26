import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeader } from "../services/api";
import { getAuth } from "../services/authStorage";
import { setCustomerToken } from "../services/customerTokenStorage";

export default function UploadPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);

  const [file, setFile] = useState(null);
  const [type, setType] = useState("B/W");
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Upload Document</h2>
          <div className="sp-divider" />

          <form onSubmit={handleSubmit}>
            <div className="sp-field">
              <div className="sp-label">File Upload (PDF / Image)</div>
              <input
                className="sp-input"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div className="sp-field">
              <div className="sp-label">Select Type</div>
              <div className="sp-row">
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="radio"
                    checked={type === "B/W"}
                    onChange={() => setType("B/W")}
                  />
                  B/W
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="radio"
                    checked={type === "Color"}
                    onChange={() => setType("Color")}
                  />
                  Color
                </label>
              </div>
            </div>

            <div className="sp-field">
              <div className="sp-label">Number of copies</div>
              <input
                className="sp-input"
                type="number"
                min={1}
                value={copies}
                onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                required
              />
            </div>

            {error ? <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 14 }}>{error}</div> : null}

            <button className="sp-btn sp-btn-primary" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

