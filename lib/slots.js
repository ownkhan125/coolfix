import { loadBusinessSettings } from "./business-settings";

// Free time slots for one day (PLAN.md, section 6).
// Slots are built from the Settings (working hours, slot length, open days).
// A slot is NOT returned when: the day is closed or in the past, the slot already started today,
// or it already has as many bookings as "Bookings per slot".
// The business clock comes from BUSINESS_TIME_ZONE in .env.local (for example Asia/Karachi).

// Loads settings and bookings, then returns the free slots: [{ start: "08:00", label: "8:00 AM – 10:00 AM" }].
// date: "YYYY-MM-DD". Returns null if loading fails (details in the server log, tagged [slots] or [settings]).
export async function loadFreeSlots(supabaseAdmin, date) {
  const timeZone = process.env.BUSINESS_TIME_ZONE;
  if (!timeZone) {
    throw new Error("[slots] Missing BUSINESS_TIME_ZONE in .env.local (for example Asia/Karachi)");
  }

  const settings = await loadBusinessSettings(supabaseAdmin);
  if (!settings) return null;

  // Only confirmed bookings take a place (a cancelled booking frees its place again)
  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select("slot_start")
    .eq("booking_date", date)
    .eq("status", "Confirmed");

  if (error) {
    console.error("[slots] Loading the bookings failed:", error.message);
    return null;
  }

  // Count the bookings per slot start time, for example { "08:00": 3, "10:00": 1 }.
  // The database returns times as "08:00:00", so only the first 5 characters are kept.
  const bookingCounts = {};
  bookings.forEach((booking) => {
    const slotStart = booking.slot_start.slice(0, 5);
    bookingCounts[slotStart] = (bookingCounts[slotStart] ?? 0) + 1;
  });

  return buildFreeSlots({ settings, date, bookingCounts, businessNow: getBusinessNow(timeZone) });
}

// The slot calculation itself, with no database: settings + day + booking counts + current time → free slots
export function buildFreeSlots({ settings, date, bookingCounts, businessNow }) {
  // A day in the past has no slots
  if (date < businessNow.date) return [];

  // Closed on this weekday? (noon UTC keeps the weekday correct in every time zone)
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (weekday === 6 && !settings.isOpenSaturday) return [];
  if (weekday === 0 && !settings.isOpenSunday) return [];

  const slotMinutes = settings.slotHours * 60;
  const closingMinutes = toMinutes(settings.closesAt);
  const freeSlots = [];

  // One slot after another from opening time; a slot that would end after closing time is not created
  for (let startMinutes = toMinutes(settings.opensAt); startMinutes + slotMinutes <= closingMinutes; startMinutes += slotMinutes) {
    const slotStart = toTime(startMinutes);
    const hasStarted = date === businessNow.date && startMinutes <= businessNow.minutes;
    const isFull = (bookingCounts[slotStart] ?? 0) >= settings.bookingsPerSlot;

    if (!hasStarted && !isFull) {
      freeSlots.push({ start: slotStart, label: `${toLabel(startMinutes)} – ${toLabel(startMinutes + slotMinutes)}` });
    }
  }

  return freeSlots;
}

// Today's date and the minutes after midnight on the business clock, for example { date: "2026-11-20", minutes: 870 }
function getBusinessNow(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  // Turn the parts list into { year: "2026", month: "11", day: "20", hour: "14", minute: "30", … }
  const values = {};
  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

// "08:30" → 510 (minutes after midnight)
function toMinutes(time) {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

// 510 → "08:30" (the format saved in bookings.slot_start)
function toTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// 510 → "8:30 AM" (the format customers see)
function toLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
}
