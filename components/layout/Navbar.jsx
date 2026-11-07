import Button from "@/components/ui/Button";

// Navbar: fixed glass bar with the logo, section links (tablet and up) and the main call-to-action
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass-card mx-auto flex max-w-6xl items-center justify-between px-5 py-3" aria-label="Main">
        {/* Logo */}
        <a href="#hero" className="logo-text">
          CoolFix
        </a>

        {/* Links: hidden on mobile to keep the bar simple */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#ac-services" className="nav-link">
            Services
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </div>

        {/* Call-to-action */}
        <Button href="#contact">Book a fix</Button>
      </nav>
    </header>
  );
}
