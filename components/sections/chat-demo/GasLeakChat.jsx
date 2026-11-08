import Badge from "@/components/ui/Badge";
import ChatBubble from "@/components/ui/ChatBubble";
import RevealItem from "@/components/ui/RevealItem";

// Demo conversation for the "Gas leak" tab: message, photo, urgent assistant reply, lead score, urgent tag and booking
export default function GasLeakChat() {
  return (
    <>
      <RevealItem>
        <ChatBubble isCustomer text="My AC is hissing and there's an oily spot under the indoor unit. Is that bad?" />
      </RevealItem>

      {/* Customer photo placeholder */}
      <RevealItem>
        <div className="flex justify-end">
          <div className="photo-placeholder flex h-28 w-44 items-center justify-center" role="img" aria-label="Customer photo of the oily spot under the AC">
            📷 Leak photo
          </div>
        </div>
      </RevealItem>

      <RevealItem>
        <ChatBubble text="That looks like a refrigerant leak. Please switch the AC off for now. I marked this urgent and a technician is on the way." />
      </RevealItem>

      {/* Result: lead score, urgent tag and booking */}
      <RevealItem>
        <div className="flex flex-wrap gap-2">
          <Badge variant="score">Lead score 98</Badge>
          <Badge variant="urgent">Urgent</Badge>
          <Badge>✓ Booked · Within 2 hours</Badge>
        </div>
      </RevealItem>
    </>
  );
}
