import { createBrowserClient } from "@supabase/ssr";

// Supabase client for the browser: use it only inside "use client" components (for example the login form).
// Usage: const supabase = createSupabaseBrowserClient();
// Keys come from .env.local (see PLAN.md, Step 4). Only the publishable key is used here, never the secret key.
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
