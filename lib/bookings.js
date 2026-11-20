import { loadFreeSlots } from "./slots";

// Saves a new booking from the booking form or the chat (PLAN.md, section 7), in this order:
// 1. Is the slot still free?  2. Save the lead  3. Save the booking  4. Upload the photos  5. Write the activity log.
// booking = { source, fullName, email, phone, address, appliance, problem, date, timeSlot, photos: [File] }
// Returns { result: "booked", dayLabel, slotLabel } or { result: "slot-taken" } or { result: "failed" }.
export async function saveBooking(supabaseAdmin, booking) {
  // 1. Same calculation the customer saw, run again on the server
  const freeSlots = await loadFreeSlots(supabaseAdmin, booking.date);
  if (freeSlots === null) return { result: "failed" };

  const chosenSlot = freeSlots.find((slot) => slot.start === booking.timeSlot);
  if (!chosenSlot) return { result: "slot-taken" };

  // 2. The lead (stage "Booked", because it comes with a booking)
  const leadId = await insertLead(supabaseAdmin, booking);
  if (!leadId) return { result: "failed" };

  // 3. The booking. The database guard (supabase/schema.sql, part 8) refuses it when the slot just filled up.
  const bookingResult = await insertBooking(supabaseAdmin, leadId, booking);
  if (bookingResult !== "saved") {
    // No booking → remove the lead again, so no half-saved lead is left behind
    await supabaseAdmin.from("leads").delete().eq("id", leadId);
    return { result: bookingResult };
  }

  // 4. Photos (a failed photo never cancels the booking; it is noted in the activity log)
  const { savedCount, failedCount } = await uploadLeadPhotos(supabaseAdmin, leadId, booking.photos);

  // 5. Activity log for the dashboard timeline
  const dayLabel = formatBookingDay(booking.date);
  const sourceText = booking.source === "form" ? "the booking form" : "the chat";
  const photoText = savedCount > 0 ? ` with ${savedCount} photo${savedCount > 1 ? "s" : ""}` : "";
  const activityLines = [`Lead came in through ${sourceText}${photoText}`, `Booked for ${dayLabel}, ${chosenSlot.label}`];
  if (failedCount > 0) activityLines.push(`${failedCount} photo${failedCount > 1 ? "s" : ""} could not be saved`);
  await addLeadActivity(supabaseAdmin, leadId, activityLines);

  return { result: "booked", dayLabel, slotLabel: chosenSlot.label };
}

// Saves the lead. Returns its id, or null when it fails.
async function insertLead(supabaseAdmin, booking) {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      full_name: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      area: booking.address,
      appliance: booking.appliance || null,
      issue: booking.problem || null,
      source: booking.source,
      is_hot: booking.source === "form", // form leads are always hot; chat leads get a score from the AI later
      stage: "Booked",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[bookings] Saving the lead failed:", error.message);
    return null;
  }
  return data.id;
}

// Saves the booking. Returns "saved", "slot-taken" (the database guard said SLOT_FULL) or "failed".
async function insertBooking(supabaseAdmin, leadId, booking) {
  const { error } = await supabaseAdmin.from("bookings").insert({
    lead_id: leadId,
    booking_date: booking.date,
    slot_start: booking.timeSlot,
  });

  if (!error) return "saved";
  if (error.message.includes("SLOT_FULL")) return "slot-taken";

  console.error("[bookings] Saving the booking failed:", error.message);
  return "failed";
}

// Uploads the photos to the private lead-photos bucket (folder = lead id) and saves their paths on the lead
async function uploadLeadPhotos(supabaseAdmin, leadId, photos) {
  const savedPaths = [];

  for (const photo of photos) {
    // For example "3f2a…/1-9b7c….jpg" (the random part keeps two photos with the same name apart)
    const extension = photo.type.split("/")[1].replace("jpeg", "jpg");
    const photoPath = `${leadId}/${savedPaths.length + 1}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabaseAdmin.storage.from("lead-photos").upload(photoPath, photo, { contentType: photo.type });

    if (error) {
      console.error("[bookings] Uploading a photo failed:", error.message);
    } else {
      savedPaths.push(photoPath);
    }
  }

  if (savedPaths.length > 0) {
    const { error } = await supabaseAdmin.from("leads").update({ photo_urls: savedPaths }).eq("id", leadId);
    if (error) console.error("[bookings] Saving the photo paths failed:", error.message);
  }

  return { savedCount: savedPaths.length, failedCount: photos.length - savedPaths.length };
}

// Adds lines to the lead's activity log (one row per line, in order)
async function addLeadActivity(supabaseAdmin, leadId, lines) {
  const rows = lines.map((line) => ({ lead_id: leadId, text: line }));
  const { error } = await supabaseAdmin.from("lead_activity").insert(rows);
  if (error) console.error("[bookings] Saving the activity log failed:", error.message);
}

// "2026-11-25" → "Wed, 25 Nov 2026" (noon UTC keeps the day the same in every time zone)
function formatBookingDay(date) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
