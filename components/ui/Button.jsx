"use client";

import { motion, useReducedMotion } from "motion/react";

// Clay button with a small lift on hover and a squeeze on tap (styles in styles/components.css).
// variant: "primary" (warm gradient) or "secondary" (white clay). With href it renders as a link.
export default function Button({ children, type = "button", onClick, href, variant = "primary" }) {
  const shouldReduceMotion = useReducedMotion();

  const className = `clay-button ${variant === "secondary" ? "clay-button-secondary" : ""} inline-flex items-center justify-center gap-2 px-6 py-3`;

  // Skip the movement when the user prefers reduced motion
  const hoverAnimation = shouldReduceMotion ? undefined : { y: -2, scale: 1.02 };
  const tapAnimation = shouldReduceMotion ? undefined : { scale: 0.97 };

  // Navigation: render a link
  if (href) {
    return (
      <motion.a href={href} className={className} whileHover={hoverAnimation} whileTap={tapAnimation}>
        {children}
      </motion.a>
    );
  }

  // Action: render a real button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
    >
      {children}
    </motion.button>
  );
}
