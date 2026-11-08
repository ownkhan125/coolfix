import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans, exposed as the --font-jakarta CSS variable (used in styles/theme.css)
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata = {
  title: "CoolFix — AI Lead Assistant",
  description:
    "AI lead assistant for AC repair and plumbing: scores leads, books time slots and saves contacts to your CRM.",
};

// Root layout: only html, body, the font and global styles. The public site's navbar, footer, booking modal
// and chat widget live in app/(site)/layout.jsx, so /login and /dashboard stay clean.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
