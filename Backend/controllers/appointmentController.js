const Appointment = require("../models/Appointment");

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctorName,
      specialty,
      date,
      time,
      reason,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments for the logged-in patient
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).sort({ date: 1 });

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an appointment (e.g., reschedule)
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Make sure this appointment belongs to the logged-in user
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this appointment" });
    }

    const { date, time, reason, status } = req.body;
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.reason = reason || appointment.reason;
    appointment.status = status || appointment.status;

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

    if (appointment.patient.toString() !== req.user.id) {
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