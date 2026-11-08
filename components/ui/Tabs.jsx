"use client";

import { LayoutGroup } from "motion/react";

// Tabs: clay pill bar that holds the TabButtons. Left/Right arrow keys move to the previous/next tab and select it.
// LayoutGroup keeps this bar's sliding bead separate from any other tab bar on the page.
export default function Tabs({ label, children }) {
  // Arrow keys: find the focused tab, then focus and click its neighbour (wrapping around at both ends)
  function handleTabKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    const tabs = Array.from(event.currentTarget.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(currentIndex + step + tabs.length) % tabs.length];
    nextTab.focus();
    nextTab.click();
  }

  return (
    <LayoutGroup id={label}>
      <div role="tablist" aria-label={label} onKeyDown={handleTabKeyDown} className="clay-tab-list flex w-full gap-1 p-1.5">
        {children}
      </div>
    </LayoutGroup>
  );
}
