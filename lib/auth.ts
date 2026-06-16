import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isApprovedPro } from "@/lib/pro";
import { createClient } from "@/lib/supabase/server";
import type { ProStatus } from "@/types";
import type { AccountType } from "@/types";

export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}

export async function getOrCreateCustomer(
  supabaseUserId: string,
  email: string,
  name?: string | null,
) {
  return prisma.customer.upsert({
    where: { supabaseUserId },
    update: {
      email,
      ...(name ? { name } : {}),
    },
    create: {
      supabaseUserId,
      email,
      name: name ?? null,
    },
  });
}

export async function getCustomerForUser() {
  const user = await getAuthUser();
  if (!user?.email) return null;

  try {
    return await getOrCreateCustomer(
      user.id,
      user.email,
      user.user_metadata?.full_name ?? user.user_metadata?.name,
    );
  } catch {
    return null;
  }
}

export async function requireCustomer() {
  const user = await getAuthUser();

  if (!user?.email) {
    redirect("/account/login");
  }

  const customer = await getCustomerForUser();

  if (!customer) {
    redirect("/account/login");
  }

  return { user, customer };
}

export async function requireApprovedPro() {
  const { user, customer } = await requireCustomer();

  if (isApprovedPro(customer)) {
    return { user, customer };
  }

  if (customer.proStatus === "PENDING") {
    redirect("/pro/apply");
  }

  redirect("/professionals");
}

export type ProApplicationState =
  | { state: "anonymous" }
  | {
      state: "eligible" | "pending" | "rejected" | "approved";
      customer: {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        accountType: AccountType;
        proStatus: ProStatus | null;
        discountPercent: { toNumber: () => number } | null;
      };
      user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
    };

export async function getProApplicationState(): Promise<ProApplicationState> {
  const user = await getAuthUser();

  if (!user?.email) {
    return { state: "anonymous" };
  }

  const customer = await getCustomerForUser();

  if (!customer) {
    return { state: "anonymous" };
  }

  if (isApprovedPro(customer)) {
    return { state: "approved", customer, user };
  }

  if (customer.proStatus === "PENDING") {
    return { state: "pending", customer, user };
  }

  if (customer.proStatus === "REJECTED") {
    return { state: "rejected", customer, user };
  }

  return { state: "eligible", customer, user };
}
