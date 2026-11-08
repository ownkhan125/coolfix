"use client";

import { useContext } from "react";
import Button from "@/components/ui/Button";
import { BookingModalContext } from "./BookingModalContext";

// Booking button: a clay button that opens the booking modal. Use it for every "Book a fix" on the site.
export default function BookingButton({ children, variant }) {
  const { openBookingModal } = useContext(BookingModalContext);

  return (
    <Button variant={variant} onClick={openBookingModal}>
      {children}
    </Button>
  );
}
