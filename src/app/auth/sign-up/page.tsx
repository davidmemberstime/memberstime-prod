"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const sp = useSearchParams();
  const role = sp.get("role") === "member" ? "member" : "guest";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Creating account…");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });

    if (error) return setStatus(error.message);

    if (data.user) {
      const { error: pErr } = await supabase.from("profiles").insert({
        id: data.user.id,
        role
      });

      if (pErr) return setStatus(`Account created but profile failed: ${pErr.message}`);
    }

    setStatus("Account created. Check your email for a confirmation link.");
  }

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-white/70">
          Signing up as: <span className="font-semibold text-white">{role}</span>
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2a1f] px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2a1f] px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button className="w-full rounded-xl bg-[#c58a3a] px-4 py-3 font-semibold text-[#0b2a1f] hover:brightness-110">
            Create account
          </button>

          {status && <p className="text-sm text-white/70">{status}</p>}
        </form>
      </div>
    </main>
  );
}
