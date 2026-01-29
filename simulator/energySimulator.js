// Simulates campus energy telemetry (fake IoT)

let state = {
  solarKW: 60,      // current solar generation
  gridKW: 40,       // grid import
  batteryKWh: 1200, // 2.5 MWh system
};

function simulateEnergy() {
  // Solar fluctuates naturally
  state.solarKW += (Math.random() * 10 - 5);
  state.solarKW = Math.max(0, Math.min(state.solarKW, 120));

  // Grid depends on solar
  state.gridKW = 120 - state.solarKW + (Math.random() * 5);
  state.gridKW = Math.max(0, state.gridKW);

  // Battery logic
  if (state.solarKW > state.gridKW) {
    state.batteryKWh += 20; // charging
  } else {
    state.batteryKWh -= 15; // discharging
  }

  state.batteryKWh = Math.max(0, Math.min(state.batteryKWh, 2500));

  return {
    solarKW: Number(state.solarKW.toFixed(2)),
    gridKW: Number(state.gridKW.toFixed(2)),
    batteryKWh: Number(state.batteryKWh.toFixed(0)),
    batteryState:
      state.solarKW > state.gridKW ? "Charging" : "Discharging",
    timestamp: new Date(),
  };
}

module.exports = simulateEnergy;
