import { HeartPulse, ArrowRight, Sun, Moon } from "lucide-react";
import Button from "./Button";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="nav">
      <div className="nav-inner container">
        <a href="/" className="brand">
          <div className="brand-logo"><HeartPulse size={20} /></div>
          <span className="brand-name">Health Navigator</span>
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#trust">Trust & Safety</a>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button variant="ghost" className="hide-sm" href="/login">Sign in</Button>
          <Button href="/signup">Get started <ArrowRight size={16} /></Button>
        </div>
      </div>
    </header>
  );
}