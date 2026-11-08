import HeroSceneLoader from "@/components/three/HeroSceneLoader";
import HeroSection from "@/components/sections/HeroSection";
import AcServicesSection from "@/components/sections/AcServicesSection";
import FridgeServicesSection from "@/components/sections/FridgeServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ChatDemoSection from "@/components/sections/ChatDemoSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";

// Home page: the fixed 3D layer behind all sections in scroll order
export default function HomePage() {
  return (
    <>
      {/* 3D layer: fixed behind the page, clicks pass straight through to the content. GSAP fades it by its id. Desktop only. */}
      <div id="scene-layer" className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden="true">
        <HeroSceneLoader />
      </div>

      {/* Content: sits above the 3D layer */}
      <main className="relative z-10 flex flex-1 flex-col">
        <HeroSection />
        <AcServicesSection />
        <FridgeServicesSection />
        <HowItWorksSection />
        <ChatDemoSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
    </>
  );
}
