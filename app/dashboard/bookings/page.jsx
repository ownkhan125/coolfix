import Badge from "@/components/ui/Badge";
import { DUMMY_BOOKINGS } from "@/lib/dummy-data";

export const metadata = { title: "Bookings — CoolFix dashboard" };

// Bookings page: upcoming visits. A row per booking from tablet up; a stacked card per booking on mobile.
export default function DashboardBookingsPage() {
  // TODO: load the upcoming bookings from Supabase instead of the dummy data
  return (
    <>
      <div>
        <h1 className="dashboard-title">Bookings</h1>
        <p className="text-muted mt-1">Upcoming visits, in time order.</p>
      </div>

      {/* Column labels: tablet and up only */}
      <div className="text-small text-muted hidden gap-3 px-5 md:grid md:grid-cols-5" aria-hidden="true">
        <span>When</span>
        <span>Customer</span>
        <span>Appliance and area</span>
        <span>Technician</span>
        <span>Status</span>
      </div>

      {/* Booking rows: on mobile each value gets a small label, from tablet up the column labels above do that job */}
      <ul className="flex flex-col gap-3">
        {DUMMY_BOOKINGS.map((booking) => (
          <li key={booking.id} className="booking-row grid gap-3 px-5 py-4 md:grid-cols-5 md:items-center">
            <div>
              <p className="lead-name">{booking.time}</p>
              <p className="text-small text-muted">{booking.day}</p>
            </div>
            <p>
              <span className="text-small text-muted md:sr-only">Customer: </span>
              {booking.customer}
            </p>
            <p>
              <span className="text-small text-muted md:sr-only">Appliance and area: </span>
              {booking.appliance} · {booking.area}
            </p>
            <p>
              <span className="text-small text-muted md:sr-only">Technician: </span>
              {booking.technician}
            </p>
            <div>
              <Badge variant={booking.status === "Confirmed" ? "mint" : "score"}>{booking.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
