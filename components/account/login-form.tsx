"use client";

import { useState, useTransition } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result =
        mode === "sign-in"
          ? await signIn(formData)
          : await signUp(formData);

      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="border border-sand bg-white p-8 md:p-10">
      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={cn(
            "cursor-pointer px-4 py-2 text-sm tracking-wide uppercase transition-colors",
            mode === "sign-in"
              ? "bg-espresso text-bone"
              : "bg-bone text-walnut",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={cn(
            "cursor-pointer px-4 py-2 text-sm tracking-wide uppercase transition-colors",
            mode === "sign-up"
              ? "bg-espresso text-bone"
              : "bg-bone text-walnut",
          )}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "sign-up" ? (
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              required
              className="mt-1.5 rounded-none border-sand bg-white"
            />
          </div>
        ) : null}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 rounded-none border-sand bg-white"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-1.5 rounded-none border-sand bg-white"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-none bg-espresso py-6 text-[13px] tracking-wider uppercase hover:bg-walnut"
        >
          {isPending
            ? "Please wait..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>
    </div>
  );
}
