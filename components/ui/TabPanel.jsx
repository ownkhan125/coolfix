"use client";

import { motion, useReducedMotion } from "motion/react";

// Panel animation: slide in from the right and fade in, then show the rows (RevealItem) one by one.
// Leaving: slide out to the left and fade out.
const PANEL_VARIANTS = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delayChildren: 0.15, staggerChildren: 0.25 } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

// Reduced motion: no slide and no one-by-one rows, the content simply swaps
const REDUCED_PANEL_VARIANTS = {
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0 } },
};

// Tab panel: the content of one tab. Use it inside <AnimatePresence mode="wait"> with a key per tab.
export default function TabPanel({ id, tabId, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      tabIndex={0}
      variants={shouldReduceMotion ? REDUCED_PANEL_VARIANTS : PANEL_VARIANTS}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      exit="exit"
      className="flex flex-col gap-4"
    >
      {children}
    </motion.div>
  );
}
