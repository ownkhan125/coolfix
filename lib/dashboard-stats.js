// Numbers for the four Overview cards on the dashboard home page.
// supabase = a client logged in as the owner. timeZone = the business clock (BUSINESS_TIME_ZONE), so "today"
// means today in the business's city. Returns null if any number fails to load (details tagged [stats]).
export async function loadOverviewStats(supabase, timeZone) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone });
  // Leads from the last 48 hours; below we keep only the ones from today on the business clock
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  // The four questions run at the same time (count + head: true asks only for the number, not the rows)
  const [recentLeads, hotLeadsWaiting, visitsToday, upcomingVisits] = await Promise.all([
    supabase.from("leads").select("created_at").gte("created_at", twoDaysAgo),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("is_hot", true).eq("stage", "New"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("booking_date", today).eq("status", "Confirmed"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("booking_date", today).eq("status", "Confirmed"),
  ]);

  const failedQuery = [recentLeads, hotLeadsWaiting, visitsToday, upcomingVisits].find((query) => query.error);
  if (failedQuery) {
    console.error("[stats] Loading the overview numbers failed:", failedQuery.error.message);
    return null;
  }

  const leadsToday = recentLeads.data.filter((lead) => new Date(lead.created_at).toLocaleDateString("en-CA", { timeZone }) === today);

  return {
    leadsToday: leadsToday.length,
    hotLeadsWaiting: hotLeadsWaiting.count,
    visitsToday: visitsToday.count,
    upcomingVisits: upcomingVisits.count,
  };
}
