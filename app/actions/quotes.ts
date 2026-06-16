"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { getOrCreateCustomer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const createQuoteSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  sqFt: z.number().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

export type CreateQuoteResult =
  | { success: true; quoteId: string }
  | { success: false; error: "sign_in_required" | "invalid_input" | "server_error" };

export async function createQuote(
  input: CreateQuoteInput,
): Promise<CreateQuoteResult> {
  const parsed = createQuoteSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "invalid_input" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return { success: false, error: "sign_in_required" };
    }

    const customer = await getOrCreateCustomer(
      user.id,
      user.email,
      user.user_metadata?.full_name,
    );

    const data = parsed.data;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const quote = await prisma.quote.create({
      data: {
        customerId: customer.id,
        totalEstimate: data.totalPrice,
        expiresAt,
        items: {
          products: [
            {
              productId: data.productId,
              slug: data.slug,
              name: data.name,
              sqFt: data.sqFt,
              unitPrice: data.unitPrice,
              totalPrice: data.totalPrice,
              dimensions: {
                length: data.length,
                width: data.width,
                wasteFactor: 0.1,
              },
            },
          ],
          calculatedAt: new Date().toISOString(),
        },
      },
    });

    return { success: true, quoteId: quote.id };
  } catch {
    return { success: false, error: "server_error" };
  }
}
