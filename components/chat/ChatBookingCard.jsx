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
// Validates on submit, sends it to POST /api/bookings, then calls onBooked(dayLabel, slotLabel).
// conversationText = what the customer wrote in the chat; it is saved as the lead's issue.
export default function ChatBookingCard({ conversationText, onBooked }) {
  const [bookingValues, setBookingValues] = useState(EMPTY_CHAT_BOOKING);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // A message for the whole card, for example when the server could not save the booking
  const [formError, setFormError] = useState("");
  // Goes up by one when the chosen slot was just taken, so the time slot picker loads the free slots again
  const [slotPickerVersion, setSlotPickerVersion] = useState(0);

  // Earliest day that can be picked: today, as YYYY-MM-DD (the card only renders in the browser)
  const today = new Date().toLocaleDateString("en-CA");

  // One handler for every field: the input's name says which value to update; its error clears while typing.
  // A new day has other free slots, so changing the day also clears the chosen time slot.
  function handleFieldChange(event) {
    const { name, value } = event.target;
    const newValues = { ...bookingValues, [name]: value };
    if (name === "date") newValues.timeSlot = "";
    setBookingValues(newValues);
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
    setFormError("");

    // Same API as the booking form. Chat photos and the AI summary come in PLAN.md, Step 13.
    const formData = new FormData();
    formData.append("source", "chat");
    formData.append("problem", conversationText);
    Object.entries(bookingValues).forEach(([fieldName, value]) => formData.append(fieldName, value));

    try {
      const response = await fetch("/api/bookings", { method: "POST", body: formData });
      const body = await response.json();

      if (response.ok) {
        onBooked(body.dayLabel, body.slotLabel);
        return;
      }
      if (response.status === 409) {
        // Slot just taken: clear it, show the message under the slots and load the free slots again
        setBookingValues({ ...bookingValues, timeSlot: "" });
        setFieldErrors({ timeSlot: body.error });
        setSlotPickerVersion(slotPickerVersion + 1);
      } else {
        setFieldErrors(body.fieldErrors ?? {});
        setFormError(body.error);
      }
    } catch (sendError) {
      console.error("[bookings] Sending the chat booking failed:", sendError.message);
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    }
    setIsSubmitting(false);
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
      <TimeSlotPicker key={slotPickerVersion} date={bookingValues.date} value={bookingValues.timeSlot} onChange={handleFieldChange} error={fieldErrors.timeSlot} />

      {/* Submit: a card-wide error (if any) and the button, which shows a loading label while sending */}
      {formError && (
        <p className="field-error" role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Booking your visit…" : "Book my visit"}
      </Button>
    </form>
  );
}
