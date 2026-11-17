import LeadCard from "./LeadCard";

// One pipeline column (for example "New"): title, number of leads and a card per lead.
// leads = only the leads in this stage. onLeadOpen and onStageChange come from LeadsView.
export default function PipelineColumn({ title, leads, onLeadOpen, onStageChange }) {
  return (
    <section className="pipeline-column flex flex-col gap-3 p-3 lg:w-64 lg:shrink-0" aria-label={`${title} leads`}>
      {/* Header: stage name and lead count */}
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="dashboard-card-title">{title}</h2>
        <span className="pipeline-count px-2.5 py-0.5">{leads.length}</span>
      </div>

      {leads.length === 0 ? (
        <p className="text-small text-muted px-1 py-4">No leads here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onOpen={onLeadOpen} onStageChange={onStageChange} />
          ))}
        </ul>
      )}
    </section>
  );
}
