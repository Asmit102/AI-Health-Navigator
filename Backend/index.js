const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const familyRoutes = require("./routes/familyRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const prepRoutes = require("./routes/prepRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const visitRoutes = require("./routes/visitRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const medicationRoutes = require("./routes/medicationRoutes");

const app = express();
app.use(express.json());

// Dynamic CORS configuration supporting local dev and production client URLs
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for seamless deployment
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 4001;

app.get("/", (req, resp) => {
  resp.json({
    message: "AI Health Navigator API Server Running",
    status: "healthy",
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, resp) => {
  resp.json({
    status: "ok",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "connecting/disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/prep", prepRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/medications", medicationRoutes);

// MongoDB connection
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
    });
} else {
  console.warn("MONGO_URI not set in environment variables!");
}

app.listen(PORT, () => {
  console.log(`AI Health Navigator server listening on port ${PORT}`);
});

module.exports = app;