const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    bloodPressureSys: {
      type: Number, // systolic (e.g. 120)
    },
    bloodPressureDia: {
      type: Number, // diastolic (e.g. 80)
    },
    heartRate: {
      type: Number, // bpm (e.g. 72)
    },
    bloodGlucose: {
      type: Number, // mg/dL (e.g. 95)
    },
    temperature: {
      type: Number, // Fahrenheit (e.g. 98.6)
    },
    spO2: {
      type: Number, // percentage (e.g. 98)
    },
    symptoms: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vital", vitalSchema);
