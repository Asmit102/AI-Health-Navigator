const express = require("express");
const router = express.Router();
const {
  checkSafety,
  getSafetyHistory,
  deleteSafetyRecord,
} = require("../controllers/medicationController");
const { protect } = require("../middleware/authMiddleware");

// Check medication safety (can be called by logged-in users)
router.post("/check", protect, checkSafety);

// Fetch patient's history of checks
router.get("/history", protect, getSafetyHistory);

// Delete record
router.delete("/:id", protect, deleteSafetyRecord);

module.exports = router;
