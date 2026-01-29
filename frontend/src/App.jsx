import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Connect to backend Socket.IO server
const socket = io("http://localhost:5000");

function App() {
  const [energy, setEnergy] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Eco-Pulse backend");
    });

    socket.on("energy:update", (data) => {
      setEnergy(data);

      setHistory((prev) => {
        const updated = [
          ...prev,
          {
            time: new Date(data.timestamp).toLocaleTimeString(),
            solar: data.solarKW,
            grid: data.gridKW,
            battery: data.batteryKWh,
          },
        ];

        // Keep only last 20 points
        return updated.slice(-20);
      });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.IO error:", err.message);
    });

    return () => {
      socket.off("energy:update");
    };
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", background: "#1f2933", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        🌱 Eco-Pulse Dashboard
      </h1>

      {!energy ? (
        <p>Waiting for energy data...</p>
      ) : (
        <>
          {/* =======================
              LIVE METRICS
          ======================= */}
          <div style={{ marginBottom: "2rem", lineHeight: "1.8" }}>
            <p><strong>Solar:</strong> {energy.solarKW} kW</p>
            <p><strong>Grid:</strong> {energy.gridKW} kW</p>
            <p><strong>Battery:</strong> {energy.batteryKWh} kWh</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    energy.batteryState === "Charging" ? "#22c55e" : "#f97316",
                }}
              >
                {energy.batteryState}
              </span>
            </p>
            <p>
              <strong>Last update:</strong>{" "}
              {new Date(energy.timestamp).toLocaleTimeString()}
            </p>
          </div>

          {/* =======================
              LIVE ENERGY CHART
          ======================= */}
          <h2 style={{ marginBottom: "1rem" }}>⚡ Live Energy Trends</h2>

          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

                <XAxis dataKey="time" stroke="#9ca3af" />

                {/* Left Y-axis: Solar & Grid */}
                <YAxis
                  yAxisId="power"
                  stroke="#9ca3af"
                  label={{
                    value: "Power (kW)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#9ca3af",
                  }}
                />

                {/* Right Y-axis: Battery */}
                <YAxis
                  yAxisId="battery"
                  orientation="right"
                  stroke="#9ca3af"
                  label={{
                    value: "Battery (kWh)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#9ca3af",
                  }}
                />

                <Tooltip />
                <Legend />

                {/* Solar Line */}
                <Line
                  yAxisId="power"
                  type="monotone"
                  dataKey="solar"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />

                {/* Grid Line */}
                <Line
                  yAxisId="power"
                  type="monotone"
                  dataKey="grid"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />

                {/* Battery Line */}
                <Line
                  yAxisId="battery"
                  type="monotone"
                  dataKey="battery"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
