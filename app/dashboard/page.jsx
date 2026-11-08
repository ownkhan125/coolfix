import StatCard from "@/components/dashboard/StatCard";
import { DUMMY_STATS } from "@/lib/dummy-data";

export const metadata = { title: "Overview — CoolFix dashboard" };

// Dashboard overview: today's numbers in four stat cards
export default function DashboardOverviewPage() {
  return (
    <>
      {/* Heading */}
      <div>
        <h1 className="dashboard-title">Overview</h1>
        <p className="text-muted mt-1">Today at a glance.</p>
      </div>

      {/* Stat cards: 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Leads today" value={DUMMY_STATS.leadsToday.value} trend={DUMMY_STATS.leadsToday.trend} revealOrder={0}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </StatCard>
        <StatCard label="Hot leads" value={DUMMY_STATS.hotLeads.value} trend={DUMMY_STATS.hotLeads.trend} revealOrder={1}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1 1.5 2 1.5 3 1-1.5 1.5-4 1.5-8z" />
          </svg>
        </StatCard>
        <StatCard label="Booked by assistant" value={DUMMY_STATS.bookedByAssistant.value} trend={DUMMY_STATS.bookedByAssistant.trend} revealOrder={2}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v14H4zM4 10h16M9 15l2 2 4-4" />
          </svg>
        </StatCard>
        <StatCard label="Average reply time" value={DUMMY_STATS.averageReplyTime.value} trend={DUMMY_STATS.averageReplyTime.trend} revealOrder={3}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7v5l3 2" />
          </svg>
        </StatCard>
      </div>
    </>
  );
}
