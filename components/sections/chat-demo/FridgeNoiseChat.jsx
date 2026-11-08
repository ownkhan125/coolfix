import Badge from "@/components/ui/Badge";
import ChatBubble from "@/components/ui/ChatBubble";
import RevealItem from "@/components/ui/RevealItem";

// Demo conversation for the "Fridge noise" tab: message, photo, assistant reply, lead score and booking
export default function FridgeNoiseChat() {
  return (
    <>
      <RevealItem>
        <ChatBubble isCustomer text="My fridge makes a loud buzzing noise at night. It still cools, but it's getting worse." />
      </RevealItem>

      {/* Customer photo placeholder */}
      <RevealItem>
        <div className="flex justify-end">
          <div className="photo-placeholder flex h-28 w-44 items-center justify-center" role="img" aria-label="Customer photo of the back of the fridge">
            📷 Fridge photo
          </div>
        </div>
      </RevealItem>

      <RevealItem>
        <ChatBubble text="Got it. That buzz usually means a worn compressor fan. It's a quick part swap. I booked tomorrow at 10:00 AM." />
      </RevealItem>

      {/* Result: lead score and booking */}
      <RevealItem>
        <div className="flex flex-wrap gap-2">
          <Badge variant="score">Lead score 74</Badge>
          <Badge>✓ Booked · Tomorrow, 10:00 AM</Badge>
        </div>
      </RevealItem>
    </>
  );
}
