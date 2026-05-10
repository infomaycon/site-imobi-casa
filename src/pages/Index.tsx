import type { SyntheticEvent } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ModelsSection from "@/components/landing/ModelsSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const blockLandingInteraction = (event: SyntheticEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      className="bg-background min-h-screen pointer-events-none"
    >
      <Navbar />
      <HeroSection />
      <ModelsSection />
      <BenefitsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
