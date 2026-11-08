import Link from "next/link";

// Footer: logo, one-line description, copyright and a small owner login link
export default function Footer() {
  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
      <p className="logo-text">CoolFix</p>
      <p className="text-small text-muted">AC and fridge repair, booked by an AI assistant.</p>
      <div className="flex items-center gap-4">
        <p className="text-small text-muted">© 2026 CoolFix. Portfolio demo.</p>
        <Link href="/login" className="text-small footer-link">
          Owner login
        </Link>
      </div>
    </footer>
  );
}
