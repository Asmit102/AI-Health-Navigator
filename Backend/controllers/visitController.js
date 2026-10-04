const VisitRecord = require("../models/VisitRecord");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create a new doctor visit record / prescription
const createVisitRecord = async (req, res) => {
  try {
    const {
      patientId,
      doctorName,
      specialty,
      appointmentId,
      date,
      diagnosis,
      clinicalNotes,
      patientAdvice,
      medicines,
      followUpDate,
      followUpNote,
    } = req.body;

    const patient = patientId || req.user.id;
    const isDoctor = req.user.role === "doctor";

    let docName = doctorName;
    if (!docName && isDoctor) {
      const docUser = await User.findById(req.user.id);
      docName = docUser?.name ? (docUser.name.startsWith("Dr.") ? docUser.name : `Dr. ${docUser.name}`) : "Dr. Treating Physician";
    }

    const visit = await VisitRecord.create({
      patient,
      doctor: isDoctor ? req.user.id : undefined,
      doctorName: docName || "Dr. Treating Physician",
      specialty: specialty || "General Physician",
      appointment: appointmentId,
      date: date || new Date(),
      diagnosis,
      clinicalNotes,
      patientAdvice,
      medicines: Array.isArray(medicines) ? medicines : [],
      followUpDate,
      followUpNote,
    });

    // If linked to an appointment, mark it as completed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" });
    }

    res.status(201).json({
      message: "Visit record and prescription saved successfully",
      visit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all visit records for current patient
const getMyVisitRecords = async (req, res) => {
  try {
    const visits = await VisitRecord.find({ patient: req.user.id })
      .populate("doctor", "name specialty email")
      .sort({ date: -1 });

    res.status(200).json({ visits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single visit record
const getVisitById = async (req, res) => {
  try {
    const visit = await VisitRecord.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialty email");

    if (!visit) {
      return res.status(404).json({ message: "Visit record not found" });
    }

    res.status(200).json({ visit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a visit record
const deleteVisitRecord = async (req, res) => {
  try {
    const visit = await VisitRecord.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: "Visit record not found" });
    }

    if (visit.patient.toString() !== req.user.id && req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized to delete this record" });
    }

    await visit.deleteOne();
    res.status(200).json({ message: "Visit record removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVisitRecord,
  getMyVisitRecords,
  getVisitById,
  deleteVisitRecord,
};
