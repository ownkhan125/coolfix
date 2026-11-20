import Button from "@/components/ui/Button";
import { DUMMY_BUSINESS } from "@/lib/dummy-data";

// Dashboard top bar: business name and the "Log out" button
export default function DashboardTopBar() {
  return (
    <header className="glass-card flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-small text-muted">Owner dashboard</p>
        <p className="logo-text">{DUMMY_BUSINESS.name}</p>
      </div>

      {/* Log out: a small form that posts to app/auth/logout/route.js, which ends the session and opens /login */}
      <form action="/auth/logout" method="post">
        <Button type="submit" variant="secondary">
          Log out
        </Button>
      </form>
    </header>
  );
}
