import Badge from "@/components/ui/Badge";
import ChatBubble from "@/components/ui/ChatBubble";
import GlassCard from "@/components/ui/GlassCard";

// Chat demo: intro text and a static mockup of a customer chatting with the assistant
export default function ChatDemoSection() {
  return (
    <section id="chat-demo" className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 md:py-28 lg:grid-cols-2">
      {/* Text: heading and intro */}
      <div>
        <h2>
          See the assistant <span className="text-gradient-cool">in action</span>
        </h2>
        <p className="text-lead text-muted mt-4">
          It reads the message, looks at the photo, scores the lead and books the visit, all in one short chat.
        </p>
      </div>

      {/* Chat mockup: header, messages, photo and booking badge */}
      <GlassCard>
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="logo-text">CoolFix assistant</p>
          <p className="text-small text-muted">Online</p>
        </div>

        <div className="flex flex-col gap-4">
          <ChatBubble isCustomer text="Hi! My AC is blowing warm air since this morning. Here's a photo." />

          {/* Customer photo placeholder */}
          <div className="flex justify-end">
            <div className="photo-placeholder flex h-28 w-44 items-center justify-center" role="img" aria-label="Customer photo of the AC unit">
              📷 AC photo
            </div>
          </div>

          <ChatBubble text="Thanks! It looks like low gas in your split AC. A refill should fix it. I booked today at 4:00 PM for you." />

          <div className="flex justify-start">
            <Badge>✓ Booked · Today, 4:00 PM</Badge>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
