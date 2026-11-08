"use client";

import { motion, useReducedMotion } from "motion/react";

// Stat card: glass card with a clay icon (children), label, big value and a small trend line.
// revealOrder (0, 1, 2…) makes the cards fade up one after another.
export default function StatCard({ label, value, trend, revealOrder, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: revealOrder * 0.08 }}
      className="glass-card flex flex-col gap-3 p-5"
    >
      <div className="clay-icon flex h-11 w-11 items-center justify-center" aria-hidden="true">
        {children}
      </div>
      <p className="text-small text-muted">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="text-small text-muted">{trend}</p>
    </motion.div>
  );
}
