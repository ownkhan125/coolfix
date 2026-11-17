// Booking validation for the booking form and the chat booking card.
// Each function returns an object with one friendly English message per invalid field.
// An empty object means the values are valid.

// Contact details: the same checks for the booking form and the chat booking card
function validateContact(values) {
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

  if (!values.date) {
    errors.date = "Please pick a day.";
  }

  if (!values.timeSlot) {
    errors.timeSlot = "Please pick a time slot.";
  }

  return errors;
}

// Booking form: contact details + appliance + problem
export function validateBooking(values) {
  const errors = validateContact(values);

  if (!values.appliance) {
    errors.appliance = "Please choose AC or Fridge.";
  }

  if (values.problem.trim().length < 10) {
    errors.problem = "Please describe the problem in a few words.";
  }

  return errors;
}

// Chat booking card: contact details only (the appliance and the problem are already in the chat)
export function validateChatBooking(values) {
  return validateContact(values);
}
