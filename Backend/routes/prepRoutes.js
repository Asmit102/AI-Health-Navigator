const express = require("express");
const router = express.Router();
const { getPrepForAppointment, updatePrep } = require("../controllers/prepController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:appointmentId", protect, getPrepForAppointment);
router.put("/:id", protect, updatePrep);

module.exports = router;