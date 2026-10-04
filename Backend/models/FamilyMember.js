const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    notes: {
      type: String,
      default: "",
    },
    hasReminders: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyMember", familyMemberSchema);