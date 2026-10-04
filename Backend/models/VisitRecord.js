const mongoose = require("mongoose");

const medicineItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: "" }, // e.g. 500mg
  frequency: { type: String, default: "Once daily" }, // e.g. Twice daily, Once daily
  duration: { type: String, default: "5 days" },
  timing: { type: String, default: "After food" }, // e.g. After breakfast, Bedtime
  instructions: { type: String, default: "" },
});

const visitRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorName: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      default: "General Physician",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    clinicalNotes: {
      type: String,
      default: "",
    },
    patientAdvice: {
      type: String,
      default: "",
    },
    medicines: [medicineItemSchema],
    followUpDate: {
      type: Date,
    },
    followUpNote: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitRecord", visitRecordSchema);
