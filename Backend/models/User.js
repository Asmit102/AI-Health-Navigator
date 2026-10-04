const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "nurse"],
      default: "patient",
    },
    phone: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    specialty: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    clinicAddress: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      default: "Mon-Sat: 9:00 AM - 5:00 PM",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;