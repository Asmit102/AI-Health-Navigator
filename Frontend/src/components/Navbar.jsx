import { HeartPulse, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <a href="#" className="brand">
          <div className="brand-logo"><HeartPulse size={20} /></div>
          <span className="brand-name">Health Navigator</span>
        </a>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#trust">Trust & Safety</a>
        </nav>
        <div className="nav-actions">
          <Button variant="ghost" className="hide-sm" href="/login">Sign in</Button>
          <Button href="/signup">Get started <ArrowRight size={16} /></Button>
        </div>
      </div>
    </header>
  );
}