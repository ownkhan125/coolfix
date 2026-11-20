import { NextResponse } from "next/server";
import { saveBooking } from "@/lib/bookings";
import { checkPhoto } from "@/lib/photo-rules";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { validateBooking, validateChatBooking } from "@/lib/validate-booking";

// Most photos one booking may have (same as components/booking/PhotoUpload.jsx)
const MAX_PHOTOS = 3;

// POST /api/bookings — saves a booking from the booking form (source "form") or the chat (source "chat").
// The browser sends FormData: the text fields + up to 3 "photos" files (form only).
// Answers:
//   201 { dayLabel, slotLabel }        booked
//   400 { error, fieldErrors }         something in the form is not right
//   409 { error }                      the slot was just taken
//   500 { error }                      something broke (details in the server log, tagged [bookings])
export async function POST(request) {
  const formData = await request.formData();

  // Read every text field as a string ("" when missing), so the checks below never crash
  const booking = {
    source: readText(formData, "source"),
    fullName: readText(formData, "fullName").trim(),
    email: readText(formData, "email").trim(),
    phone: readText(formData, "phone").trim(),
    address: readText(formData, "address").trim(),
    appliance: readText(formData, "appliance"),
    problem: readText(formData, "problem").trim(),
    date: readText(formData, "date"),
    timeSlot: readText(formData, "timeSlot"),
    photos: formData.getAll("photos").filter((entry) => entry instanceof File),
  };

  // Never trust the browser: the same checks run again here
  if (booking.source !== "form" && booking.source !== "chat") {
    return NextResponse.json({ error: "Unknown booking source." }, { status: 400 });
  }

  const fieldErrors = booking.source === "form" ? validateBooking(booking) : validateChatBooking(booking);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date)) fieldErrors.date = "Please pick a day.";
  if (booking.appliance && booking.appliance !== "AC" && booking.appliance !== "Fridge") fieldErrors.appliance = "Please choose AC or Fridge.";

  if (booking.photos.length > MAX_PHOTOS) {
    fieldErrors.photos = "You can add up to 3 photos.";
  }
  booking.photos.forEach((photo) => {
    const photoError = checkPhoto(photo);
    if (photoError) fieldErrors.photos = photoError;
  });

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Please check the form.", fieldErrors }, { status: 400 });
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const saveResult = await saveBooking(supabaseAdmin, booking);

  if (saveResult.result === "slot-taken") {
    return NextResponse.json({ error: "This slot was just taken. Please pick another time." }, { status: 409 });
  }
  if (saveResult.result === "failed") {
    return NextResponse.json({ error: "We couldn't save your booking. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ dayLabel: saveResult.dayLabel, slotLabel: saveResult.slotLabel }, { status: 201 });
}

// One text field from the FormData, or "" when it is missing or not text
function readText(formData, fieldName) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
}
