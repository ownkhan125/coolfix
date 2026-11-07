import FeatureCard from "@/components/ui/FeatureCard";

// AC services: left column kept free for the AC model, heading and 3 service cards on the right
export default function AcServicesSection() {
  return (
    <section id="ac-services" className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:py-28 lg:grid-cols-2">
      {/* 3D space: the AC model moves here while scrolling (desktop only) */}
      <div className="hidden lg:block" aria-hidden="true" />

      {/* Content: heading, intro and service cards */}
      <div>
        <h2>AC repair that keeps you cool</h2>
        <p className="text-lead text-muted mt-4">
          Split, window or central: we diagnose it from your photo and come prepared.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-1">
          <FeatureCard
            icon="🧊"
            title="Gas refill"
            text="Low gas means warm air. We find the leak, fix it and refill to the right pressure."
          />
          <FeatureCard
            icon="🌡️"
            title="Cooling issues"
            text="Weak airflow, ice on the coil or a unit that won't start. We fix it on the first visit."
          />
          <FeatureCard
            icon="🔧"
            title="Installation"
            text="New split or window AC, mounted neatly with a clean drain line and a tested setup."
          />
        </div>
      </div>
    </section>
  );
}
