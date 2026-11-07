import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// Hero: headline, intro and buttons on the left; space for the 3D models on the right (above the text on mobile)
export default function HeroSection() {
  return (
    <section id="hero" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-32 pb-16 lg:grid-cols-2 lg:pt-40">
      {/* 3D space: kept empty, the fixed 3D canvas shows the models here */}
      <div className="h-64 md:h-80 lg:order-last lg:h-125" aria-hidden="true" />

      {/* Text: badge, headline, intro and call-to-action buttons */}
      <div className="flex flex-col items-start gap-6">
        <Badge>❄️ AI assistant for cooling repairs</Badge>
        <h1>
          Your AC and fridge, <span className="text-gradient-cool">fixed fast</span>.
        </h1>
        <p className="text-lead text-muted">
          Send a message and a photo. Our assistant understands the problem, books a real time slot and a technician
          shows up.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="#contact">Book a fix</Button>
          <Button href="#how-it-works" variant="secondary">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}
