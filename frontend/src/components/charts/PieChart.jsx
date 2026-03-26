import React from "react";

export default function PieChart({ values }) {
  // values: { "B/W": number, Color: number }
  const bw = values?.["B/W"] || 0;
  const color = values?.Color || 0;
  const total = bw + color;

  const bwPct = total ? (bw / total) * 100 : 0;

  const bwColor = "#1f6feb";
  const colorColor = "#3bbcd9";

  const background = total
    ? `conic-gradient(${bwColor} 0% ${bwPct}%, ${colorColor} ${bwPct}% 100%)`
    : `conic-gradient(${bwColor} 0% 50%, ${colorColor} 50% 100%)`;

  return (
    <div>
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: "999px",
          background,
          margin: "0 auto",
          border: "1px solid rgba(15, 23, 42, 0.12)",
          position: "relative",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: "999px",
            background: "rgba(245, 241, 230, 0.9)",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            color: "rgba(15, 23, 42, 0.75)",
          }}
        >
          {total} prints
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
        <div className="sp-badge">
          <span style={{ width: 10, height: 10, background: bwColor, borderRadius: 999 }} />
          B/W: {bw}
        </div>
        <div className="sp-badge">
          <span style={{ width: 10, height: 10, background: colorColor, borderRadius: 999 }} />
          Color: {color}
        </div>
      </div>
    </div>
  );
}

