"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// Owner login form: email + "Send magic link". After sending, the card shows "Check your email".
// No password: the owner signs in with the link from the email.
// Only the existing owner account can get a link (shouldCreateUser: false, and sign-ups are off in Supabase).
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  async function handleLoginSubmit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSending(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false,
        // The link in the email opens this address (it must be listed in Supabase → Authentication → URL Configuration)
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsSending(false);

    if (error) {
      console.error("[auth] Sending the magic link failed:", error.message);
      // 429 = Supabase's email limit was reached
      setEmailError(
        error.status === 429
          ? "Too many emails were sent. Please wait a few minutes and try again."
          : "We couldn't send a link to this email. Please check it is the owner email."
      );
      return;
    }

    setIsLinkSent(true);
  }

  // After sending: tell the owner to check their inbox
  if (isLinkSent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center" role="status">
        <div className="clay-success-icon flex h-14 w-14 items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </div>
        <h1 className="modal-title">Check your email</h1>
        <p className="text-muted">
          We sent a sign-in link to <strong>{email}</strong>. Open it on this device to reach your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h1 className="modal-title">Owner login</h1>
        <p className="text-muted mt-1">We&apos;ll email you a magic link. No password needed.</p>
      </div>

      <FormField label="Email" htmlFor="login-email" error={emailError}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError("");
          }}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          className="clay-input w-full px-4 py-3"
        />
      </FormField>

      <Button type="submit" disabled={isSending}>
        {isSending ? "Sending link…" : "Send magic link"}
      </Button>
    </form>
  );
}
