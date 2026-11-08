import Button from "@/components/ui/Button";

// Booking success: shown inside the modal after the form is sent
export default function BookingSuccess({ date, timeSlot, onClose }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center" role="status">
      {/* Mint clay check mark */}
      <div className="clay-success-icon flex h-16 w-16 items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-10" />
        </svg>
      </div>

      <h3>Booked! We&apos;ll confirm by email</h3>
      <p className="text-muted">
        Your visit is requested for {date} at {timeSlot}. A technician will confirm shortly.
      </p>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}
