// ================================
// DNS FIX (Windows / ISP safe)
// ================================
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// ================================
// Imports
// ================================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const maintenanceRoutes = require("./routes/maintenance");
const simulateEnergy = require("./simulator/energySimulator");

// ================================
// App Init
// ================================
const app = express();

// ================================
// Middleware
// ================================
app.use(cors());
app.use(express.json());

// ================================
// MongoDB Connection (LOCAL)
// ================================
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connected 🌍");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ================================
// Routes
// ================================
app.get("/", (req, res) => {
  res.send("Eco-Pulse Backend is running 🌱");
});

app.use("/api/maintenance", maintenanceRoutes);

// ================================
// Energy Simulator Loop (Fake IoT)
// ================================
setInterval(() => {
  const energyData = simulateEnergy();
  console.log("⚡ Energy Update:", energyData);
}, 5000);

// ================================
// Start Server
// ================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Eco-Pulse backend running on port ${PORT}`);
});
