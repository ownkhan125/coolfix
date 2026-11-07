import FeatureCard from "@/components/ui/FeatureCard";

// Fridge services: heading and 2 service cards on the left, right column kept free for the fridge model
export default function FridgeServicesSection() {
  return (
    <section id="fridge-services" className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-28 lg:grid-cols-2">
      {/* Content: heading, intro and service cards */}
      <div>
        <h2>Fridge not cold? We&apos;ll bring it back</h2>
        <p className="text-lead text-muted mt-4">
          From a warm shelf to a loud compressor, we repair all major fridge and freezer brands at home.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon="🥶"
            title="Not cooling"
            text="Warm shelves or a frosted freezer. We check the thermostat, fan and gas and fix it on the spot."
          />
          <FeatureCard
            icon="🔊"
            title="Strange noise"
            text="Buzzing, clicking or rattling usually means a worn fan or compressor. We find the source fast."
          />
        </div>
      </div>

      {/* 3D space: the fridge model slides in here while scrolling (desktop only) */}
      <div className="hidden lg:block" aria-hidden="true" />
    </section>
  );
}
