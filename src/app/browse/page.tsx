"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";

type Tier = "Curated" | "Prestigious";

type ClubRow = {
  id: string;
  name: string;
  town: string | null;
  country: string;
  tier: Tier;
  guests_max: 1 | 2;
  clubhouse_contribution_gbp: number;
};

type Grouped = Record<
  string,
  {
    Prestigious: ClubRow[];
    Curated: ClubRow[];
  }
>;

function formatLocation(townRaw: string | null, countryRaw: string) {
  const town = (townRaw || "").trim();
  const country = (countryRaw || "").trim();

  if (!town && !country) return "";
  if (!town) return country;
  if (!country) return town;

  if (town.toLowerCase() === country.toLowerCase()) return country;

  return `${town}, ${country}`;
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("clubs")
        .select("id,name,town,country,tier,guests_max,clubhouse_contribution_gbp")
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

  const grouped = useMemo(() => {
    const g: Grouped = {};

    for (const c of clubs) {
      const country = (c.country || "Unknown").trim() || "Unknown";
      if (!g[country]) g[country] = { Prestigious: [], Curated: [] };

      const tier: Tier = c.tier === "Prestigious" ? "Prestigious" : "Curated";
      g[country][tier].push(c);
    }

    return g;
  }, [clubs]);

  const countries = useMemo(
    () => Object.keys(grouped).sort((a, b) => a.localeCompare(b)),
    [grouped]
  );

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Browse clubs</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Clubs grouped by country. Prestigious clubs are shown first, followed by curated selections.
        </p>

        {loading && <p className="mt-8 text-white/70">Loading clubs…</p>}
        {err && <p className="mt-8 text-red-300">{err}</p>}

        {!loading && !err && countries.length === 0 && (
          <p className="mt-8 text-white/70">No clubs found.</p>
        )}

        <div className="mt-10 space-y-12">
          {countries.map((country) => {
            const prestigious = grouped[country].Prestigious;
            const curated = grouped[country].Curated;

            return (
              <section key={country}>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-2xl font-semibold">{country}</h2>
                  <div className="text-sm text-white/60">
                    {prestigious.length + curated.length} clubs
                  </div>
                </div>

                {prestigious.length > 0 && (
                  <>
                    <div className="mb-3 text-sm font-semibold text-white/80">
                      Prestigious
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {prestigious.map((c) => (
                        <ClubCard key={c.id} c={c} />
                      ))}
                    </div>
                  </>
                )}

                {curated.length > 0 && (
                  <>
                    <div className="mt-8 mb-3 text-sm font-semibold text-white/80">
                      Curated
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {curated.map((c) => (
                        <ClubCard key={c.id} c={c} />
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function ClubCard({ c }: { c: ClubRow }) {
  const location = formatLocation(c.town, c.country);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{c.name}</div>
          {location && <div className="mt-1 text-sm text-white/70">{location}</div>}
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          {c.tier}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-white/70">Guests allowed</div>
          <div className="text-lg font-semibold">{c.guests_max}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-xs text-white/70">Clubhouse contribution</div>
          <div className="text-lg font-semibold">
            £{Number(c.clubhouse_contribution_gbp || 0).toLocaleString("en-GB")}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`/clubs/${encodeURIComponent(c.id)}`}
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
        >
          View club
        </a>

        <a
          href={`/search?clubId=${encodeURIComponent(c.id)}&clubName=${encodeURIComponent(
            c.name
          )}`}
          className="inline-flex rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
        >
          View hosts
        </a>
      </div>
    </div>
  );
}
