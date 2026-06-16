"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthUser, getOrCreateCustomer } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getDefaultProDiscount } from "@/lib/pro";

const applicationSchema = z.object({
  accountType: z.enum(["CONTRACTOR", "DESIGNER", "BUILDER"]),
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  phone: z.string().min(10),
  licenseNumber: z.string().optional(),
  projectVolume: z.string().optional(),
  notes: z.string().optional(),
});

export type ProActionResult =
  | { success: true }
  | {
      success: false;
      error:
        | "sign_in_required"
        | "application_pending"
        | "already_approved"
        | "invalid_input"
        | "server_error";
    };

export async function submitProApplication(
  formData: FormData,
): Promise<ProActionResult> {
  const user = await getAuthUser();

  if (!user?.email) {
    return { success: false, error: "sign_in_required" };
  }

  const customer = await getOrCreateCustomer(
    user.id,
    user.email,
    user.user_metadata?.full_name,
  );

  if (customer.proStatus === "APPROVED" && customer.accountType !== "RETAIL") {
    redirect("/pro/dashboard");
  }

  if (customer.proStatus === "PENDING") {
    return { success: false, error: "application_pending" };
  }

  const parsed = applicationSchema.safeParse({
    accountType: formData.get("accountType"),
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    phone: formData.get("phone"),
    licenseNumber: formData.get("licenseNumber") || undefined,
    projectVolume: formData.get("projectVolume") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "invalid_input" };
  }

  const discountPercent = getDefaultProDiscount(parsed.data.accountType);
  const autoApprove = process.env.PRO_AUTO_APPROVE === "true";
  const nextStatus = autoApprove ? "APPROVED" : "PENDING";

  try {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        accountType: parsed.data.accountType,
        name: parsed.data.contactName,
        phone: parsed.data.phone,
        proStatus: nextStatus,
        discountPercent,
      },
    });
  } catch {
    return { success: false, error: "server_error" };
  }

  if (autoApprove) {
    redirect("/pro/dashboard");
  }

  return { success: true };
}
