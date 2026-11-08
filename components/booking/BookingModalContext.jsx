"use client";

import { createContext, useRef, useState } from "react";
import BookingModal from "./BookingModal";

// Shared open/close state for the booking modal, so any "Book a fix" button on the site can open it.
// Read it with useContext(BookingModalContext) inside a client component.
export const BookingModalContext = createContext(null);

// Booking modal provider: wraps the site, holds the open state and renders the one booking modal
export default function BookingModalProvider({ children }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  // The button that opened the modal, so focus can go back to it after closing
  const openerRef = useRef(null);

  function openBookingModal(event) {
    openerRef.current = event?.currentTarget ?? document.activeElement;
    setIsBookingOpen(true);
  }

  function closeBookingModal() {
    setIsBookingOpen(false);
    openerRef.current?.focus();
  }

  return (
    <BookingModalContext.Provider value={{ isBookingOpen, openBookingModal, closeBookingModal }}>
      {children}
      <BookingModal isOpen={isBookingOpen} onClose={closeBookingModal} />
    </BookingModalContext.Provider>
  );
}
