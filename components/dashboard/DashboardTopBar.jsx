import Button from "@/components/ui/Button";
import { loadBusinessSettings } from "@/lib/business-settings";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Dashboard top bar: the business name from Settings and the "Log out" button
export default async function DashboardTopBar() {
  const supabase = await createSupabaseServerClient();
  const business = await loadBusinessSettings(supabase);

  return (
    <header className="glass-card flex items-center justify-between gap-4 px-5 py-4">
      <div>
        <p className="text-small text-muted">Owner dashboard</p>
        {/* Falls back to "CoolFix" if the settings could not be loaded (details in the server log, tagged [settings]) */}
        <p className="logo-text">{business?.name ?? "CoolFix"}</p>
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
