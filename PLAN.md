# CoolFix — Product Plan

This file is the single source of truth for what we build and in which order.
Every step is small, gets its own commit, and starts only after the owner approves it.
When a step is done, it gets a ✅.

---

## 1. What the product does

A customer of a home-service company (AC and fridge repair) describes a problem, sends photos and books a visit.
The business owner sees every lead and booking in a dashboard and moves leads through a pipeline.
The company sends a technician itself — the app does not manage technicians.

## 2. Decisions (already agreed)

| Topic | Decision |
|---|---|
| Technicians | None in the app. The company sends a technician itself. |
| Where data lives | **Supabase is the only real data source** (leads, bookings, slots, settings, pipeline). |
| Slot booking | Built in this project (Supabase + our own API). No outside booking tool. |
| Slot length | **2 hours** (editable in Settings). |
| Bookings per slot | **3** (editable in Settings). Full slots are never shown to the customer. |
| Booking form lead | No AI score. It is always a **Hot** lead. |
| Chat lead | AI gives the lead score, a summary and a suggestion. |
| Booking from chat | Yes, directly inside the chat. |
| HubSpot | Free plan. **Only receives a copy of the contact.** Nothing is read back from HubSpot. |
| Confirmation email | Sent from this project with **Resend** (not HubSpot — free HubSpot has no workflows). |
| AI provider | Decided later. |
| Pipeline | On the dashboard. The owner moves leads between stages. |
| Pipeline stages | New → Contacted → Booked → Completed → Lost |

## 3. Ground rules (to keep the project under control)

1. **Supabase first.** Every booking is saved in Supabase before anything else happens.
2. **One file per service.** If an integration breaks, only one file needs to be opened.
3. **Outside services never break a booking.** If HubSpot or the email fails, the booking still succeeds and the lead's activity log says "HubSpot sync failed" or "Email failed".
4. **Every error log starts with the file's tag**, for example `[hubspot] ...`, `[slots] ...`, `[email] ...`.
5. **Business values live in Settings, not in code** (slot length, bookings per slot, working hours, open days).
6. **No new package without the owner's approval.** HubSpot and Resend are called with plain `fetch`.
7. All project rules in `CLAUDE.md` and `.claude/rules/styling.md` apply to every step.

## 4. File map — where to look when something breaks

| Job | File |
|---|---|
| Supabase connection (server side) | `lib/supabase-server.js` |
| Supabase connection (browser, login) | `lib/supabase-browser.js` |
| Supabase connection with the secret key (server API only) | `lib/supabase-admin.js` |
| Load / save business settings | `lib/business-settings.js` |
| Free slot calculation | `lib/slots.js` |
| Send contact to HubSpot | `lib/hubspot.js` |
| Confirmation email (Resend) | `lib/email.js` |
| AI calls (later) | `lib/ai.js` |
| Slots API | `app/api/slots/route.js` |
| Save booking API | `app/api/bookings/route.js` |
| Change lead stage API | `app/api/leads/stage/route.js` |
| Chat API (later) | `app/api/chat/route.js` |
| Dashboard login check | `proxy.js` (confirm the name in the Next.js 16 docs first) |
| Database tables | `supabase/schema.sql` (run once in the Supabase SQL editor) |

## 5. Database (Supabase)

- **`business_settings`** — business name, opens_at, closes_at, open_saturday, open_sunday, `slot_hours` (2), `bookings_per_slot` (3)
- **`leads`** — name, email, phone, area, appliance, issue, `source` (form / chat), `is_hot`, `lead_score` (chat only), `stage`, ai_summary, ai_suggestion, photo_urls, `hubspot_contact_id`, created_at
- **`bookings`** — lead_id, booking_date, slot_start, status, created_at
- **`lead_activity`** — lead_id, text, created_at (feeds the activity timeline in the dashboard)
- **Storage bucket `lead-photos`** — customer photos

## 6. How free slots work

Example: working hours 8:00 AM – 7:00 PM, 2-hour slots → 8–10, 10–12, 12–2, 2–4, 4–6.
(6–8 is not created because it ends after closing time.)

A slot is **not shown** when:
- it already has 3 bookings, or
- its time has already passed, or
- the business is closed that day.

When a booking is saved, the slot is checked again, so two customers can never take the last place at the same moment.

## 7. Booking flow (same for the form and the chat)

```
Customer submits
 → 1. Validate the data
 → 2. Is the slot still free?  (no → "This slot was just taken")
 → 3. Supabase: save the lead (form = Hot, stage = Booked)
 → 4. Supabase: save the booking + upload photos
 → 5. HubSpot: send the contact      (on failure: note in the activity log only)
 → 6. Resend: confirmation email      (on failure: note in the activity log only)
 → Customer sees the success screen
```

---

## 8. Steps

### Part A — Finish the frontend (dummy data)

- [x] ✅ **Step 1 — Pipeline board.** Leads page shows columns: New, Contacted, Booked, Completed, Lost. Each lead card and the lead detail panel get a "Move to" dropdown (no drag and drop, so no new package).
- [x] ✅ **Step 2 — Slot settings.** Settings form gets "Slot length (hours)" and "Bookings per slot".
- [x] ✅ **Step 3 — Booking inside the chat.** Chat asks for name, phone, area and email, shows free slots, and books.

### Part B — Supabase (real data)

- [x] ✅ **Step 4 — Setup.** Owner creates the Supabase project. Keys go in `.env.local`. Install `@supabase/supabase-js` and `@supabase/ssr` (after approval).
- [x] ✅ **Step 5 — Tables.** Write `supabase/schema.sql`. Owner runs it in Supabase.
- [x] ✅ **Step 6 — Login.** Magic link, protected dashboard, sign out. Only the owner's email can sign in.
- [x] ✅ **Step 7 — Settings.** Save and load from Supabase.
- [x] ✅ **Step 8 — Slots.** `lib/slots.js` + `/api/slots`. The time slot picker shows real free slots.
- [ ] **Step 9 — Save bookings.** `/api/bookings`, booking form connected, photo upload.
- [ ] **Step 10 — Dashboard on real data.** Overview, Leads, Bookings and pipeline stage changes.

### Part C — Outside services

- [ ] **Step 11 — HubSpot.** Owner creates a HubSpot Private App (contacts permission only). `lib/hubspot.js` with `fetch`.
- [ ] **Step 12 — Email.** Owner creates a Resend account. `lib/email.js` with `fetch`.
- [ ] **Step 13 — AI.** After the provider is chosen: `lib/ai.js` + `/api/chat` (lead score, suggestion, photo analysis, booking from chat).

### Part D — Finish

- [ ] **Step 14 — Polish.** `not-found`, `error` and `loading` pages, `.env.example`, README (what every file does), deploy.

## 9. Owner's manual tasks (accounts and keys)

| Step | Task |
|---|---|
| 4 | Create a Supabase project and copy the URL and keys |
| 8 | Add `SUPABASE_SECRET_KEY` and `BUSINESS_TIME_ZONE=Asia/Karachi` to `.env.local` |
| 5 | Run `supabase/schema.sql` in the Supabase SQL editor |
| 11 | Create a HubSpot Private App and copy the token |
| 12 | Create a Resend account and copy the API key |
| 13 | Choose the AI provider and get its API key |
