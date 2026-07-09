import { steps } from "../data/landingData";

export default function HowItWorks() {
  return (
    <section id="how" className="section-muted">
      <div className="container">
        <div className="section-head">
          <h2>How it works</h2>
          <p>From symptom to summary to understanding — in three steps.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.n} className="card step-card">
              <span className="step-num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}