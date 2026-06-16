"use client";

import { useState, useTransition } from "react";
import { requestSamples } from "@/app/actions/samples";
import { trackGenerateLead } from "@/lib/analytics";
import { calculateSampleTotal } from "@/lib/samples";
import { useSampleStore } from "@/lib/stores/sample-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "@/components/shared/toast-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCartCurrency } from "@/lib/cart";

interface SampleOrderFormProps {
  onSuccess?: () => void;
}

export function SampleOrderForm({ onSuccess }: SampleOrderFormProps) {
  const items = useSampleStore((state) => state.items);
  const boxSize = useSampleStore((state) => state.boxSize);
  const clearAll = useSampleStore((state) => state.clearAll);
  const cartItems = useCartStore((state) => state.items);
  const [isPending, startTransition] = useTransition();
  const [isPaying, setIsPaying] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const freeWithOrder = cartItems.length > 0;
  const total = calculateSampleTotal(items.length, { freeWithOrder, boxSize });
  const isFree = total <= 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Select at least one sample");
      return;
    }

    const payload = {
      email,
      name: name || undefined,
      shippingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        state: state.toUpperCase(),
        postalCode,
        country: "US",
      },
      productIds: items.map((item) => item.productId),
      boxSize,
      freeWithOrder,
    };

    startTransition(async () => {
      const result = await requestSamples(payload);

      if (result.success) {
        trackGenerateLead("sample_request");
        toast.success("Sample request submitted", {
          description: "Delivery in 2-4 business days.",
        });
        clearAll();
        onSuccess?.();
        return;
      }

      if ("requiresPayment" in result && result.requiresPayment) {
        setIsPaying(true);

        try {
          const response = await fetch("/api/stripe/samples/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name: name || undefined,
              productIds: items.map((item) => item.productId),
              boxSize,
              freeWithOrder,
            }),
          });

          const data = (await response.json()) as { url?: string; error?: string };

          if (!response.ok || !data.url) {
            throw new Error(data.error ?? "Unable to start sample checkout");
          }

          trackGenerateLead("sample_checkout");
          window.location.href = data.url;
        } catch (error) {
          setIsPaying(false);
          toast.error(
            error instanceof Error ? error.message : "Unable to start payment",
          );
        }

        return;
      }

      toast.error("Unable to submit sample request. Please try again.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="sample-name">Full name</Label>
          <Input
            id="sample-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="sample-email">Email</Label>
          <Input
            id="sample-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="sample-line1">Address</Label>
          <Input
            id="sample-line1"
            required={isFree}
            value={line1}
            onChange={(event) => setLine1(event.target.value)}
            className="mt-1.5"
          />
        </div>
        {isFree ? (
          <>
            <div className="sm:col-span-2">
              <Label htmlFor="sample-line2">Apartment, suite, etc.</Label>
              <Input
                id="sample-line2"
                value={line2}
                onChange={(event) => setLine2(event.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="sample-city">City</Label>
              <Input
                id="sample-city"
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="sample-state">State</Label>
              <Input
                id="sample-state"
                required
                maxLength={2}
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="mt-1.5 uppercase"
              />
            </div>
            <div>
              <Label htmlFor="sample-postal">ZIP code</Label>
              <Input
                id="sample-postal"
                required
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                className="mt-1.5"
              />
            </div>
          </>
        ) : (
          <div className="sm:col-span-2 text-sm text-text-muted">
            Shipping address will be collected securely on Stripe Checkout.
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="secondary"
        disabled={isPending || isPaying || items.length === 0}
        className="w-full py-6"
      >
        {isPending || isPaying
          ? "Processing..."
          : isFree
            ? `Order My ${boxSize}-Sample Box — Free`
            : `Pay ${formatCartCurrency(total)} with Stripe`}
      </Button>
    </form>
  );
}
