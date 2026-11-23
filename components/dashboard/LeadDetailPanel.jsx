"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Badge from "@/components/ui/Badge";
import StageSelect from "./StageSelect";

// Everything inside the panel that can take keyboard focus (used to keep Tab inside the panel)
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Lead detail panel: glass slide-over from the right with the badges, "Move to" dropdown, photo, contact details,
// AI summary (chat leads only) and activity log.
// Shown while lead is not null. Esc or a backdrop click closes it, Tab stays inside, page scroll is locked.
// onStageChange(leadId, newStage) comes from LeadsView.
export default function LeadDetailPanel({ lead, onClose, onStageChange }) {
  const panelRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isOpen = lead !== null;
  const transition = shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.45 };

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

  // While open: Esc closes the panel
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
        <motion.div key="lead-detail" className="fixed inset-0 z-60 flex justify-end">
          {/* Backdrop: a click on it closes the panel */}
          <motion.div
            className="modal-backdrop absolute inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25 }}
            aria-hidden="true"
          />

          {/* Panel: slides in from the right */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-detail-title"
            onKeyDown={handlePanelKeyDown}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={transition}
            className="slide-over-panel relative flex h-full w-full flex-col gap-6 overflow-y-auto p-6"
          >
            {/* Header: name, issue and close button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="lead-detail-title" className="modal-title">
                  {lead.name}
                </h2>
                <p className="text-muted mt-1">{lead.issue}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close lead details"
                className="clay-round-button flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Chips: hot / score (form leads are always hot, chat leads show the AI score once given) and appliance */}
            <div className="flex flex-wrap gap-2">
              {lead.source === "form" && <Badge variant="urgent">Hot · Form</Badge>}
              {lead.source === "chat" && lead.leadScore === null && <Badge variant="score">Chat · Not scored yet</Badge>}
              {lead.source === "chat" && lead.leadScore !== null && (
                <Badge variant={lead.isHot ? "urgent" : "score"}>
                  Score {lead.leadScore}
                  {lead.isHot && " · Hot"}
                </Badge>
              )}
              <Badge variant={lead.appliance === "AC" ? "sky" : "lilac"}>{lead.appliance}</Badge>
            </div>

            {/* Pipeline stage */}
            <StageSelect id="lead-detail-stage" value={lead.stage} onStageChange={(newStage) => onStageChange(lead.id, newStage)} />

            {/* Customer photos: private links that work for one hour; a click opens the full photo in a new tab */}
            {lead.photoUrls.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {lead.photoUrls.map((photoUrl, photoIndex) => (
                  <a key={photoUrl} href={photoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open photo ${photoIndex + 1} from ${lead.name}`}>
                    <Image src={photoUrl} alt={`Photo ${photoIndex + 1} from ${lead.name}`} width={112} height={112} unoptimized className="upload-thumb h-28 w-28 object-cover" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-small text-muted">No photos sent.</p>
            )}

            {/* Contact details */}
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-small text-muted">Phone</dt>
                <dd className="lead-name">{lead.phone}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Email</dt>
                <dd className="lead-name break-all">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Area</dt>
                <dd className="lead-name">{lead.area}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Received</dt>
                <dd className="lead-name">{lead.receivedAt}</dd>
              </div>
            </dl>

            {/* AI summary: chat leads only (form leads have no AI summary) */}
            {lead.aiSummary && (
              <section className="ai-summary flex flex-col gap-2 p-4" aria-labelledby="lead-ai-summary-title">
                <h3 id="lead-ai-summary-title" className="dashboard-card-title">
                  AI summary
                </h3>
                <p>{lead.aiSummary}</p>
              </section>
            )}

            {/* Activity log: newest last */}
            <section className="flex flex-col gap-3" aria-labelledby="lead-activity-title">
              <h3 id="lead-activity-title" className="dashboard-card-title">
                Activity
              </h3>
              <ol className="flex flex-col gap-3">
                {lead.activity.map((activityItem) => (
                  <li key={activityItem.id} className="flex gap-3">
                    <span className="activity-dot mt-2 h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                    <span className="flex flex-col">
                      <span>{activityItem.text}</span>
                      <span className="text-small text-muted">{activityItem.time}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
