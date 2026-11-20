import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Proxy (Next.js 16's new name for middleware): runs before every /dashboard and /login request.
// 1. Keeps the owner's login session fresh (Supabase may send new login cookies).
// 2. Not logged in + /dashboard → send to /login.
// 3. Logged in + /login → send to /dashboard.
// The dashboard layout checks the login a second time, in case this file is ever skipped.
export async function proxy(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("[proxy] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  }

  // The normal "carry on" response. It is rebuilt if Supabase sends new cookies.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      // New login cookies go on the request (for the page about to render) and on the response (for the browser).
      // headers: no-cache headers from Supabase, so a page with login cookies is never cached for someone else.
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([headerName, headerValue]) => response.headers.set(headerName, headerValue));
      },
    },
  });

  // getClaims() checks the login token properly (Supabase says never trust getSession() on the server)
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  if (!isLoggedIn && path.startsWith("/dashboard")) {
    return redirectWithCookies(request, response, "/login");
  }

  if (isLoggedIn && path === "/login") {
    return redirectWithCookies(request, response, "/dashboard");
  }

  return response;
}

// A redirect that keeps any fresh login cookies from the response above
function redirectWithCookies(request, response, path) {
  const redirectResponse = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

// Run only on the dashboard pages and the login page (never on the public site, images or API routes)
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
