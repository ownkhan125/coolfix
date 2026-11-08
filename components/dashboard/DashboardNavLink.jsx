"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

// Dashboard nav link: icon (children) and label. The active link gets the raised clay bead,
// which slides between links (Motion layoutId). Icon above the label in the mobile tab bar, beside it in the sidebar.
export default function DashboardNavLink({ href, label, isActive, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <li className="flex-1 md:flex-none">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`dashboard-nav-link ${isActive ? "dashboard-nav-link-active" : ""} relative flex flex-col items-center gap-1 px-2 py-2 md:flex-row md:gap-3 md:px-4 md:py-3`}
      >
        {isActive && (
          <motion.span
            layoutId="dashboard-nav-bead"
            className="clay-tab-bead absolute inset-0"
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.25, duration: 0.5 }}
            aria-hidden="true"
          />
        )}
        <span className="relative" aria-hidden="true">
          {children}
        </span>
        <span className="relative">{label}</span>
      </Link>
    </li>
  );
}
