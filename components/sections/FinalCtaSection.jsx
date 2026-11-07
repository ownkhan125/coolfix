import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

// Final call-to-action: big glass card asking the visitor to book
export default function FinalCtaSection() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
      <GlassCard>
        <div className="flex flex-col items-center gap-6 py-6 text-center md:py-10">
          <h2>
            Too hot in here? <span className="text-gradient-warm">Let&apos;s fix that today.</span>
          </h2>
          <p className="text-lead text-muted max-w-xl">
            Send us a message and a photo. You&apos;ll get a confirmed time slot in under a minute.
          </p>
          <Button>Start a chat</Button>
        </div>
      </GlassCard>
    </section>
  );
}
