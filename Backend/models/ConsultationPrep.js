const mongoose = require("mongoose");

const consultationPrepSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        question: String,
        value: String,
      },
    ],
    suggestedQuestions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConsultationPrep", consultationPrepSchema);