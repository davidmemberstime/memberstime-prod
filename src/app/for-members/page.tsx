"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = { id: string; name: string; town?: string | null; region?: string | null; country?: string | null };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ForMembersPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [clubQuery, setClubQuery] = useState("");
  const [clubResults, setClubResults] = useState<ClubHit[]>([]);
  const [clubOpen, setClubOpen] = useState(false);
  const [homeClubName, setHomeClubName] = useState("");
  const [homeClubId, setHomeClubId] = useState<string | null>(null);

  const [handicap, setHandicap] = useState<string>("");
  const [cdhNumber, setCdhNumber] = useState("");

  const [fee1, setFee1] = useState<string>("25");
  const [fee2, setFee2] = useState<string>("40");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clubWrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!clubWrapRef.current?.contains(e.target as Node)) setClubOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const q = clubQuery.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (!q) {
      setClubResults([]);
      setClubOpen(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("club_directory")
        .select("id,name,town,region,country,is_active")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .order("name", { ascending: true })
        .limit(8);

      setClubResults((data as any[])?.map((x) => ({
        id: x.id,
        name: x.name,
        town: x.town,
        region: x.region,
        country: x.country,
      })) ?? []);
      setClubOpen(true);
    }, 220);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [clubQuery]);

  function pickClub(c: ClubHit) {
    setHomeClubName(c.name);
    setHomeClubId(c.id);
    setClubQuery(c.name);
    setClubOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = fullName.trim();
    const em = email.trim().toLowerCase();
    const ph = phone.trim();

    if (!name) return setError("Please enter your full name.");
    if (!em) return setError("Please enter your email.");
    if (!password || password.length < 8) return setError("Password must be at least 8 characters.");
    if (!clubQuery.trim()) return setError("Please enter your home club (start typing and select).");
    if (!fee1.trim() || isNaN(Number(fee1))) return setError("Enter a valid fee for 1 guest.");
    if (!fee2.trim() || isNaN(Number(fee2))) return setError("Enter a valid fee for 2 guests.");

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: em,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error("Sign up succeeded but no user id returned.");

      // Insert profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "host",
        verification_status: "pending",
        onboarding_complete: true,
        full_name: name,
        email: em,
        phone: ph || null,
        home_club_name: homeClubName || clubQuery.trim(),
        home_club_id: homeClubId,
        handicap: handicap.trim() ? Number(handicap) : null,
        cdh_number: cdhNumber.trim() || null,
        host_fee_1: Number(fee1),
        host_fee_2: Number(fee2),
        notes: notes.trim() || null,
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
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Club Member Registration</h1>
        <p className="mt-3 text-white/70">
          Members join free. Hosting is optional. We verify membership, standards and suitability to protect clubs.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="David Evans"
                />
              </Field>

              <Field label="Telephone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="07..."
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Minimum 8 characters"
                />
              </Field>
            </div>

            <div ref={clubWrapRef} className="relative">
              <Field label="Home club (start typing, then select)">
                <input
                  value={clubQuery}
                  onChange={(e) => {
                    setClubQuery(e.target.value);
                    setHomeClubName("");
                    setHomeClubId(null);
                  }}
                  onFocus={() => {
                    if (clubResults.length) setClubOpen(true);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="e.g. Royal St George’s"
                />
              </Field>

              {clubOpen && clubResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/95 shadow-2xl backdrop-blur">
                  {clubResults.map((c) => {
                    const meta = [c.town, c.region, c.country].filter(Boolean).join(", ");
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => pickClub(c)}
                        className="w-full px-4 py-3 text-left hover:bg-white/5"
                      >
                        <div className="text-sm text-white/90">{c.name}</div>
                        {meta ? <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/50">{meta}</div> : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Handicap (optional)">
                <input
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="e.g. 8.2"
                />
              </Field>

              <Field label="CDH number (optional)">
                <input
                  value={cdhNumber}
                  onChange={(e) => setCdhNumber(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="England Golf CDH"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Your host fee for 1 guest (GBP)">
                <input
                  value={fee1}
                  onChange={(e) => setFee1(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>

              <Field label="Your host fee for 2 guests (GBP)">
                <input
                  value={fee2}
                  onChange={(e) => setFee2(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                />
              </Field>
            </div>

            <Field label="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[110px] w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
                placeholder="Availability, preferred contact method, anything you want us to know."
              />
            </Field>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              By applying, you confirm you will host only in line with your club’s rules and you accept responsibility for guest conduct.
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cx(
                "w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                loading ? "bg-white/10 text-white/60" : "bg-[#d8b35a] text-[#041b14] hover:brightness-110"
              )}
            >
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/60">{label}</div>
      {children}
    </label>
  );
}
