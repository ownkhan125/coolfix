"use client";

import { useEffect, useState } from "react";

// Time slot picker: clay chips for the FREE slots of the chosen day, built on real radio buttons.
// The slots come from GET /api/slots (app/api/slots/route.js); full and past slots are never shown.
// Used by the booking form and the chat booking card. value = the chosen slot start, for example "08:00".
export default function TimeSlotPicker({ date, value, onChange, error }) {
  // The last answer from the API, and the day it belongs to (so we know when a new day is still loading)
  const [slotResult, setSlotResult] = useState({ date: "", slots: [], hasError: false });
  // Goes up by one when "Try again" is clicked, which loads the slots again
  const [retryCount, setRetryCount] = useState(0);
  const isLoading = date !== "" && slotResult.date !== date;

  // Load the free slots whenever the day changes (or "Try again" is clicked)
  useEffect(() => {
    if (!date) return;
    // Ignore an old answer that arrives after the customer already picked another day
    let isCurrentDay = true;

    fetch(`/api/slots?date=${date}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`status ${response.status}`))))
      .then((body) => {
        if (isCurrentDay) setSlotResult({ date, slots: body.slots, hasError: false });
      })
      .catch((loadError) => {
        console.error("[slots] Loading the free slots failed:", loadError.message);
        if (isCurrentDay) setSlotResult({ date, slots: [], hasError: true });
      });

    return () => {
      isCurrentDay = false;
    };
  }, [date, retryCount]);

  function handleRetry() {
    setSlotResult({ date: "", slots: [], hasError: false });
    setRetryCount(retryCount + 1);
  }

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? "booking-time-slot-error" : undefined}>
      <legend className="field-label mb-2">Time slot</legend>

      {/* One message or the chips, depending on where we are */}
      {date === "" && <p className="text-small text-muted">Pick a day first.</p>}

      {isLoading && (
        <p className="text-small text-muted" role="status">
          Checking free times…
        </p>
      )}

      {!isLoading && slotResult.hasError && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="field-error">We couldn&apos;t load the times.</p>
          <button type="button" onClick={handleRetry} className="upload-link">
            Try again
          </button>
        </div>
      )}

      {date !== "" && !isLoading && !slotResult.hasError && slotResult.slots.length === 0 && (
        <p className="text-small text-muted">No free slots on this day. Please pick another day.</p>
      )}

      {/* Chips: the radio input is visually hidden, the label is the clay chip */}
      {date !== "" && !isLoading && slotResult.slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slotResult.slots.map((slot) => (
            <label key={slot.start} className={`clay-chip ${value === slot.start ? "clay-chip-selected" : ""} px-4 py-2`}>
              <input type="radio" name="timeSlot" value={slot.start} checked={value === slot.start} onChange={onChange} className="sr-only" />
              {slot.label}
            </label>
          ))}
        </div>
      )}

      {error && (
        <p id="booking-time-slot-error" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
