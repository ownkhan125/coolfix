import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// GET /auth/callback?code=… — the magic link in the owner's email opens this address.
// It swaps the one-time code for a login session (saved in cookies) and opens the dashboard.
// A missing, used or expired code sends the owner back to /login with a friendly message.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
    console.error("[auth] Magic link login failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=link`);
}
