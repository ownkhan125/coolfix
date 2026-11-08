"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BookingForm from "./BookingForm";

// Everything inside the panel that can take keyboard focus (used to keep Tab inside the modal)
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Panel animation: slides up as a bottom sheet on mobile, scales and fades in from tablet up
const SHEET_ANIMATION = { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
const DIALOG_ANIMATION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Booking modal: dimmed backdrop and a glass panel with the booking form.
// Esc or a backdrop click closes it, Tab stays inside, page scroll is locked while open.
export default function BookingModal({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  // Only read the screen size while open (this never runs on the server, where isOpen is false)
  const isMobile = isOpen && window.matchMedia("(max-width: 767px)").matches;
  const panelAnimation = isMobile ? SHEET_ANIMATION : DIALOG_ANIMATION;
  const transition = shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.45 };

  // On open: lock page scroll and move focus into the panel. On close: unlock scroll.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // While open: Esc closes the modal
  useEffect(() => {
    if (!isOpen) return;
    function handleEscapeKey(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Focus trap: Tab on the last element goes to the first, Shift+Tab on the first goes to the last
  function handlePanelKeyDown(event) {
    if (event.key !== "Tab") return;
    const focusableElements = Array.from(panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div key="booking-modal" className="fixed inset-0 z-60 flex items-end justify-center md:items-center md:p-6">
          {/* Backdrop: soft dimmed layer, a click on it closes the modal */}
          <motion.div
            className="modal-backdrop absolute inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
            aria-hidden="true"
          />

          {/* Panel: glass dialog with the form (bottom sheet on mobile) */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onKeyDown={handlePanelKeyDown}
            {...panelAnimation}
            transition={transition}
            className="modal-panel relative w-full overflow-y-auto p-6 md:max-w-xl md:p-8"
          >
            {/* Header: title, short intro and close button */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="booking-modal-title" className="modal-title">
                  Book a fix
                </h2>
                <p className="text-muted mt-1">Tell us what&apos;s wrong and pick a time. It takes a minute.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close booking form"
                className="clay-round-button flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <BookingForm onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
