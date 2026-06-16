import { LoginForm } from "@/components/account/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Sign In",
  description: "Sign in to view orders, quotes, samples and saved floors.",
};

export default function AccountLoginPage() {
  return (
    <main className="section-padding bg-cream pt-[calc(var(--nav-height)+2rem)]">
      <div className="section-inner max-w-lg">
        <span className="eyebrow">Account</span>
        <h1 className="display-heading mb-4">
          Welcome <em>back</em>
        </h1>
        <p className="mb-8 text-walnut">
          Sign in to track orders, manage samples and access saved quotes.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
