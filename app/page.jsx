import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

// Home page: temporary placeholder until the real sections are built
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      {/* Placeholder: heading and short tagline */}
      <h1>CoolFix</h1>
      <p className="text-muted">AI lead assistant for AC repair and plumbing. Coming soon.</p>

      {/* Preview: glass card with a clay button inside */}
      <div className="mt-8 w-full max-w-md">
        <GlassCard>
          <h3>Snap the problem</h3>
          <p className="text-muted mt-2 mb-6">We understand it from a photo.</p>
          <Button>Book a visit</Button>
        </GlassCard>
      </div>
    </main>
  );
}
