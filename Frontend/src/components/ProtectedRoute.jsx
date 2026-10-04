import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--fg)",
        gap: 16
      }}>
        <div style={{
          width: 44,
          height: 44,
          border: "3px solid var(--border)",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <p style={{ color: "var(--muted-fg)", fontSize: 14 }}>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the correct portal for this role
    if (role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/patient/overview" replace />;
  }

  return children;
}
