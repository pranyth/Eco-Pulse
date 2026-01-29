# 🌱 Eco-Pulse — Energy Command Center for a Net-Zero Campus

Eco-Pulse is a **full-stack MERN Energy Command Center Dashboard** designed for monitoring and simulating energy flows in a **Net-Zero smart campus**.
It combines real-time IoT-like energy simulation, backend APIs, and scalable architecture to resemble an industrial energy monitoring system.

---

## 🚀 Project Overview

Eco-Pulse simulates and visualizes campus-level energy data, including:

* ☀️ Solar power generation
* ⚡ Grid energy consumption
* 🔋 Battery Energy Storage System (BESS) behavior
* 🛠️ Maintenance alerts for critical energy infrastructure

The system is built with **real-world constraints and logic**, not random data, making it suitable for learning, demos, and portfolio use.

---

## 🔋 Core Features

### ⚡ Real-Time Energy Simulator

* Simulates IoT telemetry every **5 seconds**
* Realistic energy fluctuations and limits
* Models:

  * Solar generation (kW)
  * Grid consumption (kW)
  * Battery Energy Storage (2.5 MWh BESS)
* Charging / Discharging logic based on supply vs demand

### 🧠 Backend Energy Engine

* Node.js + Express architecture
* Modular simulator engine
* Designed for real-time streaming (Socket.IO integration planned)

### 🛠️ Maintenance Log System

* MongoDB-backed CRUD APIs
* Track alerts for:

  * HVAC systems
  * Solar inverters
  * Battery systems
* Severity levels and status tracking (Open / Resolved)

### 🧩 Scalable Architecture

* Clear separation of concerns
* Simulator isolated from APIs
* Backend and frontend decoupled
* Cloud-ready design (local MongoDB for dev)

---

## 🧰 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB (Local for development)**
* **Mongoose**
* **Socket.IO (planned)**

### Frontend *(upcoming)*

* **React**
* **Tailwind CSS**
* **Recharts** (for live graphs)

---

## 🗂️ Project Structure

```
Eco-Pulse/
├── backend/
│   ├── simulator/        # Energy simulation engine
│   ├── models/           # MongoDB schemas
│   ├── routes/           # REST APIs
│   ├── server.js         # Backend entry point
│   └── .env              # Environment variables
├── frontend/             # React frontend (planned)
└── README.md
```

---

## ▶️ Running the Backend Locally

### 1️⃣ Install dependencies

```bash
cd backend
npm install
```

### 2️⃣ Set environment variables

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecopulse
```

### 3️⃣ Start the server

```bash
node server.js
```

### Expected output:

```
MongoDB connected 🌍
Eco-Pulse backend running on port 5000
⚡ Energy Update: { ... }
```

---

## 🌍 API Endpoints

### Maintenance Logs

```
GET    /api/maintenance
POST   /api/maintenance
PUT    /api/maintenance/:id
DELETE /api/maintenance/:id
```

---

## 🌱 Vision & Motivation

Eco-Pulse is inspired by **real industrial energy monitoring systems** used in:

* smart campuses
* renewable energy plants
* sustainability-focused infrastructure

The project emphasizes:

* real-time data flow
* energy-domain realism
* clean backend design
* production-oriented architecture

---

## 🛣️ Roadmap

* [x] Backend architecture setup
* [x] Energy simulator engine
* [x] Maintenance CRUD APIs
* [ ] Socket.IO real-time streaming
* [ ] React dashboard UI
* [ ] Live charts with Recharts
* [ ] Solar yield & carbon offset analytics
* [ ] Cloud deployment

---

## 📌 Author

**Pranith K**
Computer Science Engineering
Project: *Eco-Pulse – Energy Command Center*

---

## 🏷️ Tags

```
mern
nodejs
mongodb
iot-simulation
energy-dashboard
smart-campus
sustainability
socket-io
full-stack
```


