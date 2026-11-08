import Badge from "@/components/ui/Badge";
import ChatBubble from "@/components/ui/ChatBubble";
import RevealItem from "@/components/ui/RevealItem";

// Demo conversation for the "AC not cooling" tab: message, photo, assistant reply, lead score and booking
export default function AcNotCoolingChat() {
  return (
    <>
      <RevealItem>
        <ChatBubble isCustomer text="Hi! My AC is blowing warm air since this morning. Here's a photo." />
      </RevealItem>

      {/* Customer photo placeholder */}
      <RevealItem>
        <div className="flex justify-end">
          <div className="photo-placeholder flex h-28 w-44 items-center justify-center" role="img" aria-label="Customer photo of the AC unit">
            📷 AC photo
          </div>
        </div>
      </RevealItem>

      <RevealItem>
        <ChatBubble text="Thanks! It looks like low gas in your split AC. A refill should fix it. I booked today at 4:00 PM for you." />
      </RevealItem>

      {/* Result: lead score and booking */}
      <RevealItem>
        <div className="flex flex-wrap gap-2">
          <Badge variant="score">Lead score 92</Badge>
          <Badge>✓ Booked · Today, 4:00 PM</Badge>
        </div>
      </RevealItem>
    </>
  );
}
