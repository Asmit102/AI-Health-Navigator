const express = require("express");
const router = express.Router();
const {
  logVital,
  getMyVitals,
  deleteVital,
} = require("../controllers/vitalController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, logVital);
router.get("/", protect, getMyVitals);
router.delete("/:id", protect, deleteVital);

module.exports = router;
