"use client";

import { motion, useReducedMotion } from "motion/react";

// Warm clay button with a small lift on hover and a squeeze on tap (styles in styles/components.css)
export default function Button({ children, type = "button", onClick }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="clay-button inline-flex items-center justify-center gap-2 px-6 py-3"
      // Skip the movement when the user prefers reduced motion
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
