import HeroSection from "@/components/sections/HeroSection";
import AcServicesSection from "@/components/sections/AcServicesSection";
import FridgeServicesSection from "@/components/sections/FridgeServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ChatDemoSection from "@/components/sections/ChatDemoSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";

// Home page: all sections in scroll order
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <AcServicesSection />
      <FridgeServicesSection />
      <HowItWorksSection />
      <ChatDemoSection />
      <FinalCtaSection />
    </main>
  );
}
