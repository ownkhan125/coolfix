import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// POST /auth/logout — the "Log out" button in the dashboard top bar sends a form here.
// It ends the owner's session (clears the login cookies) and opens the login page.
export async function POST(request) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[auth] Log out failed:", error.message);
  }

  // 303 tells the browser to open /login with a normal GET (not another POST)
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
