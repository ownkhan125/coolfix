"use client";

import { motion, useReducedMotion } from "motion/react";

// Each dot hops up and back down, one after another
const DOT_HOP = { y: [0, -4, 0] };

// Typing indicator: three dots in an assistant bubble while the reply is on its way.
// Reduced motion: the dots stay still. Screen readers hear "Assistant is typing".
export default function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion();
  const hop = shouldReduceMotion ? undefined : DOT_HOP;
  const hopTiming = (delay) => ({ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay });

  return (
    <div className="flex justify-start" role="status">
      <span className="sr-only">Assistant is typing</span>
      <div className="chat-bubble-assistant flex items-center gap-1.5 px-4 py-4" aria-hidden="true">
        <motion.span className="typing-dot h-2 w-2" animate={hop} transition={hopTiming(0)} />
        <motion.span className="typing-dot h-2 w-2" animate={hop} transition={hopTiming(0.15)} />
        <motion.span className="typing-dot h-2 w-2" animate={hop} transition={hopTiming(0.3)} />
      </div>
    </div>
  );
}
