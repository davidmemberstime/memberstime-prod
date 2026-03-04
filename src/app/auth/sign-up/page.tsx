"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Creating account…");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: "guest", // default role (we now use dedicated pages for members)
      });
    }

    setStatus("Account created. Check your email if confirmation is enabled.");
  }

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      <div className="mx-auto max-w-lg px-6 py-14">
        <h1 className="text-3xl font-semibold">Create your account</h1>

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
