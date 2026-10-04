const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadReport, getMyReports } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// Store the uploaded file in memory (not on disk) so we can pass it directly to pdf-parse
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.single("report"), uploadReport);
router.get("/", protect, getMyReports);

module.exports = router;