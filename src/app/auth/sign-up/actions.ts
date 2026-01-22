"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  // Email confirmation ON -> user is not logged in yet.
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}
