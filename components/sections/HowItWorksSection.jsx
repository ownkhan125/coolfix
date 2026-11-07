import FeatureCard from "@/components/ui/FeatureCard";

// How it works: heading and the 3 booking steps as cards
export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
      {/* Heading and intro */}
      <div className="max-w-2xl">
        <h2>
          How it <span className="text-gradient-warm">works</span>
        </h2>
        <p className="text-lead text-muted mt-4">Three steps, no phone calls, no waiting on hold.</p>
      </div>

      {/* Steps */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <FeatureCard icon="📸" title="Snap the problem" text="Send a message and a photo. Our assistant understands what's wrong." />
        <FeatureCard icon="🗓️" title="Pick a time" text="Choose a real open slot. It's booked instantly and confirmed by message." />
        <FeatureCard icon="🚐" title="We show up" text="A technician arrives on time with the right parts to fix it." />
      </div>
    </section>
  );
}
