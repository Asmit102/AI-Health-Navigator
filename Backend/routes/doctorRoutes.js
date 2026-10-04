const express = require("express");
const router = express.Router();
const {
  getDoctorQueue,
  getDoctorStats,
  getPatientPrepSummary,
  updateAppointmentStatus,
  getAllPatientReports,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/queue", protect, getDoctorQueue);
router.get("/stats", protect, getDoctorStats);
router.get("/prep/:appointmentId", protect, getPatientPrepSummary);
router.put("/appointments/:id/status", protect, updateAppointmentStatus);
router.get("/reports", protect, getAllPatientReports);

module.exports = router;
