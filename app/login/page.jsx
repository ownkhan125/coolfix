import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Owner login — CoolFix",
  robots: { index: false, follow: false },
};

// Login page: only the business owner signs in here (customers never log in). No navbar, footer or 3D.
// /login?error=link means the magic link was used, expired or broken (set by app/auth/callback/route.js).
export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  const hasLinkError = error === "link";

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      {/* Logo: back to the public site */}
      <Link href="/" className="logo-text">
        CoolFix
      </Link>

      {/* Login card, with a message on top when the magic link did not work */}
      <div className="flex w-full max-w-md flex-col gap-3">
        {hasLinkError && (
          <p className="field-error text-center" role="alert">
            This link has expired or was already used. Please ask for a new one.
          </p>
        )}
        <GlassCard>
          <LoginForm />
        </GlassCard>
      </div>
    </main>
  );
}
