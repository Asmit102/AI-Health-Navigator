import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Stethoscope,
  Star,
  MapPin,
  Phone,
  Building2,
  Pill,
  FlaskConical,
  HeartHandshake,
  CalendarCheck,
} from "lucide-react";
import Button from "../../components/Button";

const places = [
  {
    id: 1,
    name: "Apollo Multispecialty Hospital",
    type: "Hospital",
    specialty: "Multispecialty & Emergency",
    icon: Building2,
    rating: 4.8,
    distance: "1.2 km",
    phone: "+91 11 2345 6789",
    address: "Plot 15, Sector 12, Main Healthcare Blvd",
  },
  {
    id: 2,
    name: "MedPlus 24/7 Pharmacy",
    type: "Pharmacy",
    specialty: "Prescription Medicines & Emergency Supplies",
    icon: Pill,
    rating: 4.6,
    distance: "0.4 km",
    phone: "+91 11 3456 7890",
    address: "Shop 4, Market Complex, Block B",
  },
  {
    id: 3,
    name: "Dr. Lal PathLabs & Diagnostics",
    type: "Diagnostic Center",
    specialty: "CBC, Lipid, Metabolic & Pathology Labs",
    icon: FlaskConical,
    rating: 4.7,
    distance: "0.9 km",
    phone: "+91 11 4567 8901",
    address: "2nd Floor, Apex Tower, Central Avenue",
  },
  {
    id: 4,
    name: "Max Healthcare Care Clinic",
    type: "Clinic",
    specialty: "Internal Medicine & General Practice",
    icon: HeartHandshake,
    rating: 4.9,
    distance: "1.8 km",
    phone: "+91 11 5678 9012",
    address: "Suite 102, Wellness Plaza",
  },
  {
    id: 5,
    name: "Fortis Escorts Heart Institute",
    type: "Hospital",
    specialty: "Cardiology & Vascular Care",
    icon: Building2,
    rating: 4.9,
    distance: "3.1 km",
    phone: "+91 11 6789 0123",
    address: "Okhla Road, Healthcare Enclave",
  },
  {
    id: 6,
    name: "Skin & Laser Dermatology Center",
    type: "Clinic",
    specialty: "Dermatology & Allergy Care",
    icon: HeartHandshake,
    rating: 4.5,
    distance: "2.4 km",
    phone: "+91 11 7890 1234",
    address: "304 Metro Heights, Sector 18",
  },
];

export default function HealthcareNearMePage() {
  const navigate = useNavigate();
  const [symptom, setSymptom] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const getDepartmentRecommendation = (query) => {
    const q = query.toLowerCase();
    if (q.includes("chest") || q.includes("heart") || q.includes("palpitation")) {
      return { dept: "Cardiology", advice: "For chest pain or palpitations, consult a Cardiologist or visit Emergency." };
    }
    if (q.includes("skin") || q.includes("rash") || q.includes("itch")) {
      return { dept: "Dermatology", advice: "For rashes and allergic skin reactions, consult a Dermatologist." };
    }
    if (q.includes("fever") || q.includes("headache") || q.includes("cough") || q.includes("cold")) {
      return { dept: "General Physician", advice: "Viral symptoms and general infections are best evaluated by a General Physician." };
    }
    if (q.includes("bone") || q.includes("joint") || q.includes("knee") || q.includes("back")) {
      return { dept: "Orthopedics", advice: "Joint pain and musculoskeletal discomfort are treated by an Orthopedic specialist." };
    }
    return {
      dept: "General Physician",
      advice: "Headache + low-grade fever or mild symptoms → General Physician (escalate if persistent).",
    };
  };

  const recommendation = getDepartmentRecommendation(symptom);

  const filteredPlaces = places.filter((p) => {
    const matchesType = selectedType === "All" || p.type === selectedType;
    const matchesQuery =
      symptom === "" ||
      p.name.toLowerCase().includes(symptom.toLowerCase()) ||
      p.specialty.toLowerCase().includes(symptom.toLowerCase()) ||
      p.type.toLowerCase().includes(symptom.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div>
      <div className="nearby-header-row">
        <div>
          <div className="nearby-title">Healthcare Facilities Near You</div>
          <div className="nearby-sub">
            Locate trusted hospitals, clinics, diagnostic centers, and 24/7 pharmacies matched to your health requirements.
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="nearby-search-row">
        <input
          className="nearby-input"
          placeholder="Search by symptom, doctor, specialty (e.g. chest pain, dermatologist, CBC lab)..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
        />
        <Button as="button">
          <Search size={16} /> Search
        </Button>
      </div>

      {/* Specialty Recommendation Alert */}
      <div className="suggested-dept-box" style={{ marginBottom: 20 }}>
        <Stethoscope size={22} className="suggested-dept-icon" />
        <div>
          <div className="suggested-dept-title">
            Department Recommendation: <strong>{recommendation.dept}</strong>
          </div>
          <div className="suggested-dept-text">{recommendation.advice}</div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Hospital", "Clinic", "Pharmacy", "Diagnostic Center"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid var(--border)",
              background: selectedType === type ? "var(--primary)" : "var(--card)",
              color: selectedType === type ? "var(--primary-fg)" : "var(--muted-fg)",
              cursor: "pointer",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid of Places */}
      <div className="nearby-grid">
        {filteredPlaces.map((p) => (
          <div key={p.id} className="card place-card">
            <div className="place-card-top">
              <div className="place-card-left">
                <div className="place-icon">
                  <p.icon size={19} />
                </div>
                <div>
                  <div className="place-name">{p.name}</div>
                  <div className="place-type">{p.specialty}</div>
                </div>
              </div>
              <span className="place-rating">
                <Star size={11} fill="#b45309" color="#b45309" /> {p.rating}
              </span>
            </div>

            <div style={{ fontSize: 12, color: "var(--muted-fg)", margin: "8px 0" }}>
              <MapPin size={12} style={{ verticalAlign: -1, marginRight: 4 }} /> {p.address}
            </div>

            <div className="place-meta-row">
              <div className="place-meta-left">
                <span className="place-meta-item">
                  <MapPin size={13} /> {p.distance} away
                </span>
                <span className="place-meta-item">
                  <Phone size={13} /> {p.phone}
                </span>
              </div>
              <Button
                as="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/patient/appointments")}
              >
                <CalendarCheck size={13} /> Book Visit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
