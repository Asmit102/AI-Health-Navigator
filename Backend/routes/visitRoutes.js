const express = require("express");
const router = express.Router();
const {
  createVisitRecord,
  getMyVisitRecords,
  getVisitById,
  deleteVisitRecord,
} = require("../controllers/visitController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createVisitRecord);
router.get("/", protect, getMyVisitRecords);
router.get("/:id", protect, getVisitById);
router.delete("/:id", protect, deleteVisitRecord);

module.exports = router;
