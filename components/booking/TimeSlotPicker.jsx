import { DUMMY_TIME_SLOTS } from "@/lib/dummy-data";

// Time slot picker: clay chips for the open slots of the chosen day, built on real radio buttons.
// The slots come from lib/dummy-data.js for now; later they will come from the bookings API.
export default function TimeSlotPicker({ value, onChange, error }) {
  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? "booking-time-slot-error" : undefined}>
      <legend className="field-label mb-2">Time slot</legend>

      {/* Chips: the radio input is visually hidden, the label is the clay chip */}
      <div className="flex flex-wrap gap-2">
        {DUMMY_TIME_SLOTS.map((timeSlot) => (
          <label key={timeSlot} className={`clay-chip ${value === timeSlot ? "clay-chip-selected" : ""} px-4 py-2`}>
            <input type="radio" name="timeSlot" value={timeSlot} checked={value === timeSlot} onChange={onChange} className="sr-only" />
            {timeSlot}
          </label>
        ))}
      </div>

      {error && (
        <p id="booking-time-slot-error" className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
