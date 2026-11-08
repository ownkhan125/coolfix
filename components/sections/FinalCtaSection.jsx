import ChatButton from "@/components/chat/ChatButton";
import GlassCard from "@/components/ui/GlassCard";

// Final call-to-action: big glass card asking the visitor to book. Desktop: the AC model comes back on the right.
export default function FinalCtaSection() {
  return (
    <section id="contact" className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-28 lg:grid-cols-3 lg:items-center">
      {/* Card: heading, intro and button (two of three columns on desktop) */}
      <div className="lg:col-span-2">
        <GlassCard>
          <div className="flex flex-col items-center gap-6 py-6 text-center md:py-10">
            <h2>
              Too hot in here? <span className="text-gradient-warm">Let&apos;s fix that today.</span>
            </h2>
            <p className="text-lead text-muted max-w-xl">
              Send us a message and a photo. You&apos;ll get a confirmed time slot in under a minute.
            </p>
            <ChatButton>Start a chat</ChatButton>
          </div>
        </GlassCard>
      </div>

      {/* 3D space: AC model anchor next to the card, outside the glass so the AC stays sharp (desktop only) */}
      <div data-scene-anchor="ac-cta" className="hidden lg:block lg:h-72" aria-hidden="true" />
    </section>
  );
}
