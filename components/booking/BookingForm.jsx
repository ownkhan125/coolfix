"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { validateBooking } from "@/lib/validate-booking";
import ApplianceToggle from "./ApplianceToggle";
import BookingSuccess from "./BookingSuccess";
import PhotoUpload from "./PhotoUpload";
import TimeSlotPicker from "./TimeSlotPicker";

// Empty form values (the modal unmounts this form on close, so every open starts fresh)
const EMPTY_BOOKING = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  appliance: "",
  problem: "",
  date: "",
  timeSlot: "",
};

// Booking form: contact details, appliance, problem, photos and preferred time.
// Validates on submit, shows a loading state, then the success screen.
export default function BookingForm({ onClose }) {
  const [bookingValues, setBookingValues] = useState(EMPTY_BOOKING);
  const [photos, setPhotos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Earliest day that can be picked: today, as YYYY-MM-DD (only runs while the modal is open, never on the server)
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

  async function handleBookingSubmit(event) {
    event.preventDefault();
    const newErrors = validateBooking(bookingValues);
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    // TODO: send the booking to the API (bookingValues + photos), e.g. POST /api/bookings.
    // For now we only wait a moment so the loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsBooked(true);
  }

  if (isBooked) {
    return <BookingSuccess date={bookingValues.date} timeSlot={bookingValues.timeSlot} onClose={onClose} />;
  }

  return (
    <form onSubmit={handleBookingSubmit} noValidate className="flex flex-col gap-5">
      {/* Contact details: two columns from tablet up */}
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Full name" htmlFor="booking-full-name" error={fieldErrors.fullName}>
          <input id="booking-full-name" name="fullName" type="text" autoComplete="name" value={bookingValues.fullName} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("fullName", "booking-full-name")} />
        </FormField>
        <FormField label="Email" htmlFor="booking-email" error={fieldErrors.email}>
          <input id="booking-email" name="email" type="email" autoComplete="email" value={bookingValues.email} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("email", "booking-email")} />
        </FormField>
        <FormField label="Phone number" htmlFor="booking-phone" error={fieldErrors.phone}>
          <input id="booking-phone" name="phone" type="tel" autoComplete="tel" value={bookingValues.phone} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("phone", "booking-phone")} />
        </FormField>
        <FormField label="Area or address" htmlFor="booking-address" error={fieldErrors.address}>
          <input id="booking-address" name="address" type="text" autoComplete="street-address" value={bookingValues.address} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("address", "booking-address")} />
        </FormField>
      </div>

      {/* Problem: appliance, description and photos */}
      <ApplianceToggle value={bookingValues.appliance} onChange={handleFieldChange} error={fieldErrors.appliance} />
      <FormField label="Describe the problem" htmlFor="booking-problem" error={fieldErrors.problem}>
        <textarea id="booking-problem" name="problem" rows={3} placeholder="For example: the AC blows warm air since this morning." value={bookingValues.problem} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("problem", "booking-problem")} />
      </FormField>
      <PhotoUpload photos={photos} onPhotosChange={setPhotos} />

      {/* Preferred time: day and time slot */}
      <FormField label="Preferred day" htmlFor="booking-date" error={fieldErrors.date}>
        <input id="booking-date" name="date" type="date" min={today} value={bookingValues.date} onChange={handleFieldChange} className="clay-input w-full px-4 py-3" {...errorProps("date", "booking-date")} />
      </FormField>
      <TimeSlotPicker value={bookingValues.timeSlot} onChange={handleFieldChange} error={fieldErrors.timeSlot} />

      {/* Submit: shows a loading label while sending */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Booking your visit…" : "Book my visit"}
      </Button>
    </form>
  );
}
