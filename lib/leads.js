// Leads for the owner dashboard: load them (with activity and photos) and move them between pipeline stages.
// Every function takes a Supabase client that is logged in as the owner (the database rules allow only the owner).
// Database rows use snake_case (full_name); the dashboard components use camelCase (name). The translation is here.

// How long a photo link stays valid (the bucket is private, so every photo gets a short-lived link)
const PHOTO_LINK_SECONDS = 60 * 60;

// All leads, newest first, in the shape the dashboard uses. Returns null if loading fails.
// timeZone: the business clock (BUSINESS_TIME_ZONE), used for "Today, 9:12 AM".
export async function loadLeads(supabase, timeZone) {
  const { data: rows, error } = await supabase
    .from("leads")
    .select("*, lead_activity(id, text, created_at)")
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "lead_activity", ascending: true });

  if (error) {
    console.error("[leads] Loading the leads failed:", error.message);
    return null;
  }

  const photoLinks = await createPhotoLinks(supabase, rows.flatMap((row) => row.photo_urls));

  return rows.map((row) => ({
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone,
    area: row.area,
    appliance: row.appliance ?? "Not set",
    issue: row.issue ?? "",
    source: row.source,
    leadScore: row.lead_score,
    isHot: row.is_hot,
    stage: row.stage,
    receivedAt: formatDashboardTime(row.created_at, timeZone),
    aiSummary: row.ai_summary,
    photoUrls: row.photo_urls.map((photoPath) => photoLinks[photoPath]).filter(Boolean),
    activity: row.lead_activity.map((activityRow) => ({
      id: activityRow.id,
      time: formatDashboardTime(activityRow.created_at, timeZone),
      text: activityRow.text,
    })),
  }));
}

// Moves a lead to a new stage and writes "Moved to …" in its activity log. Returns true when it was saved.
export async function saveLeadStage(supabase, leadId, newStage) {
  const { data, error } = await supabase.from("leads").update({ stage: newStage }).eq("id", leadId).select("id").single();

  if (error || !data) {
    console.error("[leads] Saving the stage failed:", error?.message ?? "no lead was updated");
    return false;
  }

  const { error: activityError } = await supabase.from("lead_activity").insert({ lead_id: leadId, text: `Moved to ${newStage}` });
  if (activityError) console.error("[leads] Saving the activity line failed:", activityError.message);

  return true;
}

// Short-lived links for photos in the private lead-photos bucket: { "lead-id/1-….jpg": "https://…" }
async function createPhotoLinks(supabase, photoPaths) {
  if (photoPaths.length === 0) return {};

  const { data, error } = await supabase.storage.from("lead-photos").createSignedUrls(photoPaths, PHOTO_LINK_SECONDS);
  if (error) {
    console.error("[leads] Creating the photo links failed:", error.message);
    return {};
  }

  const photoLinks = {};
  data.forEach((photoLink) => {
    if (photoLink.signedUrl) photoLinks[photoLink.path] = photoLink.signedUrl;
  });
  return photoLinks;
}

// A database time → "Today, 9:12 AM", "Yesterday, 6:05 PM" or "25 Nov, 9:12 AM" on the business clock
function formatDashboardTime(isoTime, timeZone) {
  const time = new Date(isoTime);
  const clockTime = time.toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });

  // Calendar days as "YYYY-MM-DD" on the business clock, so "today" means today in the business's city
  const dayOf = (someTime) => someTime.toLocaleDateString("en-CA", { timeZone });
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (dayOf(time) === dayOf(new Date())) return `Today, ${clockTime}`;
  if (dayOf(time) === dayOf(yesterday)) return `Yesterday, ${clockTime}`;
  return `${time.toLocaleDateString("en-GB", { timeZone, day: "numeric", month: "short" })}, ${clockTime}`;
}
