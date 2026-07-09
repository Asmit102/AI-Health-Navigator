import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Trust from "../components/Trust";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="page">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Trust />
      <Footer />
    </div>
  );
}