# 🌱 Eco-Pulse — Real-Time Energy Command Center

Eco-Pulse is a full-stack real-time **Energy Monitoring & Decision Dashboard** designed for smart campuses and net-zero infrastructure.

It simulates live IoT telemetry for **solar generation, grid usage, and battery storage (BESS)**, processes it on the backend, and visualizes it through a modern command-center UI with **live charts, carbon analytics, and smart alerts**.

---

## 🚀 Features

### ⚡ Real-Time Energy Monitoring
- Solar power generation (kW)
- Grid load consumption (kW)
- Battery energy & power (kWh / kW)
- Battery State of Charge (SoC)
- Live updates via **WebSockets (Socket.IO)**

### 📊 Live Analytics Dashboard
- Streaming line charts (Recharts)
- Multi-source energy comparison
- Battery charging/discharging behavior
- Responsive, command-center style UI

### 🧠 Smart Alerts (Rule-Based Intelligence)
- High grid dependency warnings
- Low battery critical alerts
- Inefficient charging detection
- Peak demand risk alerts
- Cooldown logic to prevent alert spam

### 🌍 Carbon Impact Tracking
- Total solar energy generated (kWh)
- CO₂ emissions avoided (kg)
- Continuous accumulation over time

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Socket.IO Client
- Recharts
- Custom dark-mode dashboard styling

### Backend
- Node.js + Express
- Socket.IO Server
- MongoDB (Atlas)
- Modular energy simulation engine

---

## 🧪 How It Works

1. Backend simulates real-time energy data every 5 seconds
2. Data is broadcast to all connected clients via WebSockets
3. Frontend updates KPIs, charts, alerts, and carbon metrics live
4. Smart alert engine evaluates system health continuously

---

## ▶️ Running Locally

### Backend
```bash
cd backend
npm install
node server.js
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

📌 Project Status

✅ Phase 1 — Backend simulation & APIs
✅ Phase 2 — Real-time dashboard UI
✅ Phase 3 — Smart alerts & analytics

This version represents a complete, resume-ready system.

📈 Possible Future Enhancements

Predictive battery SoC forecasting

Alert history & audit logs

Role-based dashboards (admin/operator)

Deployment on cloud (Render / Vercel)

Real IoT sensor integration

👤 Author

Pranith K
B.Tech CSE
Focus: Full-Stack Systems, Cloud & Energy Tech
