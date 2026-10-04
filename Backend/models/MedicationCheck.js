const mongoose = require("mongoose");

const medicationCheckSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medications: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    conditions: [
      {
        type: String,
        trim: true,
      },
    ],
    overallRisk: {
      type: String,
      enum: ["Low", "Moderate", "Severe"],
      default: "Low",
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    headline: {
      type: String,
      default: "",
    },
    drugInteractions: [
      {
        pair: String,
        severity: String,
        mechanism: String,
        clinicalAdvice: String,
      },
    ],
    allergyWarnings: [
      {
        drug: String,
        allergen: String,
        warning: String,
      },
    ],
    conditionPrecautions: [
      {
        drug: String,
        condition: String,
        precaution: String,
      },
    ],
    foodDietInteractions: [
      {
        drug: String,
        foodItem: String,
        effect: String,
      },
    ],
    doctorDiscussionPoints: [
      {
        type: String,
      },
    ],
    emergencyProfile: {
      bloodGroup: { type: String, default: "" },
      emergencyContactName: { type: String, default: "" },
      emergencyContactPhone: { type: String, default: "" },
      organDonor: { type: Boolean, default: false },
      specialNotes: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicationCheck", medicationCheckSchema);
