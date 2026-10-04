const { PDFParse } = require("pdf-parse");
const Report = require("../models/Report");
const { explainReport } = require("../services/aiService");

// Upload a report, extract text, get AI explanation, save it
const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // req.file.buffer holds the raw PDF data (multer gives us this in memory)
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: "Could not read any text from this PDF" });
    }

    const explanation = await explainReport(extractedText);

    const report = await Report.create({
      patient: req.user.id,
      fileName: req.file.originalname,
      explanation,
    });

    res.status(201).json({
      message: "Report uploaded and explained successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports for the logged-in patient
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadReport, getMyReports };