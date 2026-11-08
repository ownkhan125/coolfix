import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";

export const metadata = {
  title: "Dashboard — CoolFix",
  robots: { index: false, follow: false },
};

// Dashboard layout: glass sidebar (a bottom tab bar on mobile), top bar and the page content.
// Only the business owner sees this. No navbar, footer, 3D scene, booking modal or chat widget here.
export default function DashboardLayout({ children }) {
  // TODO: auth check — read the Supabase session here (server side).
  // If there is no signed-in owner, send them to the login page with redirect("/login") from "next/navigation".

  return (
    <div className="flex flex-1 flex-col md:flex-row md:gap-6 md:p-6">
      <DashboardSidebar />

      {/* Content: top bar and the current page (extra bottom padding on mobile for the tab bar) */}
      <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 pt-4 pb-28 md:p-0">
        <DashboardTopBar />
        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
}
