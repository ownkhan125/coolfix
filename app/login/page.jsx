import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Owner login — CoolFix",
  robots: { index: false, follow: false },
};

// Login page: only the business owner signs in here (customers never log in). No navbar, footer or 3D.
export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      {/* Logo: back to the public site */}
      <Link href="/" className="logo-text">
        CoolFix
      </Link>

      {/* Login card */}
      <div className="w-full max-w-md">
        <GlassCard>
          <LoginForm />
        </GlassCard>
      </div>
    </main>
  );
}
