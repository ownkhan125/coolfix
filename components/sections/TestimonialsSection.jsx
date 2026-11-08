import GlassSwiper from "@/components/ui/GlassSwiper";
import TestimonialCard from "@/components/ui/TestimonialCard";

// Testimonials: heading, intro and a glass card slider with five customer reviews
export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="mx-auto w-full max-w-6xl overflow-x-clip px-4 py-20 md:py-28">
      {/* Heading and intro */}
      <div className="mx-auto max-w-2xl text-center">
        <h2>
          Loved by <span className="text-gradient-cool">cool customers</span>
        </h2>
        <p className="text-lead text-muted mt-4">
          Real problems, fixed fast. Here&apos;s what people say after booking through the assistant.
        </p>
      </div>

      {/* Slider: five testimonial cards, side by side (3 on desktop, 2 on tablet, 1 on mobile) */}
      <div className="mt-12">
        <GlassSwiper label="Customer testimonials">
          <TestimonialCard
            initials="SK"
            name="Sara Khan"
            city="Austin, TX"
            service="AC"
            quote="Sent a photo of my AC at lunch and had a technician booked before my coffee got cold."
            result="Booked in 40 sec"
          />
          <TestimonialCard
            initials="DM"
            name="David Miller"
            city="Phoenix, AZ"
            service="AC"
            quote="It was 110 degrees and the assistant marked my job urgent. The tech showed up the same afternoon."
            result="Fixed same day"
          />
          <TestimonialCard
            initials="LR"
            name="Lucia Rossi"
            city="Miami, FL"
            service="Fridge"
            quote="My fridge was buzzing all night. The assistant guessed the fan from my photo and it was right."
            result="Booked in 1 min"
          />
          <TestimonialCard
            initials="JO"
            name="James Okafor"
            city="Houston, TX"
            service="AC"
            quote="No phone calls, no hold music. I picked a slot in the chat and got a confirmation right away."
            result="Booked in 35 sec"
          />
          <TestimonialCard
            initials="AN"
            name="Aisha Noor"
            city="Dallas, TX"
            service="Fridge"
            quote="The technician arrived with the right part already in the van. Fixed in under an hour."
            result="Fixed in 1 visit"
          />
        </GlassSwiper>
      </div>
    </section>
  );
}
