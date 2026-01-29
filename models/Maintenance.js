const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    system: {
      type: String,
      enum: ["HVAC", "Inverter", "Battery", "Solar"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
