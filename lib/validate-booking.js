// Booking form validation. Returns an object with one friendly English message per invalid field.
// An empty object means the form is valid.
export function validateBooking(values) {
  const errors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  // Simple check: something@something.something
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Count only the digits, so "+1 (512) 555-0101" is fine
  const phoneDigits = values.phone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (values.address.trim().length < 3) {
    errors.address = "Please enter your area or address.";
  }

  if (!values.appliance) {
    errors.appliance = "Please choose AC or Fridge.";
  }

  if (values.problem.trim().length < 10) {
    errors.problem = "Please describe the problem in a few words.";
  }

  if (!values.date) {
    errors.date = "Please pick a day.";
  }

  if (!values.timeSlot) {
    errors.timeSlot = "Please pick a time slot.";
  }

  return errors;
}
