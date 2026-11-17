// "Move to" dropdown: picks the pipeline stage of a lead.
// Used on every lead card (LeadCard.jsx) and in the lead detail panel (LeadDetailPanel.jsx).
// onStageChange(newStage) gets the chosen stage, for example "Contacted".
export default function StageSelect({ id, value, onStageChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-small text-muted">
        Move to
      </label>
      <select id={id} value={value} onChange={(event) => onStageChange(event.target.value)} className="clay-input w-full px-3 py-2">
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Booked">Booked</option>
        <option value="Completed">Completed</option>
        <option value="Lost">Lost</option>
      </select>
    </div>
  );
}
