"use client";

import { useState, useTransition } from "react";
import { submitProApplication } from "@/app/actions/pro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountType } from "@/types";
import { ACCOUNT_TYPE_LABELS } from "@/lib/pro";

const accountTypes: Array<Exclude<AccountType, "RETAIL">> = [
  "CONTRACTOR",
  "DESIGNER",
  "BUILDER",
];

interface ProApplyFormProps {
  defaultAccountType?: Exclude<AccountType, "RETAIL">;
  defaultContactName?: string | null;
  defaultEmail?: string;
}

const errorMessages: Record<string, string> = {
  sign_in_required: "Sign in before submitting your application.",
  application_pending: "Your application is already under review.",
  already_approved: "You already have an approved trade account.",
  invalid_input: "Check your details and try again.",
  server_error: "Unable to submit application. Please try again.",
};

export function ProApplyForm({
  defaultAccountType = "CONTRACTOR",
  defaultContactName,
  defaultEmail,
}: ProApplyFormProps) {
  const [accountType, setAccountType] =
    useState<Exclude<AccountType, "RETAIL">>(defaultAccountType);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    formData.set("accountType", accountType);

    startTransition(async () => {
      const result = await submitProApplication(formData);

      if (!result.success) {
        setError(errorMessages[result.error] ?? "Something went wrong.");
        return;
      }

      setSuccess(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border border-sand bg-white p-8">
      {defaultEmail ? (
        <p className="text-sm text-walnut">
          Applying as <span className="text-espresso">{defaultEmail}</span>
        </p>
      ) : null}

      <div>
        <Label htmlFor="accountType">Trade account type</Label>
        <Select
          value={accountType}
          onValueChange={(value) => {
            if (!value) return;
            setAccountType(value as Exclude<AccountType, "RETAIL">);
          }}
        >
          <SelectTrigger className="mt-1.5 w-full rounded-none border-sand bg-white">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {ACCOUNT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          className="mt-1.5 rounded-none border-sand bg-white"
        />
      </div>

      <div>
        <Label htmlFor="contactName">Contact name</Label>
        <Input
          id="contactName"
          name="contactName"
          required
          defaultValue={defaultContactName ?? ""}
          className="mt-1.5 rounded-none border-sand bg-white"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1.5 rounded-none border-sand bg-white"
        />
      </div>

      <div>
        <Label htmlFor="licenseNumber">License or business ID (optional)</Label>
        <Input
          id="licenseNumber"
          name="licenseNumber"
          className="mt-1.5 rounded-none border-sand bg-white"
        />
      </div>

      <div>
        <Label htmlFor="projectVolume">Typical project volume (optional)</Label>
        <Input
          id="projectVolume"
          name="projectVolume"
          placeholder="e.g. 5,000 sq ft / month"
          className="mt-1.5 rounded-none border-sand bg-white"
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional notes (optional)</Label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="mt-1.5 w-full border border-sand bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? (
        <p className="text-sm text-sage">
          Application received. Our trade team will review your details within 1-2
          business days.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending || success}
        className="w-full rounded-none bg-espresso py-6 text-[13px] tracking-wider uppercase hover:bg-walnut"
      >
        {isPending ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
