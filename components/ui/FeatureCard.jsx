import GlassCard from "./GlassCard";

// Feature card: clay icon, title and short text inside a glass card. Used by the service and how-it-works sections.
export default function FeatureCard({ icon, title, text }) {
  return (
    <GlassCard>
      <div className="clay-icon mb-5 flex h-14 w-14 items-center justify-center" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p className="text-muted mt-2">{text}</p>
    </GlassCard>
  );
}
