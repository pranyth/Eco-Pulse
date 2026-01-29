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

const socket = io("http://localhost:5000");

// 🔋 Battery capacity (2.5 MWh = 2500 kWh)
const BATTERY_CAPACITY_KWH = 2500;

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
        return updated.slice(-20);
      });
    });

    return () => {
      socket.off("energy:update");
    };
  }, []);

  if (!energy) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        Waiting for energy data…
      </div>
    );
  }

  // 🔋 Battery State of Charge (%)
  const batterySoC = Math.min(
    100,
    Math.max(0, (energy.batteryKWh / BATTERY_CAPACITY_KWH) * 100)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          🌱 Eco-Pulse Dashboard
        </h1>

        {/* ================= METRIC CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <MetricCard
            title="Solar"
            value={`${energy.solarKW} kW`}
            color="text-green-400"
          />
          <MetricCard
            title="Grid"
            value={`${energy.gridKW} kW`}
            color="text-orange-400"
          />
          <MetricCard
            title="Battery"
            value={`${energy.batteryKWh} kWh`}
            color="text-blue-400"
          />
          <MetricCard
            title="Status"
            value={energy.batteryState}
            color={
              energy.batteryState === "Charging"
                ? "text-green-400"
                : "text-orange-400"
            }
          />

          {/* 🔋 Battery SoC Card */}
          <div className="bg-slate-800 rounded-xl p-5 shadow-md">
            <p className="text-sm text-slate-400">Battery SoC</p>
            <p className="text-2xl font-semibold mt-2 text-cyan-400">
              {batterySoC.toFixed(1)}%
            </p>

            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  batterySoC > 60
                    ? "bg-green-400"
                    : batterySoC > 30
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{ width: `${batterySoC}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= CHART ================= */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            ⚡ Live Energy Trends
          </h2>

          {/* 🔧 FIXED HEIGHT CONTAINER */}
          <div className="w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#cbd5f5" />

                <YAxis
                  yAxisId="power"
                  stroke="#cbd5f5"
                  label={{
                    value: "Power (kW)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#cbd5f5",
                  }}
                />

                <YAxis
                  yAxisId="battery"
                  orientation="right"
                  stroke="#cbd5f5"
                  label={{
                    value: "Battery (kWh)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#cbd5f5",
                  }}
                />

                <Tooltip />
                <Legend />

                <Line
                  yAxisId="power"
                  type="monotone"
                  dataKey="solar"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="power"
                  type="monotone"
                  dataKey="grid"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
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
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-md">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-2xl font-semibold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

export default App;
