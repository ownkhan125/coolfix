import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingModalProvider from "@/components/booking/BookingModalContext";
import ChatWidgetProvider from "@/components/chat/ChatWidgetContext";

// Public site layout: navbar, footer, the booking modal and the chat widget.
// Only pages inside app/(site)/ get these; /login and /dashboard do not. The "(site)" folder name is not part of the URL.
export default function SiteLayout({ children }) {
  return (
    <BookingModalProvider>
      <ChatWidgetProvider>
        <Navbar />
        {children}
        <Footer />
      </ChatWidgetProvider>
    </BookingModalProvider>
  );
}
