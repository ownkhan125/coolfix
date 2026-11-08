import SettingsForm from "@/components/dashboard/SettingsForm";
import { DUMMY_BUSINESS } from "@/lib/dummy-data";

export const metadata = { title: "Settings — CoolFix dashboard" };

// Settings page: business name, services and working hours
export default function DashboardSettingsPage() {
  // TODO: load the saved settings from Supabase instead of the dummy data
  return (
    <>
      <div>
        <h1 className="dashboard-title">Settings</h1>
        <p className="text-muted mt-1">What the assistant tells customers about your business.</p>
      </div>

      <SettingsForm business={DUMMY_BUSINESS} />
    </>
  );
}
