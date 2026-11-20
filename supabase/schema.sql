-- CoolFix database (PLAN.md, Step 5)
-- How to use: Supabase dashboard → SQL Editor → paste this whole file → Run.
-- Safe to run again: it only creates what is missing and re-creates the security rules.
--
-- Who can do what:
--   • The owner (any logged-in user — sign-ups are turned off in Step 6, so only the owner can log in)
--     can read everything and change lead stages, bookings and settings.
--   • Visitors (not logged in) cannot touch the database directly.
--     Customer bookings are saved by our own API on the server with the secret key (Step 9).


-- ============================================================
-- 1. Business settings — exactly one row for the company
-- ============================================================
create table if not exists public.business_settings (
  id smallint primary key default 1 check (id = 1),   -- only one row can ever exist
  business_name text not null default 'CoolFix',
  services jsonb not null default '[
    { "id": "ac-repair",      "name": "AC repair",       "isOffered": true },
    { "id": "ac-install",     "name": "AC installation", "isOffered": true },
    { "id": "gas-refill",     "name": "Gas refill",      "isOffered": true },
    { "id": "fridge-repair",  "name": "Fridge repair",   "isOffered": true },
    { "id": "freezer-repair", "name": "Freezer repair",  "isOffered": false }
  ]'::jsonb,
  opens_at time not null default '08:00',
  closes_at time not null default '19:00',
  open_saturday boolean not null default true,
  open_sunday boolean not null default false,
  slot_hours smallint not null default 2 check (slot_hours between 1 and 8),
  bookings_per_slot smallint not null default 3 check (bookings_per_slot between 1 and 20),
  updated_at timestamptz not null default now(),
  check (closes_at > opens_at)
);

-- The one settings row, with the defaults above
insert into public.business_settings (id) values (1)
on conflict (id) do nothing;


-- ============================================================
-- 2. Leads — every customer request from the booking form or the chat
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text,
  phone text not null,
  area text,
  appliance text check (appliance in ('AC', 'Fridge')),
  issue text,
  source text not null check (source in ('form', 'chat')),
  is_hot boolean not null default false,                               -- form leads are always hot
  lead_score smallint check (lead_score between 0 and 100),            -- chat leads only (from the AI)
  stage text not null default 'New'
    check (stage in ('New', 'Contacted', 'Booked', 'Completed', 'Lost')),
  ai_summary text,                                                     -- chat leads only
  ai_suggestion text,                                                  -- chat leads only
  photo_urls text[] not null default '{}',                             -- paths in the lead-photos bucket
  hubspot_contact_id text                                              -- filled in Step 11
);

-- Faster pipeline columns and "newest first" lists
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_created_at_idx on public.leads (created_at desc);


-- ============================================================
-- 3. Bookings — one visit in one time slot
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,   -- deleting a lead deletes its bookings
  booking_date date not null,
  slot_start time not null,                                               -- for example 10:00
  status text not null default 'Confirmed' check (status in ('Confirmed', 'Cancelled'))
);

-- Fast "how many bookings are in this slot?" check (used by the slots API in Step 8)
create index if not exists bookings_slot_idx on public.bookings (booking_date, slot_start);
create index if not exists bookings_lead_id_idx on public.bookings (lead_id);


-- ============================================================
-- 4. Lead activity — the timeline in the lead detail panel
-- ============================================================
create table if not exists public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  text text not null                                                      -- for example "Moved to Booked"
);

create index if not exists lead_activity_lead_id_idx on public.lead_activity (lead_id, created_at);


-- ============================================================
-- 5. Table access
--    Visitors (anon) get nothing. The owner (authenticated) gets only what the dashboard needs.
--    The server API uses the secret key (service_role), which skips these rules.
-- ============================================================
revoke all on public.business_settings, public.leads, public.bookings, public.lead_activity from anon;
revoke all on public.business_settings, public.leads, public.bookings, public.lead_activity from authenticated;

grant select, update on public.business_settings to authenticated;
grant select, update on public.leads to authenticated;
grant select, update on public.bookings to authenticated;
grant select, insert on public.lead_activity to authenticated;

grant all on public.business_settings, public.leads, public.bookings, public.lead_activity to service_role;


-- ============================================================
-- 6. Row Level Security — the rules Supabase checks on every request
-- ============================================================
alter table public.business_settings enable row level security;
alter table public.leads enable row level security;
alter table public.bookings enable row level security;
alter table public.lead_activity enable row level security;

-- Business settings: the owner reads and saves them (Settings page)
drop policy if exists "Owner can read settings" on public.business_settings;
create policy "Owner can read settings" on public.business_settings
  for select to authenticated using (true);

drop policy if exists "Owner can update settings" on public.business_settings;
create policy "Owner can update settings" on public.business_settings
  for update to authenticated using (true) with check (true);

-- Leads: the owner reads them and moves them between stages (Leads page)
drop policy if exists "Owner can read leads" on public.leads;
create policy "Owner can read leads" on public.leads
  for select to authenticated using (true);

drop policy if exists "Owner can update leads" on public.leads;
create policy "Owner can update leads" on public.leads
  for update to authenticated using (true) with check (true);

-- Bookings: the owner reads them and can cancel one (Bookings page)
drop policy if exists "Owner can read bookings" on public.bookings;
create policy "Owner can read bookings" on public.bookings
  for select to authenticated using (true);

drop policy if exists "Owner can update bookings" on public.bookings;
create policy "Owner can update bookings" on public.bookings
  for update to authenticated using (true) with check (true);

-- Lead activity: the owner reads the timeline and adds lines like "Moved to Contacted"
drop policy if exists "Owner can read lead activity" on public.lead_activity;
create policy "Owner can read lead activity" on public.lead_activity
  for select to authenticated using (true);

drop policy if exists "Owner can add lead activity" on public.lead_activity;
create policy "Owner can add lead activity" on public.lead_activity
  for insert to authenticated with check (true);


-- ============================================================
-- 7. Photo storage — private bucket "lead-photos"
--    JPG, PNG or WebP, 5 MB max (same rules as lib/photo-rules.js).
--    Uploads come from our API with the secret key (Step 9). Only the owner can view the photos.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lead-photos', 'lead-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Owner can view lead photos" on storage.objects;
create policy "Owner can view lead photos" on storage.objects
  for select to authenticated using (bucket_id = 'lead-photos');


-- ============================================================
-- 8. Double-booking guard (PLAN.md, Step 9)
--    Runs inside the database before every new or changed booking.
--    It locks that one slot, counts its confirmed bookings and refuses the booking when the slot is full
--    (Settings → "Bookings per slot"). Two customers booking the last place at the same second
--    wait in line, so only one of them gets it. Our API reads the error text 'SLOT_FULL'.
-- ============================================================
create or replace function public.check_slot_has_room()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  room_per_slot smallint;
  confirmed_count integer;
begin
  -- A cancelled booking takes no place
  if new.status <> 'Confirmed' then
    return new;
  end if;

  -- Lock this one slot (day + start time) until the booking is saved, so bookings for it wait in line
  perform pg_advisory_xact_lock(hashtext(new.booking_date::text || ' ' || new.slot_start::text));

  select bookings_per_slot into room_per_slot from business_settings where id = 1;

  select count(*) into confirmed_count
  from bookings
  where booking_date = new.booking_date
    and slot_start = new.slot_start
    and status = 'Confirmed'
    and id <> new.id;   -- when a booking is changed, do not count itself

  if confirmed_count >= room_per_slot then
    raise exception 'SLOT_FULL';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_check_slot_has_room on public.bookings;
create trigger bookings_check_slot_has_room
  before insert or update of status, booking_date, slot_start on public.bookings
  for each row execute function public.check_slot_has_room();
