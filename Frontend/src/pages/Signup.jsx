import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, User, Eye, EyeOff, UserRound, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("patient"); // "patient" | "doctor"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.name && form.email && form.password && form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      await signup(payload);
      if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/overview");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong creating your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo">
            <HeartPulse size={20} />
          </div>
          <span className="brand-name">Health Navigator</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Select your role to configure your dedicated health experience.</p>

        {error && (
          <div className="auth-error" style={{ marginTop: 20 }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">I am joining as a</label>
            <div className="role-select">
              <div
                className={`role-card ${role === "patient" ? "active" : ""}`}
                onClick={() => setRole("patient")}
                role="button"
                tabIndex={0}
              >
                <div className="role-icon">
                  <UserRound size={20} />
                </div>
                <span className="role-label">Patient</span>
                <span className="role-desc">Manage visits, AI triage & reports</span>
              </div>
              <div
                className={`role-card ${role === "doctor" ? "active" : ""}`}
                onClick={() => setRole("doctor")}
                role="button"
                tabIndex={0}
              >
                <div className="role-icon">
                  <Stethoscope size={20} />
                </div>
                <span className="role-label">Doctor</span>
                <span className="role-desc">Review preps & write prescriptions</span>
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="name">
              Full Name
            </label>
            <div className="field-input-wrap">
              <User size={16} className="field-icon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder={role === "doctor" ? "Dr. Rakesh Mehta" : "Ananya Sharma"}
                className="field-input"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="email">
              Email Address
            </label>
            <div className="field-input-wrap">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="field-input"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <div className="field-input-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="field-input"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="field-input-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="field-input"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <Button
            size="lg"
            className="btn-block"
            as="button"
            type="submit"
            disabled={!isFormValid || loading}
          >
            {loading ? "Setting up portal..." : `Create Account as ${role === "doctor" ? "Doctor" : "Patient"}`}
          </Button>
        </form>

        <p className="auth-footer-text" style={{ marginTop: 24 }}>
          Already have an account?{" "}
          <Link to="/login" className="link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}