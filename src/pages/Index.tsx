import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ModelsSection from "@/components/landing/ModelsSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <ModelsSection />
      <BenefitsSection />
      {/* <PricingSection /> */}
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
