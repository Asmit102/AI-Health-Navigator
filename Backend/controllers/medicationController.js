const MedicationCheck = require("../models/MedicationCheck");
const { analyzeDrugInteractions } = require("../services/aiService");

// Run AI Safety Analysis on a list of medications, allergies, and conditions
const checkSafety = async (req, res) => {
  try {
    const { medications, allergies = [], conditions = [], saveToHistory = true, emergencyProfile } = req.body;

    if (!medications || (Array.isArray(medications) && medications.length === 0)) {
      return res.status(400).json({ message: "Please provide at least one medication or supplement name" });
    }

    const medArray = Array.isArray(medications)
      ? medications.map((m) => m.trim()).filter(Boolean)
      : medications.split(",").map((m) => m.trim()).filter(Boolean);

    const allergyArray = Array.isArray(allergies)
      ? allergies.map((a) => a.trim()).filter(Boolean)
      : allergies ? allergies.split(",").map((a) => a.trim()).filter(Boolean) : [];

    const conditionArray = Array.isArray(conditions)
      ? conditions.map((c) => c.trim()).filter(Boolean)
      : conditions ? conditions.split(",").map((c) => c.trim()).filter(Boolean) : [];

    const analysis = await analyzeDrugInteractions(medArray, allergyArray, conditionArray);

    let savedRecord = null;
    if (saveToHistory && req.user && req.user.id) {
      savedRecord = await MedicationCheck.create({
        patient: req.user.id,
        medications: medArray,
        allergies: allergyArray,
        conditions: conditionArray,
        overallRisk: analysis.overallRisk || "Low",
        riskScore: typeof analysis.riskScore === "number" ? analysis.riskScore : 10,
        headline: analysis.headline || "",
        drugInteractions: analysis.drugInteractions || [],
        allergyWarnings: analysis.allergyWarnings || [],
        conditionPrecautions: analysis.conditionPrecautions || [],
        foodDietInteractions: analysis.foodDietInteractions || [],
        doctorDiscussionPoints: analysis.doctorDiscussionPoints || [],
        emergencyProfile: emergencyProfile || {},
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
      recordId: savedRecord?._id || null,
    });
  } catch (error) {
    console.error("checkSafety Controller error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get past safety analyses for the logged-in patient
const getSafetyHistory = async (req, res) => {
  try {
    const records = await MedicationCheck.find({ patient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ records });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a safety record
const deleteSafetyRecord = async (req, res) => {
  try {
    const record = await MedicationCheck.findOneAndDelete({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkSafety,
  getSafetyHistory,
  deleteSafetyRecord,
};
