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

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function App() {
  const [energy, setEnergy] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to Eco-Pulse backend");
    });

    socket.on("energy:update", (data) => {
      setEnergy(data);
      setHistory((prev) => [...prev.slice(-14), data]);
    });

    return () => {
      socket.off("energy:update");
    };
  }, []);

  if (!energy) return <h2>Waiting for energy data…</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>🌱 Eco-Pulse Dashboard</h1>

      <p>Solar: {energy.solarKw} kW</p>
      <p>Grid: {energy.gridKw} kW</p>
      <p>Battery Energy: {energy.batteryKWh} kWh</p>
      <p>Battery Power: {energy.batteryPowerKw} kW</p>
      <p>Status: {energy.batteryState}</p>
      <p>Battery SoC: {energy.batterySoC}%</p>

      {/* Smart Alerts */}
      <h3>🚨 Smart Alerts</h3>
      {energy.alerts.length === 0 ? (
        <p>No active alerts</p>
      ) : (
        <ul>
          {energy.alerts.map((a, i) => (
            <li key={i}>
              [{a.severity.toUpperCase()}] {a.message}
            </li>
          ))}
        </ul>
      )}

      <h3>⚡ Live Energy Trends</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) =>
              new Date(t).toLocaleTimeString()
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="solarKw"
            stroke="#22c55e"
            name="Solar (kW)"
          />
          <Line
            type="monotone"
            dataKey="gridKw"
            stroke="#f97316"
            name="Grid (kW)"
          />
          <Line
            type="monotone"
            dataKey="batteryPowerKw"
            stroke="#3b82f6"
            name="Battery Power (kW)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
