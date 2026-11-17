"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import { validateChatBooking } from "@/lib/validate-booking";

// Empty card values (appliance and problem are not asked here: the customer already told them in the chat)
const EMPTY_CHAT_BOOKING = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  date: "",
  timeSlot: "",
};

// Chat booking card: a small booking form inside the chat conversation (contact details, day, time slot).
// Validates on submit, shows a loading state, then calls onBooked(date, timeSlot).
export default function ChatBookingCard({ onBooked }) {
  const [bookingValues, setBookingValues] = useState(EMPTY_CHAT_BOOKING);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Earliest day that can be picked: today, as YYYY-MM-DD (the card only renders in the browser)
  const today = new Date().toLocaleDateString("en-CA");

  // One handler for every field: the input's name says which value to update; its error clears while typing
  function handleFieldChange(event) {
    const { name, value } = event.target;
    setBookingValues({ ...bookingValues, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: undefined });
  }

  // Attributes that link an input to its error message, for screen readers
  function errorProps(fieldName, inputId) {
    const hasError = Boolean(fieldErrors[fieldName]);
    return { "aria-invalid": hasError, "aria-describedby": hasError ? `${inputId}-error` : undefined };
  }

  async function handleChatBookingSubmit(event) {
    event.preventDefault();
    const newErrors = validateChatBooking(bookingValues);
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    // TODO: send the booking to the API with the chat conversation, e.g. POST /api/bookings (PLAN.md, Step 9 and Step 13).
    // For now we only wait a moment so the loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    onBooked(bookingValues.date, bookingValues.timeSlot);
  }

  return (
    <form onSubmit={handleChatBookingSubmit} noValidate className="chat-bubble-assistant flex flex-col gap-4 p-4" aria-labelledby="chat-booking-title">
      <h3 id="chat-booking-title" className="chat-panel-title">
        Book a visit
      </h3>

      {/* Contact details */}
      <FormField label="Full name" htmlFor="chat-booking-full-name" error={fieldErrors.fullName}>
        <input id="chat-booking-full-name" name="fullName" type="text" autoComplete="name" value={bookingValues.fullName} onChange={handleFieldChange} className="clay-input w-full px-3 py-2" {...errorProps("fullName", "chat-booking-full-name")} />
      </FormField>
      <FormField label="Phone number" htmlFor="chat-booking-phone" error={fieldErrors.phone}>
        <input id="chat-booking-phone" name="phone" type="tel" autoComplete="tel" value={bookingValues.phone} onChange={handleFieldChange} className="clay-input w-full px-3 py-2" {...errorProps("phone", "chat-booking-phone")} />
      </FormField>
      <FormField label="Email" htmlFor="chat-booking-email" error={fieldErrors.email}>
        <input id="chat-booking-email" name="email" type="email" autoComplete="email" value={bookingValues.email} onChange={handleFieldChange} className="clay-input w-full px-3 py-2" {...errorProps("email", "chat-booking-email")} />
      </FormField>
      <FormField label="Area or address" htmlFor="chat-booking-address" error={fieldErrors.address}>
        <input id="chat-booking-address" name="address" type="text" autoComplete="street-address" value={bookingValues.address} onChange={handleFieldChange} className="clay-input w-full px-3 py-2" {...errorProps("address", "chat-booking-address")} />
      </FormField>

      {/* Preferred time: day and time slot */}
      <FormField label="Preferred day" htmlFor="chat-booking-date" error={fieldErrors.date}>
        <input id="chat-booking-date" name="date" type="date" min={today} value={bookingValues.date} onChange={handleFieldChange} className="clay-input w-full px-3 py-2" {...errorProps("date", "chat-booking-date")} />
      </FormField>
      <TimeSlotPicker value={bookingValues.timeSlot} onChange={handleFieldChange} error={fieldErrors.timeSlot} />

      {/* Submit: shows a loading label while sending */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Booking your visit…" : "Book my visit"}
      </Button>
    </form>
  );
}
