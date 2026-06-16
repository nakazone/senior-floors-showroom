"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getOrCreateCustomer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string };

export async function signIn(
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/account/orders");
}

export async function signUp(
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { success: false, error: "Check your details and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name ?? "",
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user?.email) {
    await getOrCreateCustomer(
      data.user.id,
      data.user.email,
      parsed.data.name,
    );
  }

  redirect("/account/orders");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/account/login");
}
