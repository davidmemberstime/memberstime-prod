"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";

type Tier = "Curated" | "Prestigious" | string;

type ClubRow = {
  id: string;
  name: string;
  town: string | null;
  region: string | null;
  country: string | null;
  tier: Tier;
  guests_max: number | null;
  clubhouse_contribution_gbp: number | null;
  hosts_count: number | null;
  is_active?: boolean | null;
  logo_url?: string | null;
};

function formatLocation(town: string | null, region: string | null, country: string | null) {
  const parts = [town, region, country]
    .map((x) => (x || "").trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) {
    if (!out.some((d) => d.toLowerCase() === p.toLowerCase())) out.push(p);
  }
  return out.join(", ");
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Match your screenshot controls
  const [country, setCountry] = useState<string>("England");
  const [listMode, setListMode] = useState<"Top 100" | "Top 200" | "Top 500" | "All">("Top 100");
  const [hideUnavailable, setHideUnavailable] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("club_directory")
        .select(
          "id,name,town,region,country,tier,guests_max,clubhouse_contribution_gbp,hosts_count,is_active,logo_url"
        )
        .order("hosts_count", { ascending: false })
        .order("tier", { ascending: false })
        .order("name", { ascending: true });

      if (!alive) return;

      if (error) {
        setErr(error.message);
        setClubs([]);
      } else {
        setClubs((data as ClubRow[]) || []);
      }

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const limit = useMemo(() => {
    if (listMode === "Top 100") return 100;
    if (listMode === "Top 200") return 200;
    if (listMode === "Top 500") return 500;
    return 999999;
  }, [listMode]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const c of clubs) {
      const v = (c.country || "").trim();
      if (v) set.add(v);
    }
    const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));
    // Put England first if present
    return ["England", ...sorted.filter((x) => x !== "England")];
  }, [clubs]);

  const filtered = useMemo(() => {
    let list = clubs;

    if (hideUnavailable) list = list.filter((c) => c.is_active !== false);

    // country filter (default England like your screenshot)
    list = list.filter((c) => (c.country || "").trim() === country);

    // Already ordered; just slice top N
    return list.slice(0, limit);
  }, [clubs, hideUnavailable, country, limit]);

  const heading = listMode === "All" ? "Browse clubs in" : `Browse ${listMode} in`;

  return (
    <main className="min-h-screen bg-[#071a14] text-white">
      <SiteHeader />

      {/* HERO like the reference */}
      <section className="relative">
        <div
          className="h-[260px] w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(7,26,20,.2), rgba(7,26,20,.95)), url('/hero-golf.jpg')",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10">
            <h1 className="text-4xl font-semibold tracking-tight">
              {heading} {country}
            </h1>
            <p className="mt-2 max-w-2xl text-white/70">
              A curated directory of private clubs available to Members Time guests.
            </p>

            {/* Filter bar (same “feel” as the screenshot) */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Country</span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0b221b] px-3 py-2 text-sm text-white outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">List</span>
                  <select
                    value={listMode}
                    onChange={(e) => setListMode(e.target.value as any)}
                    className="rounded-xl border border-white/10 bg-[#0b221b] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option>Top 100</option>
                    <option>Top 200</option>
                    <option>Top 500</option>
                    <option>All</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70">
                <span>Hide unavailable</span>
                <button
                  type="button"
                  onClick={() => setHideUnavailable((v) => !v)}
                  className={cx(
                    "relative h-6 w-11 rounded-full border border-white/10 transition",
                    hideUnavailable ? "bg-[#c58a3a]" : "bg-white/10"
                  )}
                >
                  <span
                    className={cx(
                      "absolute top-1 h-4 w-4 rounded-full bg-[#071a14] transition",
                      hideUnavailable ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading && <p className="text-white/70">Loading clubs…</p>}
        {err && <p className="text-red-300">{err}</p>}

        {!loading && !err && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-white/60">
              Showing <span className="text-white/80">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "club" : "clubs"}
            </div>
          </div>
        )}

        {!loading && !err && filtered.length === 0 && (
          <p className="text-white/70">No clubs found.</p>
        )}

        {!loading && !err && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((c) => (
              <ClubRowItem key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ClubRowItem({ c }: { c: ClubRow }) {
  const location = formatLocation(c.town, c.region, c.country);
  const hosts = Number(c.hosts_count || 0);
  const fee = Number(c.clubhouse_contribution_gbp || 0);
  const guests = c.guests_max ?? 2;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/7 sm:flex-row">
      {/* Left image block (like screenshot) */}
      <div className="relative h-40 w-full shrink-0 sm:h-[100px] sm:w-[170px]">
        {c.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
            <span className="text-xs">Club</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/25" />
      </div>

      {/* Middle */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-semibold text-white">{c.name}</div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/75">
              {c.tier === "Prestigious" ? "Prestigious" : "Curated"}
            </span>
          </div>

          <div className="mt-1 text-sm text-white/70">{location}</div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
            <span>Guests: {guests}</span>
            <span>Clubhouse contribution: £{fee.toLocaleString("en-GB")}</span>
          </div>
        </div>

        {/* Right (badge + CTA like screenshot) */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span className="font-semibold text-white/90">{hosts}</span> Verified Members
          </div>

          <a
            href={`/clubs/${encodeURIComponent(c.id)}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            View club
          </a>
        </div>
      </div>
    </div>
  );
}
