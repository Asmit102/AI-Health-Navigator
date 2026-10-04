const Vital = require("../models/Vital");

// Log new vitals & symptoms
const logVital = async (req, res) => {
  try {
    const {
      bloodPressureSys,
      bloodPressureDia,
      heartRate,
      bloodGlucose,
      temperature,
      spO2,
      symptoms,
      notes,
      date,
    } = req.body;

    const vital = await Vital.create({
      patient: req.user.id,
      date: date || new Date(),
      bloodPressureSys: bloodPressureSys ? Number(bloodPressureSys) : undefined,
      bloodPressureDia: bloodPressureDia ? Number(bloodPressureDia) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      bloodGlucose: bloodGlucose ? Number(bloodGlucose) : undefined,
      temperature: temperature ? Number(temperature) : undefined,
      spO2: spO2 ? Number(spO2) : undefined,
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : [],
      notes: notes || "",
    });

    res.status(201).json({
      message: "Health vitals recorded successfully",
      vital,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vitals for logged-in patient
const getMyVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ patient: req.user.id }).sort({ date: -1 }).limit(50);
    res.status(200).json({ vitals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a vital record
const deleteVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);
    if (!vital) {
      return res.status(404).json({ message: "Vital record not found" });
    }

    if (vital.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await vital.deleteOne();
    res.status(200).json({ message: "Vital entry removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logVital,
  getMyVitals,
  deleteVital,
};
