const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

// CREATE a new maintenance log
router.post("/", async (req, res) => {
  try {
    const log = await Maintenance.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all maintenance logs
router.get("/", async (req, res) => {
  try {
    const logs = await Maintenance.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a maintenance log (status / severity)
router.put("/:id", async (req, res) => {
  try {
    const updatedLog = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a maintenance log
router.delete("/:id", async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Maintenance log deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
