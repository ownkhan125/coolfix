"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardNavLink from "./DashboardNavLink";

// Dashboard sidebar: logo and the four section links. From tablet up a glass sidebar on the left;
// on mobile the same links become a fixed bottom tab bar.
export default function DashboardSidebar() {
  const pathname = usePathname();

  // Overview is active only on /dashboard itself; the other links also on any page below them
  function isLinkActive(href) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav
      aria-label="Dashboard"
      className="dashboard-sidebar fixed inset-x-0 bottom-0 z-40 px-2 py-2 md:sticky md:top-6 md:self-start md:p-4"
    >
      {/* Logo: sidebar only */}
      <Link href="/" className="logo-text hidden px-4 pt-2 pb-6 md:block">
        CoolFix
      </Link>

      {/* Links */}
      <ul className="flex md:flex-col md:gap-1">
        <DashboardNavLink href="/dashboard" label="Overview" isActive={isLinkActive("/dashboard")}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
        </DashboardNavLink>
        <DashboardNavLink href="/dashboard/leads" label="Leads" isActive={isLinkActive("/dashboard/leads")}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c1.8.8 3 2.6 3 6" />
          </svg>
        </DashboardNavLink>
        <DashboardNavLink href="/dashboard/bookings" label="Bookings" isActive={isLinkActive("/dashboard/bookings")}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5" />
          </svg>
        </DashboardNavLink>
        <DashboardNavLink href="/dashboard/settings" label="Settings" isActive={isLinkActive("/dashboard/settings")}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
          </svg>
        </DashboardNavLink>
      </ul>
    </nav>
  );
}
