import { features } from "../data/landingData";

export default function Features() {
  return (
    <section id="features" className="section container">
      <div className="section-head">
        <h2>Everything you need between two doctor visits</h2>
        <p>Nine connected modules built around how patients and families actually experience healthcare.</p>
      </div>
      <div className="feature-grid">
        {features.map((f) => (
          <div key={f.title} className="card feature-card">
            <div className="feature-icon"><f.icon size={20} /></div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
