// Chat bubble: customer messages sit on the right, assistant replies on the left (styles in styles/components.css)
export default function ChatBubble({ text, isCustomer }) {
  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <p className={`${isCustomer ? "chat-bubble-customer" : "chat-bubble-assistant"} max-w-xs px-4 py-3`}>{text}</p>
    </div>
  );
}
