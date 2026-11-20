import SettingsForm from "@/components/dashboard/SettingsForm";
import { loadBusinessSettings } from "@/lib/business-settings";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = { title: "Settings — CoolFix dashboard" };

// Settings page: business name, services, working hours and booking slots, loaded from Supabase
export default async function DashboardSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const business = await loadBusinessSettings(supabase);

  return (
    <>
      <div>
        <h1 className="dashboard-title">Settings</h1>
        <p className="text-muted mt-1">What the assistant tells customers about your business.</p>
      </div>

      {/* The form, or a message when the settings could not be loaded (details are in the server log, tagged [settings]) */}
      {business ? (
        <SettingsForm business={business} />
      ) : (
        <p className="field-error" role="alert">
          We couldn&apos;t load your settings. Please refresh the page.
        </p>
      )}
    </>
  );
}
