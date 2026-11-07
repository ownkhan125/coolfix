import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

// Root layout: wraps every page with the font and global styles
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
