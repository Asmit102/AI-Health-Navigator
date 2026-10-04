const ConsultationPrep = require("../models/ConsultationPrep");
const Appointment = require("../models/Appointment");
const { generateQuestions } = require("../services/aiService");

// Get (or auto-create) the prep record for a specific appointment
const getPrepForAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let prep = await ConsultationPrep.findOne({ appointment: appointmentId });

    // If no prep record exists yet, create one with default fields + AI questions
    if (!prep) {
      const suggestedQuestions = await generateQuestions(
        appointment.reason || "general consultation",
        appointment.specialty
      );

      prep = await ConsultationPrep.create({
        appointment: appointmentId,
        patient: req.user.id,
        notes: [
          { question: "What's the main reason for this visit?", value: appointment.reason || "" },
          { question: "When did symptoms start and how have they changed?", value: "" },
          { question: "Current medications you're taking?", value: "" },
        ],
        suggestedQuestions,
      });
    }

    res.status(200).json({ prep, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the notes for a prep record
const updatePrep = async (req, res) => {
  try {
    const prep = await ConsultationPrep.findById(req.params.id);

    if (!prep) {
      return res.status(404).json({ message: "Prep record not found" });
    }

    if (prep.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { notes } = req.body;
    prep.notes = notes;

    const updatedPrep = await prep.save();

    res.status(200).json({ message: "Notes saved", prep: updatedPrep });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPrepForAppointment, updatePrep };