"use client";

import { createContext, useEffect, useRef, useState } from "react";
import ChatLauncher from "./ChatLauncher";
import ChatPanel from "./ChatPanel";

// Shared open/close state for the chat widget, so any "Start a chat" button on the site can open it.
// Read it with useContext(ChatWidgetContext) inside a client component.
export const ChatWidgetContext = createContext(null);

// Chat widget provider: wraps the public site, holds the open state and the conversation,
// and renders the floating launcher and the chat panel once
export default function ChatWidgetProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // The conversation lives here, so it stays when the panel is closed and opened again (a page reload starts fresh)
  const [chatMessages, setChatMessages] = useState([]);
  // The button that opened the chat, so focus can go back to it after closing
  const openerRef = useRef(null);

  function openChatWidget(event) {
    openerRef.current = event?.currentTarget ?? document.activeElement;
    setIsChatOpen(true);
  }

  function closeChatWidget() {
    setIsChatOpen(false);
  }

  // After closing, return focus to the opener. Done after the render, because on mobile the launcher
  // is hidden while the panel is open and can only take focus once it is visible again.
  useEffect(() => {
    if (!isChatOpen) openerRef.current?.focus();
  }, [isChatOpen]);

  return (
    <ChatWidgetContext.Provider value={{ isChatOpen, openChatWidget, closeChatWidget }}>
      {children}
      <ChatLauncher isOpen={isChatOpen} onOpen={openChatWidget} onClose={closeChatWidget} />
      <ChatPanel isOpen={isChatOpen} onClose={closeChatWidget} messages={chatMessages} onMessagesChange={setChatMessages} />
    </ChatWidgetContext.Provider>
  );
}
