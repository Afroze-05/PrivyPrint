export default function BarChart({ data }) {
  // data: [{date: 'YYYY-MM-DD', count: number}]
  const points = Array.isArray(data) ? data : [];
  const max = points.reduce((m, p) => Math.max(m, p.count || 0), 0) || 1;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {points.map((p) => {
          const h = Math.max(2, Math.round(((p.count || 0) / max) * 130));
          const label = p.date?.slice(5) || p.date;
          return (
            <div key={p.date} style={{ width: 46, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                title={`${p.date}: ${p.count} prints`}
                style={{
                  width: "100%",
                  height: h,
                  background: "linear-gradient(180deg, rgba(31,111,235,0.9) 0%, rgba(59,188,217,0.65) 100%)",
                  borderRadius: 12,
                  border: "1px solid rgba(15,23,42,0.12)",
                }}
              />
              <div style={{ marginTop: 10, fontSize: 12, fontWeight: 800, color: "rgba(15,23,42,0.65)" }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

