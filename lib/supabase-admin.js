import { createClient } from "@supabase/supabase-js";

// Supabase client with the SECRET key: SERVER ONLY (app/api routes). Never import this in a "use client" file.
// It skips the Row Level Security rules, so our API can read bookings and save customer bookings
// for visitors who are not logged in. The key has no NEXT_PUBLIC_ prefix, so Next.js never sends it to the browser.
// Usage: const supabaseAdmin = createSupabaseAdminClient();
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  }

  // No login session here: this client acts as the server itself, not as a user
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
