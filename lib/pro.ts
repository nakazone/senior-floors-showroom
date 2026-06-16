import type { AccountType, ProStatus } from "@/types";
import {
  getCustomerOrders,
  getCustomerQuotes,
  getCustomerSampleRequests,
} from "@/lib/account";
import prisma from "@/lib/prisma";

export const PRO_DISCOUNT_BY_TYPE: Record<
  Exclude<AccountType, "RETAIL">,
  number
> = {
  CONTRACTOR: 35,
  DESIGNER: 25,
  BUILDER: 30,
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  RETAIL: "Retail",
  CONTRACTOR: "Contractor",
  DESIGNER: "Designer",
  BUILDER: "Builder",
};

export const PRO_PERKS_BY_TYPE: Record<
  Exclude<AccountType, "RETAIL">,
  string[]
> = {
  CONTRACTOR: [
    "Up to 35% off retail pricing",
    "Net-30 payment terms",
    "Dedicated account manager",
    "Priority fulfillment and delivery",
  ],
  DESIGNER: [
    "Designer discount program",
    "Unlimited sample requests",
    "Branded client presentations",
    "Project management dashboard",
  ],
  BUILDER: [
    "Custom spec packages",
    "Multi-unit volume pricing",
    "On-site delivery coordination",
    "White-label showroom option",
  ],
};

export function getDefaultProDiscount(
  accountType: Exclude<AccountType, "RETAIL">,
) {
  return PRO_DISCOUNT_BY_TYPE[accountType];
}

export function formatAccountType(accountType: AccountType) {
  return ACCOUNT_TYPE_LABELS[accountType];
}

export function isApprovedPro(customer: {
  accountType: AccountType;
  proStatus: ProStatus | null;
}) {
  return (
    customer.proStatus === "APPROVED" && customer.accountType !== "RETAIL"
  );
}

export function applyProDiscount(price: number, discountPercent: number) {
  if (discountPercent <= 0) return price;
  return price * (1 - discountPercent / 100);
}

export function getProDiscountPercent(customer: {
  proStatus: ProStatus | null;
  discountPercent: { toNumber?: () => number } | number | null;
}) {
  if (customer.proStatus !== "APPROVED") return 0;

  const raw =
    typeof customer.discountPercent === "number"
      ? customer.discountPercent
      : customer.discountPercent?.toNumber?.() ?? 0;

  return Number(raw) || 0;
}

export async function getProOverview(customerId: string) {
  const [orders, quotes, samples] = await Promise.all([
    getCustomerOrders(customerId),
    getCustomerQuotes(customerId),
    getCustomerSampleRequests(customerId),
  ]);

  const openQuotes = quotes.filter((quote) => quote.status === "OPEN").length;
  const activeOrders = orders.filter(
    (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED",
  ).length;
  const pendingSamples = samples.filter(
    (sample) => sample.status === "REQUESTED",
  ).length;

  return {
    orders: orders.slice(0, 3),
    quotes: quotes.slice(0, 3),
    samples: samples.slice(0, 3),
    stats: {
      totalOrders: orders.length,
      activeOrders,
      openQuotes,
      pendingSamples,
    },
  };
}

export async function getProProfile(customerId: string) {
  try {
    return await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        proStatus: true,
        discountPercent: true,
      },
    });
  } catch {
    return null;
  }
}
