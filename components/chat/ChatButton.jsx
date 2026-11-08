"use client";

import { useContext } from "react";
import Button from "@/components/ui/Button";
import { ChatWidgetContext } from "./ChatWidgetContext";

// Chat button: a clay button that opens the chat widget. Use it for every "Start a chat" on the site.
export default function ChatButton({ children, variant }) {
  const { openChatWidget } = useContext(ChatWidgetContext);

  return (
    <Button variant={variant} onClick={openChatWidget}>
      {children}
    </Button>
  );
}
