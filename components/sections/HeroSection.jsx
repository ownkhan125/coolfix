import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import BookingButton from "@/components/booking/BookingButton";

// Hero: fills the first screen. Headline, intro and buttons on the left; space for the AC model on the right (desktop only)
export default function HeroSection() {
  return (
    <section id="hero" className="mx-auto grid min-h-svh w-full max-w-6xl items-center gap-10 px-4 pt-28 pb-16 lg:grid-cols-2">
      {/* 3D space: kept empty and vertically centered next to the headline; the AC model is fitted inside it (see components/three/scene-placement.js) */}
      <div data-scene-anchor="ac-hero" className="hidden lg:order-last lg:block lg:h-125" aria-hidden="true" />

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
          <BookingButton>Book a fix</BookingButton>
          <Button href="#how-it-works" variant="secondary">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}
