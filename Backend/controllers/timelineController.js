const Appointment = require("../models/Appointment");
const Report = require("../models/Report");
const VisitRecord = require("../models/VisitRecord");
const Vital = require("../models/Vital");

const getTimeline = async (req, res) => {
  try {
    const patientId = req.user.id;

    // Fetch all health events in parallel
    const [appointments, reports, visits, vitals] = await Promise.all([
      Appointment.find({ patient: patientId }),
      Report.find({ patient: patientId }),
      VisitRecord.find({ patient: patientId }),
      Vital.find({ patient: patientId }),
    ]);

    // Convert appointments into event shape
    const appointmentEvents = appointments.map((a) => ({
      id: a._id,
      type: "visit",
      category: "Appointment",
      title: `Consultation with ${a.doctorName}`,
      description: `${a.specialty}${a.reason ? " — " + a.reason : ""} (${a.status})`,
      date: a.date,
      meta: { time: a.time, status: a.status },
    }));

    // Convert reports into event shape
    const reportEvents = reports.map((r) => ({
      id: r._id,
      type: "report",
      category: "Medical Report",
      title: `Report Uploaded: ${r.fileName}`,
      description: "AI plain-language explanation generated",
      date: r.createdAt,
      meta: { fileName: r.fileName },
    }));

    // Convert doctor visit memories & prescriptions into event shape
    const visitEvents = visits.map((v) => ({
      id: v._id,
      type: "rx",
      category: "Doctor Summary & Prescription",
      title: `Visit Summary — ${v.doctorName}`,
      description: `Diagnosis: ${v.diagnosis}${v.medicines?.length ? ` (${v.medicines.length} medicines prescribed)` : ""}`,
      date: v.date,
      meta: {
        doctorName: v.doctorName,
        specialty: v.specialty,
        medicines: v.medicines,
        followUpDate: v.followUpDate,
      },
    }));

    // Convert vitals into event shape
    const vitalEvents = vitals.map((vt) => {
      const parts = [];
      if (vt.bloodPressureSys && vt.bloodPressureDia) parts.push(`BP ${vt.bloodPressureSys}/${vt.bloodPressureDia}`);
      if (vt.heartRate) parts.push(`Pulse ${vt.heartRate} bpm`);
      if (vt.bloodGlucose) parts.push(`Glucose ${vt.bloodGlucose} mg/dL`);
      if (vt.spO2) parts.push(`SpO2 ${vt.spO2}%`);
      if (vt.temperature) parts.push(`Temp ${vt.temperature}°F`);

      return {
        id: vt._id,
        type: "symptom",
        category: "Vitals & Symptoms",
        title: vt.symptoms?.length ? `Logged: ${vt.symptoms.join(", ")}` : "Health Vitals Logged",
        description: parts.length ? parts.join(" · ") : vt.notes || "Vitals check recorded",
        date: vt.date,
        meta: {
          symptoms: vt.symptoms,
          notes: vt.notes,
        },
      };
    });

    // Merge and sort newest first
    const timeline = [...appointmentEvents, ...reportEvents, ...visitEvents, ...vitalEvents].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({ timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTimeline };