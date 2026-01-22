"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData): Promise<void> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const email = String(rawEmail ?? "")
    .trim()
    .replace(/\u00A0/g, " ")         // non-breaking spaces
    .replace(/^"+|"+$/g, "");        // strips accidental quotes if present

  const password = String(rawPassword ?? "").trim();

  if (!email) redirect(`/auth/sign-up?error=${encodeURIComponent("Email is required")}`);
  if (!password) redirect(`/auth/sign-up?error=${encodeURIComponent("Password is required")}`);

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/browse");
}
