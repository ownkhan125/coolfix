import StatCard from "@/components/dashboard/StatCard";
import { loadOverviewStats } from "@/lib/dashboard-stats";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = { title: "Overview — CoolFix dashboard" };

// Dashboard overview: today's numbers in four stat cards, loaded from Supabase (lib/dashboard-stats.js)
export default async function DashboardOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const stats = await loadOverviewStats(supabase, process.env.BUSINESS_TIME_ZONE);

  return (
    <>
      {/* Heading */}
      <div>
        <h1 className="dashboard-title">Overview</h1>
        <p className="text-muted mt-1">Today at a glance.</p>
      </div>

      {/* Stat cards: 1 column on mobile, 2 on tablet, 4 on desktop (or a message when the numbers could not be loaded) */}
      {stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Leads today" value={String(stats.leadsToday)} trend="From the booking form and the chat" revealOrder={0}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </StatCard>
          <StatCard label="Hot leads waiting" value={String(stats.hotLeadsWaiting)} trend="Hot and still in New" revealOrder={1}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1 1.5 2 1.5 3 1-1.5 1.5-4 1.5-8z" />
            </svg>
          </StatCard>
          <StatCard label="Visits today" value={String(stats.visitsToday)} trend="Confirmed bookings for today" revealOrder={2}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16v14H4zM4 10h16M9 15l2 2 4-4" />
            </svg>
          </StatCard>
          <StatCard label="Upcoming visits" value={String(stats.upcomingVisits)} trend="Confirmed, from today on" revealOrder={3}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7v5l3 2" />
            </svg>
          </StatCard>
        </div>
      ) : (
        <p className="field-error" role="alert">
          We couldn&apos;t load today&apos;s numbers. Please refresh the page.
        </p>
      )}
    </>
  );
}
