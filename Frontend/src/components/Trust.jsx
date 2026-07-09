import { ShieldCheck, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function Trust() {
  return (
    <section id="trust" className="trust container">
      <ShieldCheck size={40} className="trust-icon" />
      <h2>A communication tool — not a doctor</h2>
      <p>
        Health Navigator does not diagnose conditions, prescribe medication, or replace medical advice.
        It organizes your health information and helps you communicate better with the professionals who care for you.
      </p>
      <Button size="lg" href="/signup">
        Create your free account <ArrowRight size={16} />
      </Button>
    </section>
  );
}