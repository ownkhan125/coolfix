import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for the server: Server Components, Route Handlers (app/api) and Server Functions.
// It reads the owner's login session from the cookies, so Supabase knows who is asking.
// Create a new client for every request: const supabase = await createSupabaseServerClient();
// Keys come from .env.local (see PLAN.md, Step 4).
export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      // Give Supabase all cookies of the current request
      getAll() {
        return cookieStore.getAll();
      },
      // Save the login cookies Supabase sends back (for example after a session refresh).
      // Server Components are not allowed to set cookies, so there it fails quietly:
      // the login check in proxy.js (PLAN.md, Step 6) keeps the session fresh instead.
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: safe to ignore
        }
      },
    },
  });
}
