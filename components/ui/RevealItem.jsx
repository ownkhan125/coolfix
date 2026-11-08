"use client";

import { motion } from "motion/react";

// Row animation: fade in and rise a little. The parent TabPanel decides when (one row after another).
const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Reveal item: wraps one chat row (message, photo or chips) so it appears in turn inside a TabPanel
export default function RevealItem({ children }) {
  return <motion.div variants={REVEAL_VARIANTS}>{children}</motion.div>;
}
