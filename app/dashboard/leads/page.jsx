import LeadsView from "@/components/dashboard/LeadsView";
import { loadLeads } from "@/lib/leads";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = { title: "Leads — CoolFix dashboard" };

// Leads page: every lead from the chat and the booking form, loaded from Supabase, on the pipeline board
export default async function DashboardLeadsPage() {
  const supabase = await createSupabaseServerClient();
  const leads = await loadLeads(supabase, process.env.BUSINESS_TIME_ZONE);

  return (
    <>
      <div>
        <h1 className="dashboard-title">Leads</h1>
        <p className="text-muted mt-1">New requests, scored by the assistant. Click a lead for details.</p>
      </div>

      {/* The pipeline board, or a message when the leads could not be loaded (details in the server log, tagged [leads]) */}
      {leads ? (
        <LeadsView leads={leads} />
      ) : (
        <p className="field-error" role="alert">
          We couldn&apos;t load your leads. Please refresh the page.
        </p>
      )}
    </>
  );
}
