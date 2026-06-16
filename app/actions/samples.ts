"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSampleRequest } from "@/lib/sample-requests";
import {
  MAX_SAMPLE_BOX_SIZE,
  calculateSampleTotal,
  getSampleBoxPrice,
  type SampleBoxSize,
} from "@/lib/samples";
import { createClient } from "@/lib/supabase/server";

const shippingAddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  postalCode: z.string().min(5),
  country: z.string().default("US"),
});

const requestSamplesSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  shippingAddress: shippingAddressSchema,
  productIds: z.array(z.string().min(1)).min(1).max(MAX_SAMPLE_BOX_SIZE),
  boxSize: z.union([z.literal(3), z.literal(5)]).default(3),
  freeWithOrder: z.boolean().optional().default(false),
});

export type RequestSamplesInput = z.infer<typeof requestSamplesSchema>;

export type RequestSamplesResult =
  | { success: true; requestId: string; isPaid: false }
  | {
      success: false;
      requiresPayment: true;
      amount: number;
      boxPrice: number;
      boxSize: SampleBoxSize;
      sampleCount: number;
    }
  | {
      success: false;
      error:
        | "invalid_input"
        | "no_valid_products"
        | "server_error";
    };

export async function requestSamples(
  input: RequestSamplesInput,
): Promise<RequestSamplesResult> {
  const parsed = requestSamplesSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "invalid_input" };
  }

  const data = parsed.data;

  if (data.productIds.length > data.boxSize) {
    return { success: false, error: "invalid_input" };
  }

  const total = calculateSampleTotal(data.productIds.length, {
    freeWithOrder: data.freeWithOrder,
    boxSize: data.boxSize,
  });

  if (total > 0) {
    return {
      success: false,
      requiresPayment: true,
      amount: total,
      boxPrice: getSampleBoxPrice(data.boxSize),
      boxSize: data.boxSize,
      sampleCount: data.productIds.length,
    };
  }

  try {
    let customerId: string | undefined;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const customer = await prisma.customer.findUnique({
        where: { supabaseUserId: user.id },
        select: { id: true },
      });
      customerId = customer?.id;
    }

    const request = await createSampleRequest({
      email: data.email,
      name: data.name,
      shippingAddress: data.shippingAddress,
      productIds: data.productIds,
      boxSize: data.boxSize,
      customerId,
      isPaid: false,
    });

    return { success: true, requestId: request.id, isPaid: false };
  } catch {
    return { success: false, error: "server_error" };
  }
}
