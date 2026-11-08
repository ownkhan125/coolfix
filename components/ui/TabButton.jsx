"use client";

import { motion, useReducedMotion } from "motion/react";

// Bead movement: a bouncy spring, so the bead overshoots a little and settles on the new tab
const BEAD_SPRING = { type: "spring", bounce: 0.35, duration: 0.5 };

// Tab button: one tab inside <Tabs>. The active tab shows the raised clay bead, which slides between tabs
// (Motion layoutId) and squishes a little as it lands. Inactive tabs look pressed in and lift on hover.
// Only the active tab is reachable with the Tab key; the arrow keys (handled in Tabs.jsx) move between tabs.
export default function TabButton({ id, label, panelId, isActive, onSelect }) {
  const shouldReduceMotion = useReducedMotion();
  const hoverAnimation = isActive || shouldReduceMotion ? undefined : { y: -2 };

  return (
    <motion.button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      whileHover={hoverAnimation}
      className={`clay-tab ${isActive ? "clay-tab-active" : ""} relative flex-1 px-3 py-2`}
    >
      {/* Bead: raised clay shape behind the active label. Squish = wide and flat on arrival, then back to normal. */}
      {isActive && (
        <motion.span
          layoutId="tab-bead"
          className="clay-tab-bead absolute inset-0"
          animate={shouldReduceMotion ? undefined : { scaleX: [1.1, 1], scaleY: [0.88, 1] }}
          transition={shouldReduceMotion ? { duration: 0 } : BEAD_SPRING}
          aria-hidden="true"
        />
      )}

      {/* Label: sits above the bead */}
      <span className="relative">{label}</span>
    </motion.button>
  );
}
