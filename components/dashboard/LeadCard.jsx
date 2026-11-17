"use client";

import { motion, useReducedMotion } from "motion/react";
import Badge from "@/components/ui/Badge";
import StageSelect from "./StageSelect";

// Lead card inside a pipeline column: name, issue, hot / score badge and the "Move to" dropdown.
// Clicking the top part opens the lead detail panel. layoutId makes the card glide to its new column.
export default function LeadCard({ lead, onOpen, onStageChange }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li layoutId={shouldReduceMotion ? undefined : lead.id} className="lead-card flex flex-col gap-3 p-4">
      {/* Open button: name, area, issue and badges. The id lets focus come back here after the panel closes. */}
      <button
        id={`lead-card-open-${lead.id}`}
        type="button"
        onClick={() => onOpen(lead.id)}
        aria-haspopup="dialog"
        className="lead-card-open flex flex-col gap-2 text-left"
      >
        <span className="flex flex-col">
          <span className="lead-name">{lead.name}</span>
          <span className="text-small text-muted">
            {lead.area} · {lead.receivedAt}
          </span>
        </span>
        <span>{lead.issue}</span>

        {/* Badges: form leads are always hot (no score); chat leads show the AI score */}
        <span className="flex flex-wrap gap-2">
          {lead.source === "form" ? (
            <Badge variant="urgent">Hot · Form</Badge>
          ) : (
            <Badge variant={lead.isHot ? "urgent" : "score"}>
              Score {lead.leadScore}
              {lead.isHot && " · Hot"}
            </Badge>
          )}
          <Badge variant={lead.appliance === "AC" ? "sky" : "lilac"}>{lead.appliance}</Badge>
        </span>
      </button>

      <StageSelect id={`lead-card-stage-${lead.id}`} value={lead.stage} onStageChange={(newStage) => onStageChange(lead.id, newStage)} />
    </motion.li>
  );
}
