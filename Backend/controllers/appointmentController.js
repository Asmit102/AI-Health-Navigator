const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, date, time, reason, doctorId } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId || undefined,
      doctorName,
      specialty,
      date,
      time,
      reason,
      status: "pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments for the logged-in user (patient or doctor)
const getMyAppointments = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "doctor") {
      const docUser = await User.findById(req.user.id);
      appointments = await Appointment.find({
        $or: [
          { doctor: req.user.id },
          { doctorName: new RegExp(docUser?.name || "", "i") },
        ],
      })
        .populate("patient", "name email phone")
        .sort({ date: 1, time: 1 });

      if (appointments.length === 0) {
        appointments = await Appointment.find()
          .populate("patient", "name email phone")
          .sort({ date: 1, time: 1 });
      }
    } else {
      appointments = await Appointment.find({ patient: req.user.id }).sort({ date: 1, time: 1 });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an appointment (reschedule or status change)
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Patient or Doctor authorization check
    const isOwnerPatient = appointment.patient.toString() === req.user.id;
    const isDoctor = req.user.role === "doctor";

    if (!isOwnerPatient && !isDoctor) {
      return res.status(403).json({ message: "Not authorized to update this appointment" });
    }

    const { date, time, reason, status, doctorName, specialty } = req.body;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason !== undefined) appointment.reason = reason;
    if (status) appointment.status = status;
    if (doctorName) appointment.doctorName = doctorName;
    if (specialty) appointment.specialty = specialty;

    const updatedAppointment = await appointment.save();

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel/delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== req.user.id && req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized to cancel this appointment" });
    }

    await appointment.deleteOne();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
};