const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createAppointment);
router.get("/", protect, getMyAppointments);
router.put("/:id", protect, updateAppointment);
router.delete("/:id", protect, deleteAppointment);

module.exports = router;