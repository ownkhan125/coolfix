// Business settings: load and save the one row of the business_settings table (supabase/schema.sql).
// The database uses snake_case names (opens_at); the app uses camelCase names (opensAt).
// The two functions at the bottom are the only place where these names are translated.

// Loads the settings with any Supabase client (server or browser). Returns null if it fails.
export async function loadBusinessSettings(supabase) {
  const { data, error } = await supabase.from("business_settings").select("*").eq("id", 1).single();

  if (error) {
    console.error("[settings] Loading the business settings failed:", error.message);
    return null;
  }
  return fromSettingsRow(data);
}

// Saves the settings. Returns true when the row was really updated.
export async function saveBusinessSettings(supabase, settings) {
  const { data, error } = await supabase
    .from("business_settings")
    .update(toSettingsRow(settings))
    .eq("id", 1)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[settings] Saving the business settings failed:", error?.message ?? "no row was updated");
    return false;
  }
  return true;
}

// Database row → app settings. Times come back as "08:00:00"; the time inputs need "08:00".
function fromSettingsRow(row) {
  return {
    name: row.business_name,
    services: row.services,
    opensAt: row.opens_at.slice(0, 5),
    closesAt: row.closes_at.slice(0, 5),
    isOpenSaturday: row.open_saturday,
    isOpenSunday: row.open_sunday,
    slotHours: row.slot_hours,
    bookingsPerSlot: row.bookings_per_slot,
  };
}

// App settings → database row
function toSettingsRow(settings) {
  return {
    business_name: settings.name,
    services: settings.services,
    opens_at: settings.opensAt,
    closes_at: settings.closesAt,
    open_saturday: settings.isOpenSaturday,
    open_sunday: settings.isOpenSunday,
    slot_hours: settings.slotHours,
    bookings_per_slot: settings.bookingsPerSlot,
    updated_at: new Date().toISOString(),
  };
}
