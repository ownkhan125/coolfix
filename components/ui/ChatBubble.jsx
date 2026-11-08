import Image from "next/image";

// Chat bubble: customer messages sit on the right, assistant replies on the left (styles in styles/components.css).
// photoUrl (optional) shows an attached photo above the text.
export default function ChatBubble({ text, isCustomer, photoUrl }) {
  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <div className={`${isCustomer ? "chat-bubble-customer" : "chat-bubble-assistant"} flex max-w-xs flex-col gap-2 px-4 py-3`}>
        {photoUrl && (
          <Image src={photoUrl} alt="Attached photo" width={160} height={112} unoptimized className="chat-photo h-28 w-40 object-cover" />
        )}
        {text && <p>{text}</p>}
      </div>
    </div>
  );
}
