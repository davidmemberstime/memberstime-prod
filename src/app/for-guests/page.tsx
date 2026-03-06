"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ForGuestsPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [dob, setDob] = useState("");
  const [cdhNumber, setCdhNumber] = useState("");
  const [handicap, setHandicap] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayMaxDob = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  function getAgeFromDob(value: string) {
    const birth = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = fullName.trim();
    const em = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanCdh = cdhNumber.trim();
    const cleanHandicap = handicap.trim();
    const cleanDob = dob.trim();

    if (!name) return setError("Please enter your full name.");
    if (!em) return setError("Please enter your email.");
    if (!password || password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (!cleanDob) return setError("Please enter your date of birth.");
    if (!cleanCdh) return setError("Please enter your CDH number.");
    if (!cleanHandicap) return setError("Please enter your handicap.");

    const handicapNumber = Number(cleanHandicap);
    if (Number.isNaN(handicapNumber)) {
      return setError("Handicap must be a valid number.");
    }
    if (handicapNumber < 0 || handicapNumber > 54) {
      return setError("Handicap must be between 0 and 54.");
    }

    const age = getAgeFromDob(cleanDob);
    if (Number.isNaN(age) || age < 18) {
      return setError("Guests must be at least 18 years old.");
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: em,
          password,
          options: {
            data: { full_name: name },
          },
        });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error("Sign up succeeded but no user id returned.");

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "guest",
        verification_status: "pending",
        onboarding_complete: true,
        full_name: name,
        email: em,
        phone: cleanPhone || null,
        dob: cleanDob,
        cdh_number: cleanCdh,
        handicap: handicapNumber,
      });

      if (profileError) throw profileError;

      router.push("/pending");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Guest Registration
        </h1>
        <p className="mt-3 text-white/70">
          Guests are verified and accountable. This protects clubs, members, and
          the hosted experience.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name *">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>

              <Field label="Telephone (optional)">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email *">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>

              <Field label="Password *">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Minimum 8 characters"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Date of birth *">
                <input
                  type="date"
                  value={dob}
                  max={todayMaxDob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>

              <Field label="CDH number *">
                <input
                  value={cdhNumber}
                  onChange={(e) => setCdhNumber(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Required"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Handicap *">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="54"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Required"
                />
              </Field>

              <Field label="Age shown publicly">
                <div className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/70">
                  Your exact date of birth stays private. Members will only see
                  your age band.
                </div>
              </Field>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              You agree to be honest about ability and to respect pace of play,
              etiquette, staff and club culture. Poor conduct results in removal.
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
              {loading ? "Submitting…" : "Create guest profile"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/browse")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse clubs first
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">
        {label}
      </div>
      {children}
    </label>
  );
}
