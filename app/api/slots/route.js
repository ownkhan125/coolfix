import { NextResponse } from "next/server";
import { loadFreeSlots } from "@/lib/slots";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

// GET /api/slots?date=2026-11-25 — the free time slots for one day.
// Used by the time slot picker in the booking form and in the chat booking card.
// Answer: { slots: [{ start: "08:00", label: "8:00 AM – 10:00 AM" }, …] } or { error: "…" }.
export async function GET(request) {
  const date = new URL(request.url).searchParams.get("date");

  if (!isRealDate(date)) {
    return NextResponse.json({ error: "Please pick a valid day." }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const slots = await loadFreeSlots(supabaseAdmin, date);

  if (slots === null) {
    return NextResponse.json({ error: "We couldn't load the times. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ slots });
}

// True when date looks like YYYY-MM-DD and is a real day on the calendar ("2026-02-31" and "2026-13-01" are not)
function isRealDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) return false;
  const parsedDate = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(date);
}
