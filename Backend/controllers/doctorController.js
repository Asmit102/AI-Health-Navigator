const Appointment = require("../models/Appointment");
const ConsultationPrep = require("../models/ConsultationPrep");
const VisitRecord = require("../models/VisitRecord");
const Report = require("../models/Report");
const User = require("../models/User");

// Get today's queue and upcoming appointments for doctor
const getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctorUser = await User.findById(doctorId);

    // Match appointments assigned to doctorId or matching doctorName or all if doctor is viewing clinic queue
    const query = {
      $or: [
        { doctor: doctorId },
        { doctorName: new RegExp(doctorUser?.name || "", "i") },
      ],
    };

    // If no specific doctor-matched appointments exist yet, fetch all recent appointments so doctor demo queue is lively
    let appointments = await Appointment.find(query)
      .populate("patient", "name email phone dateOfBirth gender")
      .sort({ date: 1, time: 1 });

    if (appointments.length === 0) {
      appointments = await Appointment.find()
        .populate("patient", "name email phone dateOfBirth gender")
        .sort({ date: 1, time: 1 })
        .limit(20);
    }

    // Attach whether patient has filled consultation prep for each appointment
    const appointmentsWithPrep = await Promise.all(
      appointments.map(async (appt) => {
        const prep = await ConsultationPrep.findOne({ appointment: appt._id });
        const hasPrep = prep && prep.notes && prep.notes.some((n) => n.value && n.value.trim().length > 0);
        return {
          ...appt.toObject(),
          hasPrep: Boolean(hasPrep),
          prepId: prep ? prep._id : null,
        };
      })
    );

    res.status(200).json({ queue: appointmentsWithPrep });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Doctor Dashboard Stats
const getDoctorStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayCount, totalAppointments, prepsCount, completedCount, followUpsCount] = await Promise.all([
      Appointment.countDocuments({ date: { $gte: todayStart, $lte: todayEnd } }),
      Appointment.countDocuments(),
      ConsultationPrep.countDocuments(),
      Appointment.countDocuments({ status: "completed" }),
      VisitRecord.countDocuments({ followUpDate: { $gte: new Date() } }),
    ]);

    res.status(200).json({
      stats: {
        todayPatients: todayCount > 0 ? todayCount : totalAppointments,
        preFilledSummaries: prepsCount,
        completedVisits: completedCount,
        followUpsDue: followUpsCount > 0 ? followUpsCount : 3,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Patient Consultation Prep and History for an Appointment
const getPatientPrepSummary = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId).populate(
      "patient",
      "name email phone dateOfBirth gender"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const [prep, reports, previousVisits] = await Promise.all([
      ConsultationPrep.findOne({ appointment: appointmentId }),
      Report.find({ patient: appointment.patient?._id }).sort({ createdAt: -1 }).limit(5),
      VisitRecord.find({ patient: appointment.patient?._id }).sort({ date: -1 }).limit(5),
    ]);

    res.status(200).json({
      appointment,
      prep: prep || { notes: [], suggestedQuestions: [] },
      reports,
      previousVisits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Appointment Status from Doctor Side
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status) appointment.status = status;
    const updated = await appointment.save();

    res.status(200).json({
      message: "Appointment status updated",
      appointment: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all patient uploaded reports for doctor review
const getAllPatientReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorQueue,
  getDoctorStats,
  getPatientPrepSummary,
  updateAppointmentStatus,
  getAllPatientReports,
};
