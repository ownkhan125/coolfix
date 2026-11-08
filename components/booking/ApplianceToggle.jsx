"use client";

import { motion, useReducedMotion } from "motion/react";

// Appliance toggle: clay segmented control (AC / Fridge) built on real radio buttons, so arrow keys work.
// The chosen option gets the raised clay bead, which slides between the two (same look as the chat demo tabs).
export default function ApplianceToggle({ value, onChange, error }) {
  const shouldReduceMotion = useReducedMotion();
  const beadTransition = shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.35, duration: 0.5 };

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? "booking-appliance-error" : undefined}>
      <legend className="field-label mb-2">Appliance</legend>

      {/* Options: the radio input is visually hidden, the label is the clay segment */}
      <div className="clay-tab-list flex w-full gap-1 p-1.5">
        <label className={`clay-tab ${value === "AC" ? "clay-tab-active" : ""} relative flex-1 px-3 py-2 text-center`}>
          <input type="radio" name="appliance" value="AC" checked={value === "AC"} onChange={onChange} className="sr-only" />
          {value === "AC" && (
            <motion.span layoutId="appliance-bead" className="clay-tab-bead absolute inset-0" transition={beadTransition} aria-hidden="true" />
          )}
          <span className="relative">AC</span>
        </label>

        <label className={`clay-tab ${value === "Fridge" ? "clay-tab-active" : ""} relative flex-1 px-3 py-2 text-center`}>
          <input type="radio" name="appliance" value="Fridge" checked={value === "Fridge"} onChange={onChange} className="sr-only" />
          {value === "Fridge" && (
            <motion.span layoutId="appliance-bead" className="clay-tab-bead absolute inset-0" transition={beadTransition} aria-hidden="true" />
          )}
          <span className="relative">Fridge</span>
        </label>
      </div>

      {error && (
        <p id="booking-appliance-error" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
