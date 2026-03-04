"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function routeAfterLogin(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("verification_status,onboarding_complete")
      .eq("id", userId)
      .single();

    if (!profile) {
      router.replace("/complete-profile");
      return;
    }

    if (!profile.onboarding_complete) {
      router.replace("/complete-profile");
      return;
    }

    if (profile.verification_status === "verified") {
      router.replace("/browse");
      return;
    }

    router.replace("/pending");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword(
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (signInError) throw signInError;

      const userId = data.user?.id;
      if (!userId) throw new Error("Sign in succeeded but no user returned.");

      await routeAfterLogin(userId);
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      <div className="mx-auto max-w-xl px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-3 text-white/70">Sign in to continue.</p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">
                Password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={cx(
                "w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                loading
                  ? "bg-white/10 text-white/60"
                  : "bg-[#d8b35a] text-[#041b14] hover:brightness-110"
              )}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            <Link
              href="/for-members"
              className="text-sm text-white/70 hover:text-white"
            >
              I’m a club member (apply to host)
            </Link>
            <Link
              href="/for-guests"
              className="text-sm text-white/70 hover:text-white"
            >
              I’m a guest (create a guest profile)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
