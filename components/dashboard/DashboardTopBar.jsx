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

      {/* TODO: sign out with Supabase (supabase.auth.signOut()), then go to /login. For now it only links there. */}
      <Button href="/login" variant="secondary">
        Log out
      </Button>
    </header>
  );
}
