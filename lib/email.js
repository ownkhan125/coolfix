// Confirmation email to the customer after a booking, sent with Resend (PLAN.md, Step 12). SERVER ONLY.
// Settings in .env.local:
//   RESEND_API_KEY = the Resend API key
//   EMAIL_FROM     = the sender, for example "CoolFix <onboarding@resend.dev>"
//                    (onboarding@resend.dev can only send to your own Resend account email; real customers
//                    need a verified domain at resend.com/domains, then EMAIL_FROM uses that domain)
// Docs: https://resend.com/docs/api-reference/emails/send-email

const RESEND_SEND_URL = "https://api.resend.com/emails";

// Give up after 10 seconds, so a slow email service never keeps the customer waiting for long
const RESEND_TIMEOUT_MS = 10000;

// details = { leadId, businessName, fullName, email, dayLabel, slotLabel, address }
// Returns true when Resend accepted the email. It never throws: an email problem must never cancel a booking.
export async function sendBookingConfirmationEmail(details) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM;
  if (!apiKey || !fromAddress) {
    console.error("[email] Missing RESEND_API_KEY or EMAIL_FROM in .env.local, email not sent");
    return false;
  }

  // Customer text goes into HTML, so it is escaped first (a name like "<b>Sara</b>" stays plain text)
  const firstName = escapeHtml(details.fullName.split(" ")[0]);
  const businessName = escapeHtml(details.businessName);
  const visitTime = `${escapeHtml(details.dayLabel)}, ${escapeHtml(details.slotLabel)}`;
  const address = escapeHtml(details.address);

  try {
    const response = await fetch(RESEND_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Same lead → same key, so a retry can never send the same email twice
        "Idempotency-Key": `booking-confirmation-${details.leadId}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: details.email,
        subject: `Your visit is booked: ${details.dayLabel}, ${details.slotLabel}`,
        // Plain, simple HTML: email apps ignore our CSS files, so no styling here on purpose
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for choosing ${businessName}. Your visit is booked.</p>
          <p><strong>When:</strong> ${visitTime}<br /><strong>Where:</strong> ${address}</p>
          <p>A technician will arrive within this time window. If you need to change the time, just reply to this email.</p>
          <p>${businessName}</p>
        `,
      }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Resend explains the problem in the body (for example "You can only send testing emails to your own email address")
      const errorText = await response.text();
      console.error(`[email] Sending the confirmation failed (status ${response.status}):`, errorText.slice(0, 300));
      return false;
    }
    return true;
  } catch (sendError) {
    console.error("[email] Could not reach Resend:", sendError.message);
    return false;
  }
}

// Makes customer text safe to put inside HTML: & < > " ' become their HTML codes
function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
