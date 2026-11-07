// Mint clay badge for short labels like "Booked" (styles in styles/components.css)
export default function Badge({ children }) {
  return <span className="clay-badge inline-flex items-center gap-2 px-3 py-1">{children}</span>;
}
