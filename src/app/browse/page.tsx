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
  guests_max: 1 | 2 | null;
  clubhouse_contribution_gbp: number | null;
  hosts_count: number | null;
  is_active?: boolean | null;

  // view might already include these (because you selected c.* in the view)
  logo_url?: string | null;
};

function formatLocation(townRaw: string | null, regionRaw: string | null, countryRaw: string | null) {
  const town = (townRaw || "").trim();
  const region = (regionRaw || "").trim();
  const country = (countryRaw || "").trim();

  const parts = [town, region, country].filter(Boolean);

  // Avoid duplicates like "England, England"
  const deduped: string[] = [];
  for (const p of parts) {
    if (!deduped.some((d) => d.toLowerCase() === p.toLowerCase())) deduped.push(p);
  }

  return deduped.join(", ");
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI controls (match inspiration)
  const [country, setCountry] = useState<string>("All");
  const [limit, setLimit] = useState<number>(100);
  const [hideUnavailable, setHideUnavailable] = useState<boolean>(true);

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
        .order("country", { ascending: true })
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

  const countries = useMemo(() => {
    const set = new Set<string>();
    for (const c of clubs) {
      const v = (c.country || "").trim();
      if (v) set.add(v);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [clubs]);

  const filtered = useMemo(() => {
    let list = clubs;

    if (hideUnavailable) {
      list = list.filter((c) => c.is_active !== false); // treat null as active unless explicitly false
    }

    if (country !== "All") {
      list = list.filter((c) => (c.country || "").trim() === country);
    }

    // Keep order already sorted by hosts_count desc etc, just slice top N
    list = list.slice(0, limit);

    return list;
  }, [clubs, country, limit, hideUnavailable]);

  const titleCountry = country === "All" ? "the UK" : country;

  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* HERO (matches your inspiration layout) */}
      <section className="relative border-b border-white/10">
        {/* Background image (swap this URL later to your real hero image) */}
        <div
          className="h-[260px] w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(7,20,16,.15), rgba(7,20,16,.85)), url('/hero-golf.jpg')",
          }}
        />
        <div className="absolute inset-0">
          <div className="mx-auto max-w-6xl px-4">
            <div className="pt-16">
              <h1 className="text-4xl font-semibold tracking-tight text-white">
                Browse top {limit === 9999 ? "clubs" : limit} in {titleCountry}
              </h1>
              <p className="mt-2 max-w-2xl text-white/70">
                Explore a selection of private clubs available to Members Time guests.
              </p>

              {/* Filter bar */}
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
                    <span className="text-sm text-white/70">Show</span>
                    <select
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="rounded-xl border border-white/10 bg-[#0b221b] px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value={50}>Top 50</option>
                      <option value={100}>Top 100</option>
                      <option value={200}>Top 200</option>
                      <option value={500}>Top 500</option>
                      <option value={9999}>All</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-sm text-white/70">
                  <span>Hide Unavailable</span>
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
                        "absolute top-1 h-4 w-4 rounded-full bg-[#0b2a1f] transition",
                        hideUnavailable ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading && <p className="text-white/70">Loading clubs…</p>}
        {err && <p className="text-red-300">{err}</p>}

        {!loading && !err && filtered.length === 0 && (
          <p className="text-white/70">No clubs found.</p>
        )}

        {!loading && !err && filtered.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-white/60">
                Showing <span className="text-white/80">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "club" : "clubs"}
              </div>
            </div>

            {/* Premium list (like your inspiration) */}
            <div className="space-y-3">
              {filtered.map((c) => (
                <ClubRowItem key={c.id} c={c} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ClubRowItem({ c }: { c: ClubRow }) {
  const location = formatLocation(c.town, c.region, c.country);
  const hosts = Number(c.hosts_count || 0);
  const fee = Number(c.clubhouse_contribution_gbp || 0);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:flex-row">
      {/* Image */}
      <div className="relative h-36 w-full shrink-0 sm:h-[92px] sm:w-[160px]">
        {c.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.logo_url}
            alt={`${c.name} logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
            <span className="text-xs">Club</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/20" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold text-white">
              {c.name}
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
              {c.tier === "Prestigious" ? "Prestigious" : "Curated"}
            </span>
          </div>

          <div className="mt-1 text-sm text-white/70">{location}</div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
            <span>Guests: {c.guests_max ?? 2}</span>
            <span>Clubhouse contribution: £{fee.toLocaleString("en-GB")}</span>
          </div>
        </div>

        {/* Right side (verified members + CTA like your inspiration) */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span className="font-semibold text-white/90">{hosts}</span>{" "}
            Verified Members
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
