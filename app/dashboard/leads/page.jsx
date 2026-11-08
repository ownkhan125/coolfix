import LeadsView from "@/components/dashboard/LeadsView";
import { DUMMY_LEADS } from "@/lib/dummy-data";

export const metadata = { title: "Leads — CoolFix dashboard" };

// Leads page: every lead from the chat and the booking form. Click a lead to see its details.
export default function DashboardLeadsPage() {
  // TODO: load the leads from Supabase instead of the dummy data
  return (
    <>
      <div>
        <h1 className="dashboard-title">Leads</h1>
        <p className="text-muted mt-1">New requests, scored by the assistant. Click a lead for details.</p>
      </div>

      <LeadsView leads={DUMMY_LEADS} />
    </>
  );
}
