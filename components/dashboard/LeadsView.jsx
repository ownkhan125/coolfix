"use client";

import { useState } from "react";
import LeadDetailPanel from "./LeadDetailPanel";
import PipelineColumn from "./PipelineColumn";

// Leads view: the pipeline board (New, Contacted, Booked, Completed, Lost).
// The owner moves a lead with the "Move to" dropdown on its card or in the detail panel.
// leads come from the page (dummy data for now). Stage changes live only in this state until Supabase is connected (PLAN.md, Step 10).
export default function LeadsView({ leads }) {
  const [pipelineLeads, setPipelineLeads] = useState(leads);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const selectedLead = pipelineLeads.find((lead) => lead.id === selectedLeadId) ?? null;

  // Only the leads in one stage, for one column
  function leadsInStage(stage) {
    return pipelineLeads.filter((lead) => lead.stage === stage);
  }

  // Move a lead to a new stage and add a line to its activity log
  function handleStageChange(leadId, newStage) {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const activityItem = { id: crypto.randomUUID(), time: currentTime, text: `Moved to ${newStage}` };

    setPipelineLeads(
      pipelineLeads.map((lead) => (lead.id === leadId ? { ...lead, stage: newStage, activity: [...lead.activity, activityItem] } : lead))
    );
  }

  // Same as above, from a card's dropdown. The card moves to another column, so after React has
  // re-drawn the board we put focus back on that card's dropdown (keyboard users keep their place).
  function handleCardStageChange(leadId, newStage) {
    handleStageChange(leadId, newStage);
    setTimeout(() => document.getElementById(`lead-card-stage-${leadId}`)?.focus(), 0);
  }

  // Close the panel and put focus back on the card that opened it
  function handlePanelClose() {
    const closedLeadId = selectedLeadId;
    setSelectedLeadId(null);
    setTimeout(() => document.getElementById(`lead-card-open-${closedLeadId}`)?.focus(), 0);
  }

  return (
    <>
      {/* Pipeline board: stacked on mobile, 2 columns on tablet, one scrollable row on desktop */}
      <div className="grid gap-4 md:grid-cols-2 lg:flex lg:items-start lg:overflow-x-auto lg:pb-2">
        <PipelineColumn title="New" leads={leadsInStage("New")} onLeadOpen={setSelectedLeadId} onStageChange={handleCardStageChange} />
        <PipelineColumn title="Contacted" leads={leadsInStage("Contacted")} onLeadOpen={setSelectedLeadId} onStageChange={handleCardStageChange} />
        <PipelineColumn title="Booked" leads={leadsInStage("Booked")} onLeadOpen={setSelectedLeadId} onStageChange={handleCardStageChange} />
        <PipelineColumn title="Completed" leads={leadsInStage("Completed")} onLeadOpen={setSelectedLeadId} onStageChange={handleCardStageChange} />
        <PipelineColumn title="Lost" leads={leadsInStage("Lost")} onLeadOpen={setSelectedLeadId} onStageChange={handleCardStageChange} />
      </div>

      <LeadDetailPanel lead={selectedLead} onClose={handlePanelClose} onStageChange={handleStageChange} />
    </>
  );
}
