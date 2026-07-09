import {
  Bot, FileText, ClipboardList, NotebookPen, CalendarDays,
  MapPin, LineChart, Users, Stethoscope,
} from "lucide-react";

export const features = [
  { icon: Bot, title: "AI Health Assistant", desc: "Chat in English or Hindi, track symptoms, get patient-friendly summaries to share with your doctor." },
  { icon: ClipboardList, title: "Consultation Prep", desc: "Auto-build a structured summary and the right questions before every appointment." },
  { icon: FileText, title: "Report Explainer", desc: "Upload prescriptions and lab reports — get them translated into plain language." },
  { icon: NotebookPen, title: "Visit Memory", desc: "Never forget doctor instructions, medicines, dosages, or follow-up dates again." },
  { icon: CalendarDays, title: "Appointments", desc: "Book, track and get reminders for upcoming consultations and follow-ups." },
  { icon: MapPin, title: "Healthcare Navigator", desc: "Find nearby hospitals, clinics, pharmacies and the right department for your symptoms." },
  { icon: LineChart, title: "Health Timeline", desc: "A visual story of every symptom, report, medicine and consultation over time." },
  { icon: Users, title: "Family Health Hub", desc: "Centralized records for parents, children and dependents in one place." },
  { icon: Stethoscope, title: "Care Team Dashboard", desc: "Doctors and nurses see clean patient summaries — less repetition, more care." },
];

export const steps = [
  { n: "01", title: "Tell us how you feel", desc: "Describe symptoms in your own words. The assistant organizes them into a clear health log." },
  { n: "02", title: "Prepare for the visit", desc: "Get a structured summary and curated questions to bring to your appointment." },
  { n: "03", title: "Understand the outcome", desc: "Upload reports and prescriptions; we explain them and store every instruction." },
];