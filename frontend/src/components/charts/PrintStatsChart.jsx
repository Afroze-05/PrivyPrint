import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * PrintStatsChart Component
 * Displays print statistics from local storage for the selected date.
 * No backend dependency.
 */
const PrintStatsChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState([]);

  // Load data from localStorage whenever selectedDate changes
  useEffect(() => {
    const loadLocalStats = () => {
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[selectedDate] || { bw: 0, color: 0, total: 0 };

      // If no data exists for today, we can initialize it with dummy data for demo purposes if empty
      if (Object.keys(allStats).length === 0 && selectedDate === new Date().toISOString().split("T")[0]) {
        const dummyStats = {
          [selectedDate]: { bw: 15, color: 8, total: 23 }
        };
        localStorage.setItem("privyprint_local_stats", JSON.stringify(dummyStats));
        setData([
          { name: "B/W Prints", count: 15, color: "#1f6feb" },
          { name: "Color Prints", count: 8, color: "#3bbcd9" },
          { name: "Total Prints", count: 23, color: "#0f172a" },
        ]);
        return;
      }

      const chartData = [
        { name: "B/W Prints", count: dayStats.bw, color: "#1f6feb" },
        { name: "Color Prints", count: dayStats.color, color: "#3bbcd9" },
        { name: "Total Prints", count: dayStats.total, color: "#0f172a" },
      ];

      setData(chartData);
    };

    loadLocalStats();

    // Listen for storage events in case another tab updates the counts
    window.addEventListener("storage", loadLocalStats);
    // Custom event for same-tab updates
    window.addEventListener("localStatsUpdated", loadLocalStats);

    return () => {
      window.removeEventListener("storage", loadLocalStats);
      window.removeEventListener("localStatsUpdated", loadLocalStats);
    };
  }, [selectedDate]);

  return (
    <div style={{ width: "100%", marginTop: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, color: "var(--sp-ink)" }}>Today's Print Stats</div>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sp-input"
          style={{ width: "auto", padding: "4px 8px", fontSize: "14px" }}
        />
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "var(--sp-muted)", fontSize: 12, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "var(--sp-muted)", fontSize: 12, fontWeight: 700 }}
            />
            <Tooltip 
              cursor={{ fill: "rgba(15, 23, 42, 0.02)" }}
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--sp-border)",
                boxShadow: "var(--sp-shadow)",
                fontWeight: 700
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrintStatsChart;
