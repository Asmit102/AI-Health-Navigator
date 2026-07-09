import { Sparkles, ShieldCheck, Languages } from "lucide-react";
import Button from "./Button";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-left">
          <span className="badge"><Sparkles size={14} /> AI-powered healthcare companion</span>
          <h1 className="hero-title">
            Understand your health.<br />
            <span className="accent">Navigate it with confidence.</span>
          </h1>
          <p className="hero-sub">
            Translate medical jargon, prepare for doctor visits, remember every instruction,
            and keep your entire family's healthcare organized — in one calm, private space.
          </p>
          <div className="hero-ctas">
            <Button size="lg" href="/signup">Start your health journey</Button>
            <Button variant="outline" size="lg" href="#features">See features</Button>
          </div>
          <div className="hero-notes">
            <span><ShieldCheck size={16} className="ic" /> Does not diagnose or prescribe</span>
            <span><Languages size={16} className="ic" /> English & हिंदी</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-glow" />
          <div className="card hero-card">
            <div className="hero-card-head">Consultation prep — Ananya, 32</div>
            <div className="hero-card-body">
              <div className="row">
                <span className="dot dot-primary" />
                <div>
                  <p className="row-title">Symptoms over the last 5 days</p>
                  <p className="row-sub">Headache (morning), mild fever (101°F twice), fatigue.</p>
                </div>
              </div>
              <div className="row">
                <span className="dot dot-info" />
                <div>
                  <p className="row-title">Suggested department</p>
                  <p className="row-sub">General Physician → consider review by Internal Medicine if persistent.</p>
                </div>
              </div>
              <div className="row">
                <span className="dot dot-success" />
                <div>
                  <p className="row-title">Questions to ask your doctor</p>
                  <ul className="qlist">
                    <li>• Could this be related to my recent travel?</li>
                    <li>• Should I get a CBC or dengue panel?</li>
                    <li>• Any interaction with my current medication?</li>
                  </ul>
                </div>
              </div>
              <div className="note-soft">
                This summary is a communication aid — your doctor makes the diagnosis.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
 