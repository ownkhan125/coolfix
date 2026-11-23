import Badge from "@/components/ui/Badge";
import { loadUpcomingBookings } from "@/lib/bookings";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = { title: "Bookings — CoolFix dashboard" };

// Bookings page: visits from today on, in time order, loaded from Supabase (lib/bookings.js).
// A row per booking from tablet up; a stacked card per booking on mobile.
export default async function DashboardBookingsPage() {
  const supabase = await createSupabaseServerClient();
  const bookings = await loadUpcomingBookings(supabase, process.env.BUSINESS_TIME_ZONE);

  return (
    <>
      <div>
        <h1 className="dashboard-title">Bookings</h1>
        <p className="text-muted mt-1">Upcoming visits, in time order.</p>
      </div>

      {/* Loading failed (details in the server log, tagged [bookings]) */}
      {bookings === null && (
        <p className="field-error" role="alert">
          We couldn&apos;t load your bookings. Please refresh the page.
        </p>
      )}

      {/* No visits yet */}
      {bookings?.length === 0 && <p className="text-muted">No upcoming visits yet.</p>}

      {bookings?.length > 0 && (
        <>
          {/* Column labels: tablet and up only */}
          <div className="text-small text-muted hidden gap-3 px-5 md:grid md:grid-cols-4" aria-hidden="true">
            <span>When</span>
            <span>Customer</span>
            <span>Appliance and area</span>
            <span>Status</span>
          </div>

          {/* Booking rows: on mobile each value gets a small label, from tablet up the column labels above do that job */}
          <ul className="flex flex-col gap-3">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-row grid gap-3 px-5 py-4 md:grid-cols-4 md:items-center">
                <div>
                  <p className="lead-name">{booking.time}</p>
                  <p className="text-small text-muted">{booking.day}</p>
                </div>
                <div>
                  <p>
                    <span className="text-small text-muted md:sr-only">Customer: </span>
                    {booking.customer}
                  </p>
                  <p className="text-small text-muted">{booking.phone}</p>
                </div>
                <p>
                  <span className="text-small text-muted md:sr-only">Appliance and area: </span>
                  {booking.appliance} · {booking.area}
                </p>
                <div>
                  <Badge variant={booking.status === "Confirmed" ? "mint" : "score"}>{booking.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
