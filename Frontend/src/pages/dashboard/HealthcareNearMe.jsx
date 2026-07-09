import { useState } from "react";
import {
  Search, Stethoscope, Star, MapPin, Phone,
  Building2, Pill, FlaskConical, HeartHandshake,
} from "lucide-react";
import Button from "../../components/Button";

const places = [
  {
    id: 1,
    name: "Apollo Multispecialty Hospital",
    type: "Hospital",
    icon: Building2,
    rating: 4.6,
    distance: "1.2 km",
    phone: "+91 11 2345 6789",
  },
  {
    id: 2,
    name: "MedPlus Pharmacy",
    type: "Pharmacy",
    icon: Pill,
    rating: 4.3,
    distance: "0.4 km",
    phone: "+91 11 3456 7890",
  },
  {
    id: 3,
    name: "Dr. Lal PathLabs",
    type: "Diagnostic Center",
    icon: FlaskConical,
    rating: 4.5,
    distance: "0.9 km",
    phone: "+91 11 4567 8901",
  },
  {
    id: 4,
    name: "Wellness Family Clinic",
    type: "Clinic",
    icon: HeartHandshake,
    rating: 4.4,
    distance: "1.8 km",
    phone: "+91 11 5678 9012",
  },
];

export default function HealthcareNearMe() {
  const [symptom, setSymptom] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div>
      <div className="nearby-header-row">
        <div className="nearby-title">Healthcare Near You</div>
        <div className="nearby-sub">Find the right hospitals, clinics, pharmacies, and labs — matched to your symptoms.</div>
      </div>

      <div className="nearby-search-row">
        <input
          className="nearby-input"
          placeholder="Symptom or specialty (e.g., chest pain, dermatologist)"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
        />
        <input
          className="nearby-input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <Button as="button">
          <Search size={16} /> Search
        </Button>
      </div>

      <div className="suggested-dept-box">
        <Stethoscope size={20} className="suggested-dept-icon" />
        <div>
          <div className="suggested-dept-title">Suggested department based on your symptoms</div>
          <div className="suggested-dept-text">
            Headache + low-grade fever for 5 days → <strong>General Physician</strong> (escalate to Internal Medicine if persistent).
          </div>
        </div>
      </div>

      <div className="nearby-grid">
        {places.map((p) => (
          <div key={p.id} className="card place-card">
            <div className="place-card-top">
              <div className="place-card-left">
                <div className="place-icon">
                  <p.icon size={19} />
                </div>
                <div>
                  <div className="place-name">{p.name}</div>
                  <div className="place-type">{p.type}</div>
                </div>
              </div>
              <span className="place-rating">
                <Star size={11} fill="#b45309" /> {p.rating}
              </span>
            </div>

            <div className="place-meta-row">
              <div className="place-meta-left">
                <span className="place-meta-item"><MapPin size={13} /> {p.distance}</span>
                <span className="place-meta-item"><Phone size={13} /> {p.phone}</span>
              </div>
              <Button as="button" variant="outline">Directions</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}