// Footer: logo, one-line description and copyright
export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
      <p className="logo-text">CoolFix</p>
      <p className="text-small text-muted">AC and fridge repair, booked by an AI assistant.</p>
      <p className="text-small text-muted">© 2026 CoolFix. Portfolio demo.</p>
    </footer>
  );
}
