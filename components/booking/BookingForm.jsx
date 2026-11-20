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
// Validates on submit, sends everything to POST /api/bookings (app/api/bookings/route.js), then shows the success screen.
export default function BookingForm({ onClose }) {
  const [bookingValues, setBookingValues] = useState(EMPTY_BOOKING);
  const [photos, setPhotos] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // After a successful booking: { dayLabel: "Wed, 25 Nov 2026", slotLabel: "8:00 AM – 10:00 AM" }
  const [bookedSlot, setBookedSlot] = useState(null);
  // A message for the whole form, for example when the server could not save the booking
  const [formError, setFormError] = useState("");
  // Goes up by one when the chosen slot was just taken, so the time slot picker loads the free slots again
  const [slotPickerVersion, setSlotPickerVersion] = useState(0);

  // Earliest day that can be picked: today, as YYYY-MM-DD (only runs while the modal is open, never on the server)
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

  async function handleBookingSubmit(event) {
    event.preventDefault();
    const newErrors = validateBooking(bookingValues);
    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setFormError("");

    // FormData can carry the text fields and the photo files in one request
    const formData = new FormData();
    formData.append("source", "form");
    Object.entries(bookingValues).forEach(([fieldName, value]) => formData.append(fieldName, value));
    photos.forEach((photo) => formData.append("photos", photo.file));

    try {
      const response = await fetch("/api/bookings", { method: "POST", body: formData });
      const body = await response.json();

      if (response.ok) {
        setBookedSlot({ dayLabel: body.dayLabel, slotLabel: body.slotLabel });
      } else if (response.status === 409) {
        // Slot just taken: clear it, show the message under the slots and load the free slots again
        setBookingValues({ ...bookingValues, timeSlot: "" });
        setFieldErrors({ timeSlot: body.error });
        setSlotPickerVersion(slotPickerVersion + 1);
      } else {
        setFieldErrors(body.fieldErrors ?? {});
        setFormError(body.error);
      }
    } catch (sendError) {
      console.error("[bookings] Sending the booking failed:", sendError.message);
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  }

  if (bookedSlot) {
    return <BookingSuccess dayLabel={bookedSlot.dayLabel} slotLabel={bookedSlot.slotLabel} onClose={onClose} />;
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
      <TimeSlotPicker key={slotPickerVersion} date={bookingValues.date} value={bookingValues.timeSlot} onChange={handleFieldChange} error={fieldErrors.timeSlot} />

      {/* Submit: a form-wide error (if any) and the button, which shows a loading label while sending */}
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
