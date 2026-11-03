"use client";

import { useEffect, useState } from "react";
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
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  async function routeAfterLogin(userId: string) {
    const { data: application, error: applicationError } = await supabase
      .from("membership_applications")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (applicationError) {
      setError("Unable to check your membership. Please try again.");
      return;
    }
    if (!application) {
      router.replace("/apply");
      return;
    }
    if (application.status === "approved") {
      const { data: entitlement, error: entitlementError } = await supabase
        .from("membership_entitlements")
        .select("membership_status,subscription_status,access_expires_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (entitlementError) {
        setError("Unable to check your membership access. Please try again.");
        return;
      }
      const active = entitlement?.membership_status === "active"
        && ["active", "trialing"].includes(entitlement.subscription_status)
        && (!entitlement.access_expires_at || new Date(entitlement.access_expires_at).getTime() > Date.now());
      router.replace(active ? "/exchange/dashboard" : "/exchange");
      return;
    }
    router.replace("/exchange");
  }

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({data}) => {
      if (mounted && data.session?.user?.id) {
        void routeAfterLogin(data.session.user.id);
      }
    });
    return () => { mounted = false; };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
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

  async function onForgotPassword() {
    setError(null);
    setResetMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address first.");
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth/check-email`,
      });

      if (error) throw error;

      setResetMessage(
        "Password reset email sent. Please check your inbox."
      );
    } catch (err: any) {
      setError(err?.message ?? "Unable to send reset email.");
    } finally {
      setResetLoading(false);
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

          {resetMessage && (
            <div className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {resetMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">
                Email
              </div>
              <input
                type="email"
                autoComplete="email"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/60">Your login stays saved on this website unless you sign out or your browser clears its data.</span>

              <button
                type="button"
                onClick={onForgotPassword}
                disabled={resetLoading}
                className="text-sm text-white/70 hover:text-white disabled:opacity-50"
              >
                {resetLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>

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
              href="/auth/sign-up"
              className="text-sm text-white/70 hover:text-white"
            >
              Create an account to apply
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
