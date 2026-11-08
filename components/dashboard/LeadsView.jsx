"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Badge from "@/components/ui/Badge";
import LeadDetailPanel from "./LeadDetailPanel";

// Leads with this score or higher count as hot (pink chip)
const HOT_LEAD_SCORE = 85;

// Badge color per lead status
const STATUS_BADGE_VARIANTS = { New: "sky", Contacted: "lilac", Booked: "mint" };

// Leads view: list of leads (name, issue, lead score, status). Clicking a lead opens its detail panel.
// leads come from the page (dummy data for now, Supabase later).
export default function LeadsView({ leads }) {
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null;
  // The row that opened the panel, so focus can go back to it after closing
  const openerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  function handleLeadOpen(event, leadId) {
    openerRef.current = event.currentTarget;
    setSelectedLeadId(leadId);
  }

  function handlePanelClose() {
    setSelectedLeadId(null);
    openerRef.current?.focus();
  }

  return (
    <>
      {/* Column labels: tablet and up only (on mobile each row is a stacked card) */}
      <div className="text-small text-muted hidden gap-3 px-5 md:grid md:grid-cols-4" aria-hidden="true">
        <span>Customer</span>
        <span>Issue</span>
        <span>Lead score</span>
        <span>Status</span>
      </div>

      {/* Lead rows: each row is a button that opens the detail panel */}
      <ul className="flex flex-col gap-3">
        {leads.map((lead) => (
          <li key={lead.id}>
            <motion.button
              type="button"
              onClick={(event) => handleLeadOpen(event, lead.id)}
              aria-haspopup="dialog"
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              className="lead-row grid w-full items-center gap-3 px-5 py-4 text-left md:grid-cols-4"
            >
              <span className="flex flex-col">
                <span className="lead-name">{lead.name}</span>
                <span className="text-small text-muted">
                  {lead.area} · {lead.receivedAt}
                </span>
              </span>
              <span className="flex flex-col">
                <span>{lead.issue}</span>
                <span className="text-small text-muted">{lead.appliance}</span>
              </span>
              <span>
                <Badge variant={lead.leadScore >= HOT_LEAD_SCORE ? "urgent" : "score"}>
                  Score {lead.leadScore}
                  {lead.leadScore >= HOT_LEAD_SCORE && " · Hot"}
                </Badge>
              </span>
              <span>
                <Badge variant={STATUS_BADGE_VARIANTS[lead.status]}>{lead.status}</Badge>
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      <LeadDetailPanel
        lead={selectedLead}
        onClose={handlePanelClose}
        scoreVariant={selectedLead && selectedLead.leadScore >= HOT_LEAD_SCORE ? "urgent" : "score"}
        statusVariant={selectedLead ? STATUS_BADGE_VARIANTS[selectedLead.status] : "mint"}
      />
    </>
  );
}
