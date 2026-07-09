import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with actual API call, e.g. services/authService.js
      // const res = await loginUser(form);
      console.log("Login attempt:", form);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-logo"><HeartPulse size={20} /></div>
          <span className="brand-name">Health Navigator</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue managing your health.</p>

        {error && <div className="auth-error" style={{ marginTop: 20 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email</label>
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
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
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

          <div className="field-row-between">
            <label className="checkbox-row">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password" className="link-primary">Forgot password?</Link>
          </div>

          <Button size="lg" className="btn-block" as="button" onClick={handleSubmit}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="auth-footer-text" style={{ marginTop: 24 }}>
          Don't have an account? <Link to="/signup" className="link-primary">Create one</Link>
        </p>
      </div>
    </div>
  );
}