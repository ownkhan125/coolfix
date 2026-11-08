"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ChatBubble from "@/components/ui/ChatBubble";
import { DUMMY_ASSISTANT_REPLY } from "@/lib/dummy-data";
import ChatComposer from "./ChatComposer";
import TypingIndicator from "./TypingIndicator";

// Everything inside the panel that can take keyboard focus (used to keep Tab inside on mobile)
const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

// Panel animation: slides up full screen on mobile, grows out of the launcher corner from tablet up
const FULL_SCREEN_ANIMATION = { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
const CORNER_ANIMATION = {
  initial: { opacity: 0, scale: 0.9, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 16 },
};

// Chat panel: header, welcome message, the conversation, typing indicator and composer.
// Mobile: full screen, focus trapped and page scroll locked. Tablet and up: a corner panel, the page stays usable.
// Esc closes it on every screen.
export default function ChatPanel({ isOpen, onClose, messages, onMessagesChange }) {
  const panelRef = useRef(null);
  const messageListRef = useRef(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  // Only read the screen size while open (this never runs on the server, where isOpen is false)
  const isMobile = isOpen && window.matchMedia("(max-width: 767px)").matches;
  const panelAnimation = isMobile ? FULL_SCREEN_ANIMATION : CORNER_ANIMATION;
  const transition = shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.45 };

  // On open: focus the message input. Mobile (full screen) also locks the page scroll.
  useEffect(() => {
    if (!isOpen) return;
    document.getElementById("chat-message-input")?.focus();
    if (!isMobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isMobile]);

  // While open: Esc closes the panel
  useEffect(() => {
    if (!isOpen) return;
    function handleEscapeKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Keep the newest message in view (on open, on a new message, and when the typing dots appear)
  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;
    messageList.scrollTo({ top: messageList.scrollHeight, behavior: shouldReduceMotion ? "auto" : "smooth" });
  }, [isOpen, messages, isAssistantTyping, shouldReduceMotion]);

  // Focus trap, mobile only: Tab on the last element goes to the first, Shift+Tab on the first goes to the last
  function handlePanelKeyDown(event) {
    if (!isMobile || event.key !== "Tab") return;
    const focusableElements = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  // Add the customer's message, show the typing dots, then add the assistant's reply
  function handleSendMessage(text, photo) {
    const customerMessage = { id: crypto.randomUUID(), sender: "customer", text, photoUrl: photo?.previewUrl };
    onMessagesChange((currentMessages) => [...currentMessages, customerMessage]);
    setIsAssistantTyping(true);

    // TODO: send the message (and photo) to the AI assistant API and show its real reply.
    // For now a dummy reply arrives after a short typing pause.
    setTimeout(() => {
      const assistantMessage = { id: crypto.randomUUID(), sender: "assistant", text: DUMMY_ASSISTANT_REPLY };
      onMessagesChange((currentMessages) => [...currentMessages, assistantMessage]);
      setIsAssistantTyping(false);
    }, 1500);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal={isMobile}
          aria-labelledby="chat-panel-title"
          onKeyDown={handlePanelKeyDown}
          {...panelAnimation}
          transition={transition}
          className="chat-panel fixed inset-0 z-50 flex origin-bottom-right flex-col md:inset-auto md:right-6 md:bottom-24"
        >
          {/* Header: assistant name, online status and close button */}
          <div className="chat-panel-header flex items-center gap-3 px-5 py-4">
            <span className="online-dot h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            <div>
              <h2 id="chat-panel-title" className="chat-panel-title">
                CoolFix assistant
              </h2>
              <p className="text-small text-muted">Online · replies in seconds</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="clay-round-button ml-auto flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Conversation: welcome message, then the messages of this visit; new ones are announced */}
          <div ref={messageListRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4" aria-live="polite">
            <ChatBubble text="Hi! I'm the CoolFix assistant. Tell me what's wrong with your AC or fridge, and send a photo if you can." />
            {messages.map((message) => (
              <ChatBubble key={message.id} isCustomer={message.sender === "customer"} text={message.text} photoUrl={message.photoUrl} />
            ))}
            {isAssistantTyping && <TypingIndicator />}
          </div>

          <ChatComposer onSend={handleSendMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
