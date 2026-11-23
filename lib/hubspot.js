// HubSpot: sends a copy of the customer's contact to HubSpot (PLAN.md, Step 11). SERVER ONLY.
// HubSpot only RECEIVES contacts; nothing is read back. Supabase stays the real data source.
// Auth: a HubSpot Service Key in .env.local as HUBSPOT_SERVICE_KEY (scope: crm.objects.contacts.write).
// Docs: https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/batch/post-crm-v3-objects-contacts-batch-upsert

// "Upsert" = create the contact, or update it when a contact with the same email already exists (no duplicates)
const HUBSPOT_CONTACT_UPSERT_URL = "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert";

// Give up after 10 seconds, so a slow HubSpot never keeps the customer waiting for long
const HUBSPOT_TIMEOUT_MS = 10000;

// contact = { fullName, email, phone, address }. Returns the HubSpot contact id, or null when it fails.
// It never throws: a HubSpot problem must never cancel a booking (the caller notes it in the activity log).
export async function sendContactToHubSpot(contact) {
  const serviceKey = process.env.HUBSPOT_SERVICE_KEY;
  if (!serviceKey) {
    console.error("[hubspot] Missing HUBSPOT_SERVICE_KEY in .env.local, contact not sent");
    return null;
  }

  // HubSpot keeps first and last name apart: "Sara Khan Malik" → "Sara" + "Khan Malik"
  const [firstName, ...otherNames] = contact.fullName.split(" ");
  const email = contact.email.toLowerCase();

  try {
    const response = await fetch(HUBSPOT_CONTACT_UPSERT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: [
          {
            id: email,
            idProperty: "email",
            properties: {
              email,
              firstname: firstName,
              lastname: otherNames.join(" "),
              phone: contact.phone,
              address: contact.address,
            },
          },
        ],
      }),
      signal: AbortSignal.timeout(HUBSPOT_TIMEOUT_MS),
    });

    if (!response.ok) {
      // HubSpot explains the problem in the body (for example a missing scope); keep the first part for the log
      const errorText = await response.text();
      console.error(`[hubspot] Sending the contact failed (status ${response.status}):`, errorText.slice(0, 300));
      return null;
    }

    const body = await response.json();
    return body.results?.[0]?.id ?? null;
  } catch (sendError) {
    console.error("[hubspot] Could not reach HubSpot:", sendError.message);
    return null;
  }
}
