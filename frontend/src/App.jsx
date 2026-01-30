import { useEffect, useRef, useState } from "react";
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

/* =========================
   STYLES (UNCHANGED)
========================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e5e7eb",
    padding: "24px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "28px",
    fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#020617",
    borderRadius: "12px",
    padding: "16px",
  },
  label: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "6px",
  },
  value: {
    fontSize: "22px",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  alertCritical: {
    background: "rgba(239,68,68,0.18)",
    color: "#f87171",
    padding: "10px",
    borderRadius: "8px",
  },
  alertWarn: {
    background: "rgba(234,179,8,0.18)",
    color: "#fde047",
    padding: "10px",
    borderRadius: "8px",
  },
  alertInfo: {
    background: "rgba(56,189,248,0.18)",
    color: "#7dd3fc",
    padding: "10px",
    borderRadius: "8px",
  },
};

/* =========================
   PHASE 3.3 LOGIC
========================= */
const ALERT_COOLDOWN_MS = 15000; // prevents flicker

export default function App() {
  const [energy, setEnergy] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const alertMemory = useRef({}); // persists between renders

  useEffect(() => {
    socket.on("energy:update", (data) => {
      setEnergy(data);

      setHistory((prev) => [...prev.slice(-12), data]);

      evaluateSmartAlerts(data);
    });

    return () => socket.off("energy:update");
  }, []);

  /* =========================
     SMART ALERT ENGINE
  ========================= */
  function evaluateSmartAlerts(data) {
    const now = Date.now();
    const nextAlerts = [];

    function pushAlert(key, severity, message, reason) {
      if (
        !alertMemory.current[key] ||
        now - alertMemory.current[key] > ALERT_COOLDOWN_MS
      ) {
        alertMemory.current[key] = now;
        nextAlerts.push({ severity, message, reason });
      }
    }

    // 1️⃣ Grid dependency
    if (data.gridKw > data.solarKw * 1.3) {
      pushAlert(
        "GRID_DEP",
        "warning",
        "High dependency on grid power",
        "Grid usage exceeds solar generation by >30%"
      );
    }

    // 2️⃣ Battery critically low
    if (data.batteryKWh < 500) {
      pushAlert(
        "BAT_LOW",
        "critical",
        "Battery energy critically low",
        "Battery below 20% capacity"
      );
    }

    // 3️⃣ Battery charging inefficiency
    if (
      data.batteryState === "Charging" &&
      data.solarKw < data.gridKw
    ) {
      pushAlert(
        "INEFF_CHARGE",
        "info",
        "Battery charging inefficiently",
        "Charging relies on grid instead of solar"
      );
    }

    // 4️⃣ Heavy load scenario
    if (data.gridKw > 70 && data.batteryState === "Discharging") {
      pushAlert(
        "PEAK_LOAD",
        "warning",
        "Peak demand with battery discharge",
        "Risk of accelerated battery degradation"
      );
    }

    setAlerts(nextAlerts);
  }

  if (!energy) {
    return (
      <div style={styles.page}>
        <h2>Waiting for energy data…</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>🌱 Eco-Pulse Command Center</div>

        {/* METRICS */}
        <div style={styles.grid}>
          <Metric title="Solar Power" value={`${energy.solarKw} kW`} />
          <Metric title="Grid Load" value={`${energy.gridKw} kW`} />
          <Metric title="Battery Energy" value={`${energy.batteryKWh} kWh`} />
          <Metric title="Battery Power" value={`${energy.batteryPowerKw} kW`} />
          <Metric title="Battery SoC" value={`${energy.batterySoC}%`} />
        </div>

        {/* STATUS + ALERTS */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Battery Status</div>
            <p>{energy.batteryState}</p>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Smart Alerts</div>
            {alerts.length === 0 ? (
              <p style={{ color: "#4ade80" }}>All systems normal</p>
            ) : (
              alerts.map((a, i) => (
                <div
                  key={i}
                  style={
                    a.severity === "critical"
                      ? styles.alertCritical
                      : a.severity === "warning"
                      ? styles.alertWarn
                      : styles.alertInfo
                  }
                >
                  <strong>{a.message}</strong>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {a.reason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CARBON */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Carbon Impact</div>
          <p>Solar Energy: {energy.carbon.totalSolarEnergyKWh} kWh</p>
          <p>CO₂ Avoided: {energy.carbon.co2AvoidedKg} kg</p>
        </div>

        {/* CHART */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Live Energy Trends</div>
          <div style={{ height: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(t) =>
                    new Date(t).toLocaleTimeString()
                  }
                  stroke="#94a3b8"
                />
                <YAxis stroke="#94a3b8" />
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
                  stroke="#38bdf8"
                  name="Battery Power (kW)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   KPI COMPONENT
========================= */
function Metric({ title, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{title}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}
