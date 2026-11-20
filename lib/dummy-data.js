// Temporary data. Will be replaced by Supabase queries.

// Assistant reply shown in the chat widget (the real reply will come from the AI assistant API).
// The chat shows a "Book a visit here" button under this reply (offerBooking: true in ChatPanel.jsx).
export const DUMMY_ASSISTANT_REPLY =
  "Thanks! I'm looking into it. Could you tell me the brand of the unit and when the problem started? Would you like me to book a visit for you?";

// Business profile shown in the dashboard top bar and the Settings form
export const DUMMY_BUSINESS = {
  name: "CoolFix Austin",
  services: [
    { id: "ac-repair", name: "AC repair", isOffered: true },
    { id: "ac-install", name: "AC installation", isOffered: true },
    { id: "gas-refill", name: "Gas refill", isOffered: true },
    { id: "fridge-repair", name: "Fridge repair", isOffered: true },
    { id: "freezer-repair", name: "Freezer repair", isOffered: false },
  ],
  opensAt: "08:00",
  closesAt: "19:00",
  isOpenSaturday: true,
  isOpenSunday: false,
  // Booking slots: each slot is 2 hours long and takes up to 3 bookings (PLAN.md, section 6)
  slotHours: 2,
  bookingsPerSlot: 3,
};

// Numbers for the four Overview stat cards
export const DUMMY_STATS = {
  leadsToday: { value: "14", trend: "+3 vs yesterday" },
  hotLeads: { value: "5", trend: "2 waiting for a call" },
  bookedByAssistant: { value: "9", trend: "64% of today's leads" },
  averageReplyTime: { value: "38 sec", trend: "−6 sec this week" },
};

// Leads from the chat and the booking form.
// source: "chat" or "form". leadScore: 0–100, given by the AI for chat leads only (null for form leads).
// isHot: form leads are always hot; chat leads are hot from a score of 85.
// stage: pipeline stage — "New", "Contacted", "Booked", "Completed" or "Lost".
// aiSummary: chat leads only (null for form leads).
export const DUMMY_LEADS = [
  {
    id: "lead-1",
    name: "Sara Khan",
    phone: "+1 512 555 0101",
    area: "South Austin",
    appliance: "AC",
    issue: "AC blowing warm air",
    source: "chat",
    leadScore: 92,
    isHot: true,
    stage: "Booked",
    receivedAt: "Today, 9:12 AM",
    aiSummary:
      "Split AC blowing warm air since this morning. Photo shows frost on the outdoor pipes, most likely low refrigerant. Customer is home all day and wants the earliest slot.",
    activity: [
      { id: "a1", time: "9:12 AM", text: "Lead came in through the chat with 1 photo" },
      { id: "a2", time: "9:12 AM", text: "AI scored the lead 92 (hot)" },
      { id: "a3", time: "9:13 AM", text: "Booked for today, 4:00 PM" },
      { id: "a4", time: "9:13 AM", text: "Confirmation email sent" },
    ],
  },
  {
    id: "lead-2",
    name: "David Miller",
    phone: "+1 512 555 0144",
    area: "Round Rock",
    appliance: "AC",
    issue: "Refrigerant leak, hissing",
    source: "chat",
    leadScore: 98,
    isHot: true,
    stage: "New",
    receivedAt: "Today, 10:05 AM",
    aiSummary:
      "AC hissing with an oily spot under the indoor unit. Likely refrigerant leak. Customer was told to switch the unit off. Marked urgent.",
    activity: [
      { id: "a1", time: "10:05 AM", text: "Lead came in through the chat with 2 photos" },
      { id: "a2", time: "10:05 AM", text: "AI scored the lead 98 (urgent)" },
      { id: "a3", time: "10:06 AM", text: "Owner notified by SMS" },
    ],
  },
  {
    id: "lead-3",
    name: "Lucia Rossi",
    phone: "+1 512 555 0178",
    area: "East Austin",
    appliance: "Fridge",
    issue: "Loud buzzing at night",
    source: "form",
    leadScore: null,
    isHot: true,
    stage: "Contacted",
    receivedAt: "Today, 11:40 AM",
    aiSummary: null,
    activity: [
      { id: "a1", time: "11:40 AM", text: "Lead came in through the booking form" },
      { id: "a2", time: "12:15 PM", text: "Owner called the customer" },
    ],
  },
  {
    id: "lead-4",
    name: "James Okafor",
    phone: "+1 512 555 0190",
    area: "Cedar Park",
    appliance: "AC",
    issue: "Unit won't turn on",
    source: "chat",
    leadScore: 81,
    isHot: false,
    stage: "New",
    receivedAt: "Today, 1:22 PM",
    aiSummary:
      "AC does not power on, no display lights. Breaker already checked by the customer. Could be a control board or capacitor issue.",
    activity: [
      { id: "a1", time: "1:22 PM", text: "Lead came in through the chat" },
      { id: "a2", time: "1:22 PM", text: "AI scored the lead 81 (warm)" },
    ],
  },
  {
    id: "lead-5",
    name: "Aisha Noor",
    phone: "+1 512 555 0123",
    area: "North Loop",
    appliance: "Fridge",
    issue: "Freezer not freezing",
    source: "form",
    leadScore: null,
    isHot: true,
    stage: "Booked",
    receivedAt: "Yesterday, 6:05 PM",
    aiSummary: null,
    activity: [
      { id: "a1", time: "6:05 PM", text: "Lead came in through the booking form with 1 photo" },
      { id: "a2", time: "6:05 PM", text: "Booked for tomorrow, 10:00 AM" },
    ],
  },
  {
    id: "lead-6",
    name: "Omar Haddad",
    phone: "+1 512 555 0162",
    area: "Hyde Park",
    appliance: "AC",
    issue: "AC leaking water indoors",
    source: "chat",
    leadScore: 86,
    isHot: true,
    stage: "Completed",
    receivedAt: "Monday, 2:40 PM",
    aiSummary:
      "Water dripping from the indoor unit onto the wall. Most likely a blocked drain line. Customer wanted a visit the same week.",
    activity: [
      { id: "a1", time: "2:40 PM", text: "Lead came in through the chat with 1 photo" },
      { id: "a2", time: "2:40 PM", text: "AI scored the lead 86 (hot)" },
      { id: "a3", time: "2:41 PM", text: "Booked for Tuesday, 10:00 AM" },
      { id: "a4", time: "Tuesday", text: "Moved to Completed" },
    ],
  },
  {
    id: "lead-7",
    name: "Hannah Becker",
    phone: "+1 512 555 0187",
    area: "Westlake",
    appliance: "Fridge",
    issue: "Asking about a new fridge price",
    source: "chat",
    leadScore: 35,
    isHot: false,
    stage: "Lost",
    receivedAt: "Monday, 9:15 AM",
    aiSummary: "Customer only wanted a price for a new fridge. No repair needed. Not a service lead.",
    activity: [
      { id: "a1", time: "9:15 AM", text: "Lead came in through the chat" },
      { id: "a2", time: "9:15 AM", text: "AI scored the lead 35 (cold)" },
      { id: "a3", time: "11:00 AM", text: "Moved to Lost" },
    ],
  },
];

// Upcoming bookings for the Bookings page. status: "Confirmed" or "Pending".
export const DUMMY_BOOKINGS = [
  { id: "booking-1", day: "Today", time: "4:00 PM", customer: "Sara Khan", appliance: "AC", area: "South Austin", technician: "Mike R.", status: "Confirmed" },
  { id: "booking-2", day: "Today", time: "5:30 PM", customer: "Omar Haddad", appliance: "AC", area: "Hyde Park", technician: "Lena P.", status: "Confirmed" },
  { id: "booking-3", day: "Tomorrow", time: "10:00 AM", customer: "Aisha Noor", appliance: "Fridge", area: "North Loop", technician: "Mike R.", status: "Confirmed" },
  { id: "booking-4", day: "Tomorrow", time: "12:00 PM", customer: "Chen Wei", appliance: "Fridge", area: "Mueller", technician: "Lena P.", status: "Pending" },
  { id: "booking-5", day: "Friday", time: "9:00 AM", customer: "Maria Lopez", appliance: "AC", area: "Pflugerville", technician: "Sam K.", status: "Pending" },
];
