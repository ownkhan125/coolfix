"use client";

import { motion, useReducedMotion } from "motion/react";

// Chat launcher: floating clay button in the bottom-right corner that opens and closes the chat panel.
// Shows a chat icon with a mint "online" dot, or a close icon while the panel is open.
// On mobile it hides while the panel is open, because the panel then covers the whole screen.
export default function ChatLauncher({ isOpen, onOpen, onClose }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={isOpen ? onClose : onOpen}
      aria-label={isOpen ? "Close chat" : "Chat with the CoolFix assistant"}
      aria-expanded={isOpen}
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      className={`chat-launcher fixed right-4 bottom-4 z-50 h-14 w-14 items-center justify-center md:right-6 md:bottom-6 ${isOpen ? "hidden md:flex" : "flex"}`}
    >
      {isOpen ? (
        // Close icon
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      ) : (
        <>
          {/* Chat icon: speech bubble */}
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
          {/* Online dot */}
          <span className="online-dot absolute top-1 right-1 h-3 w-3" aria-hidden="true" />
        </>
      )}
    </motion.button>
  );
}
