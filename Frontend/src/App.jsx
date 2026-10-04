import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Guards & Layouts
import ProtectedRoute from "./components/ProtectedRoute";
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";

// Patient Pages
import PatientOverview from "./pages/patient/PatientOverview";
import AiAssistantPage from "./pages/patient/AiAssistantPage";
import MedicationSafetyPage from "./pages/patient/MedicationSafetyPage";
import ConsultationPrepPage from "./pages/patient/ConsultationPrepPage";
import ReportExplainerPage from "./pages/patient/ReportExplainerPage";
import VisitMemoryPage from "./pages/patient/VisitMemoryPage";
import AppointmentsPage from "./pages/patient/AppointmentsPage";
import VitalsTrackerPage from "./pages/patient/VitalsTrackerPage";
import HealthcareNearMePage from "./pages/patient/HealthcareNearMePage";
import HealthTimelinePage from "./pages/patient/HealthTimelinePage";
import FamilyRecordsPage from "./pages/patient/FamilyRecordsPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";

// Doctor Pages
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorConsultationPage from "./pages/doctor/DoctorConsultationPage";
import DoctorReportsPage from "./pages/doctor/DoctorReportsPage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";

// Role-based redirect helper for /dashboard
function DashboardRedirect() {
  const { role, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
  return <Navigate to="/patient/overview" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Quick Dashboard entrypoint with role redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Patient Dedicated Portal */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<PatientOverview />} />
            <Route path="assistant" element={<AiAssistantPage />} />
            <Route path="medications" element={<MedicationSafetyPage />} />
            <Route path="prep" element={<ConsultationPrepPage />} />
            <Route path="reports" element={<ReportExplainerPage />} />
            <Route path="memory" element={<VisitMemoryPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="vitals" element={<VitalsTrackerPage />} />
            <Route path="nearby" element={<HealthcareNearMePage />} />
            <Route path="timeline" element={<HealthTimelinePage />} />
            <Route path="family" element={<FamilyRecordsPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
          </Route>

          {/* Doctor Dedicated Portal */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboardPage />} />
            <Route path="appointments" element={<DoctorAppointmentsPage />} />
            <Route path="consultations" element={<DoctorConsultationPage />} />
            <Route path="reports" element={<DoctorReportsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;