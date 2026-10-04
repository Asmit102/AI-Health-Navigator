import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HeartPulse, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = form.email && form.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);
      const userRole = res.user?.role || "patient";

      // If user came from a protected page, or default to their role portal
      const destination =
        location.state?.from?.pathname ||
        (userRole === "doctor" ? "/doctor/dashboard" : "/patient/overview");

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue managing your healthcare journey.</p>

        {error && (
          <div className="auth-error" style={{ marginTop: 20 }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                className="field-input"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          <Button
            size="lg"
            className="btn-block"
            as="button"
            type="submit"
            disabled={!isFormValid || loading}
          >
            {loading ? "Signing in..." : "Sign in to Portal"}
          </Button>
        </form>

        <p className="auth-footer-text" style={{ marginTop: 24 }}>
          Don't have an account?{" "}
          <Link to="/signup" className="link-primary">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}