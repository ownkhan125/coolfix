import Badge from "./Badge";
import GlassCard from "./GlassCard";

// Testimonial card: clay avatar with initials, name and city, service badge, 5 stars, quote and a result chip.
// service: "AC" (sky badge) or "Fridge" (lilac badge).
export default function TestimonialCard({ initials, name, city, service, quote, result }) {
  return (
    <GlassCard>
      {/* Customer: avatar, name, city and service badge */}
      <div className="flex items-center gap-4">
        <div className="clay-avatar flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden="true">
          {initials}
        </div>
        <div>
          <p className="testimonial-name">{name}</p>
          <p className="text-small text-muted">{city}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={service === "AC" ? "sky" : "lilac"}>{service}</Badge>
        </div>
      </div>

      {/* Rating, quote and result */}
      <p className="testimonial-stars mt-4" role="img" aria-label="5 out of 5 stars">
        ★★★★★
      </p>
      <p className="mt-3">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5">
        <Badge>{result}</Badge>
      </div>
    </GlassCard>
  );
}
