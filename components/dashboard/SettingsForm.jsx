"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

// Settings form: business name, offered services, working hours and booking slots. "Save changes" is a dummy save for now.
// business = the saved settings (dummy data for now, Supabase later).
export default function SettingsForm({ business }) {
  const [businessName, setBusinessName] = useState(business.name);
  const [services, setServices] = useState(business.services);
  const [opensAt, setOpensAt] = useState(business.opensAt);
  const [closesAt, setClosesAt] = useState(business.closesAt);
  const [isOpenSaturday, setIsOpenSaturday] = useState(business.isOpenSaturday);
  const [isOpenSunday, setIsOpenSunday] = useState(business.isOpenSunday);
  // Number inputs give text, so these are kept as text and turned into numbers on submit
  const [slotHours, setSlotHours] = useState(String(business.slotHours));
  const [bookingsPerSlot, setBookingsPerSlot] = useState(String(business.bookingsPerSlot));
  const [formErrors, setFormErrors] = useState({});
  // "idle" = nothing to report, "saving" = waiting, "saved" = show the "Changes saved" chip
  const [saveStatus, setSaveStatus] = useState("idle");

  function handleServiceToggle(serviceId) {
    setServices(services.map((service) => (service.id === serviceId ? { ...service, isOffered: !service.isOffered } : service)));
  }

  async function handleSettingsSubmit(event) {
    event.preventDefault();
    const newErrors = {};
    if (businessName.trim().length < 2) newErrors.businessName = "Please enter your business name.";
    if (!services.some((service) => service.isOffered)) newErrors.services = "Please choose at least one service.";
    // "HH:MM" strings compare correctly as text
    if (closesAt <= opensAt) newErrors.hours = "Closing time must be after opening time.";

    // Slot length: whole hours from 1 to 8, and at least one slot must fit in the working day
    const slotHoursNumber = Number(slotHours);
    const workingMinutes = toMinutes(closesAt) - toMinutes(opensAt);
    if (!Number.isInteger(slotHoursNumber) || slotHoursNumber < 1 || slotHoursNumber > 8) {
      newErrors.slotHours = "Please enter a whole number of hours, from 1 to 8.";
    } else if (slotHoursNumber * 60 > workingMinutes) {
      newErrors.slotHours = "A slot must fit inside your working hours.";
    }

    // Bookings per slot: whole number from 1 to 20
    const bookingsPerSlotNumber = Number(bookingsPerSlot);
    if (!Number.isInteger(bookingsPerSlotNumber) || bookingsPerSlotNumber < 1 || bookingsPerSlotNumber > 20) {
      newErrors.bookingsPerSlot = "Please enter a whole number from 1 to 20.";
    }

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaveStatus("saving");
    // TODO: save the settings to Supabase (business name, services, working hours, slot hours, bookings per slot).
    // For now we only wait a moment so the loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaveStatus("saved");
  }

  return (
    // Any change hides the old "Changes saved" chip
    <form onSubmit={handleSettingsSubmit} onChange={() => setSaveStatus("idle")} noValidate className="flex flex-col gap-6">
      {/* Business */}
      <section className="glass-card flex flex-col gap-4 p-5 md:p-6" aria-labelledby="settings-business-title">
        <h2 id="settings-business-title" className="dashboard-card-title">
          Business
        </h2>
        <FormField label="Business name" htmlFor="settings-business-name" error={formErrors.businessName}>
          <input
            id="settings-business-name"
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            aria-invalid={Boolean(formErrors.businessName)}
            aria-describedby={formErrors.businessName ? "settings-business-name-error" : undefined}
            className="clay-input w-full px-4 py-3"
          />
        </FormField>
      </section>

      {/* Services: clay chips on real checkboxes */}
      <fieldset className="glass-card flex flex-col gap-4 p-5 md:p-6" aria-describedby={formErrors.services ? "settings-services-error" : undefined}>
        <legend className="sr-only">Services</legend>
        <p className="dashboard-card-title" aria-hidden="true">
          Services
        </p>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <label key={service.id} className={`clay-chip ${service.isOffered ? "clay-chip-selected" : ""} px-4 py-2`}>
              <input type="checkbox" checked={service.isOffered} onChange={() => handleServiceToggle(service.id)} className="sr-only" />
              {service.name}
            </label>
          ))}
        </div>
        {formErrors.services && (
          <p id="settings-services-error" className="field-error">
            {formErrors.services}
          </p>
        )}
      </fieldset>

      {/* Working hours: opening and closing time, weekend days */}
      <section className="glass-card flex flex-col gap-4 p-5 md:p-6" aria-labelledby="settings-hours-title">
        <h2 id="settings-hours-title" className="dashboard-card-title">
          Working hours
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Opens at" htmlFor="settings-opens-at">
            <input id="settings-opens-at" type="time" value={opensAt} onChange={(event) => setOpensAt(event.target.value)} className="clay-input w-full px-4 py-3" />
          </FormField>
          <FormField label="Closes at" htmlFor="settings-closes-at" error={formErrors.hours}>
            <input
              id="settings-closes-at"
              type="time"
              value={closesAt}
              onChange={(event) => setClosesAt(event.target.value)}
              aria-invalid={Boolean(formErrors.hours)}
              aria-describedby={formErrors.hours ? "settings-closes-at-error" : undefined}
              className="clay-input w-full px-4 py-3"
            />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={`clay-chip ${isOpenSaturday ? "clay-chip-selected" : ""} px-4 py-2`}>
            <input type="checkbox" checked={isOpenSaturday} onChange={() => setIsOpenSaturday(!isOpenSaturday)} className="sr-only" />
            Open on Saturday
          </label>
          <label className={`clay-chip ${isOpenSunday ? "clay-chip-selected" : ""} px-4 py-2`}>
            <input type="checkbox" checked={isOpenSunday} onChange={() => setIsOpenSunday(!isOpenSunday)} className="sr-only" />
            Open on Sunday
          </label>
        </div>
      </section>

      {/* Booking slots: slot length and how many bookings one slot can take */}
      <section className="glass-card flex flex-col gap-4 p-5 md:p-6" aria-labelledby="settings-slots-title">
        <div>
          <h2 id="settings-slots-title" className="dashboard-card-title">
            Booking slots
          </h2>
          <p className="text-small text-muted mt-1">Customers only see slots that still have room.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Slot length (hours)" htmlFor="settings-slot-hours" error={formErrors.slotHours}>
            <input
              id="settings-slot-hours"
              type="number"
              min={1}
              max={8}
              value={slotHours}
              onChange={(event) => setSlotHours(event.target.value)}
              aria-invalid={Boolean(formErrors.slotHours)}
              aria-describedby={formErrors.slotHours ? "settings-slot-hours-error" : undefined}
              className="clay-input w-full px-4 py-3"
            />
          </FormField>
          <FormField label="Bookings per slot" htmlFor="settings-bookings-per-slot" error={formErrors.bookingsPerSlot}>
            <input
              id="settings-bookings-per-slot"
              type="number"
              min={1}
              max={20}
              value={bookingsPerSlot}
              onChange={(event) => setBookingsPerSlot(event.target.value)}
              aria-invalid={Boolean(formErrors.bookingsPerSlot)}
              aria-describedby={formErrors.bookingsPerSlot ? "settings-bookings-per-slot-error" : undefined}
              className="clay-input w-full px-4 py-3"
            />
          </FormField>
        </div>
      </section>

      {/* Save: button and the "Changes saved" chip */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saveStatus === "saving"}>
          {saveStatus === "saving" ? "Saving…" : "Save changes"}
        </Button>
        <p role="status">{saveStatus === "saved" && <Badge>✓ Changes saved</Badge>}</p>
      </div>
    </form>
  );
}

// Turns "HH:MM" into minutes after midnight, so two times can be subtracted ("08:30" → 510)
function toMinutes(time) {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}
