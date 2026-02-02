"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";

type Tier = "Curated" | "Prestigious";

type ClubRow = {
  id: string;
  name: string;
  town: string | null;
  region: string | null;
  country: string;
  tier: Tier;
  guests_max: 1 | 2;
  clubhouse_contribution_gbp: number;
  hosts_count: number;
  is_active?: boolean | null;
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function formatLocation(townRaw: string | null, regionRaw: string | null) {
  const town = (townRaw || "").trim();
  const region = (regionRaw || "").trim();
  if (!town && !region) return "";
  if (!town) return region;
  if (!region) return town;
  if (town.toLowerCase() === region.toLowerCase()) return region;
  return `${town}, ${region}`;
}

function currencyGBP(n: number) {
  return `£${Number(n || 0).toLocaleString("en-GB")}`;
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI controls
  const [country, setCountry] = useState<string>("England");
  const [limitMode, setLimitMode] = useState<"top100" | "all">("top100");
  const [hideUnavailable, setHideUnavailable] = useState<boolean>(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("club_directory")
        .select(
          "id,name,town,region,country,tier,guests_max,clubhouse_contribution_gbp,hosts_count,is_active"
        )
        .eq("is_active", true)
        .order("tier", { ascending: false }) // Prestigious before Curated (alphabetically works too, but keep stable)
        .order("hosts_count", { ascending: false })
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
    for (const c of clubs) set.add((c.country || "Unknown").trim() || "Unknown");
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
    // keep England first if it exists (matches your reference)
    return arr.includes("England")
      ? ["England", ...arr.filter((x) => x !== "England")]
      : arr;
  }, [clubs]);

  // If England isn't present, fallback to first country
  useEffect(() => {
    if (!countries.length) return;
    if (!countries.includes(country)) setCountry(countries[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries.join("|")]);

  const filtered = useMemo(() => {
    let list = clubs.filter((c) => (c.country || "Unknown") === country);

    if (hideUnavailable) {
      list = list.filter((c) => (c.hosts_count ?? 0) > 0);
    }

    // Split by tier to match “Prestigious then Curated”
    const prestigious = list
      .filter((c) => c.tier === "Prestigious")
      .sort((a, b) => (b.hosts_count ?? 0) - (a.hosts_count ?? 0) || a.name.localeCompare(b.name));

    const curated = list
      .filter((c) => c.tier !== "Prestigious")
      .sort((a, b) => (b.hosts_count ?? 0) - (a.hosts_count ?? 0) || a.name.localeCompare(b.name));

    let merged = [...prestigious, ...curated];

    if (limitMode === "top100") merged = merged.slice(0, 100);

    return { prestigious, curated, merged, totalInCountry: list.length };
  }, [clubs, country, hideUnavailable, limitMode]);

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      <SiteHeader />

      {/* HERO (like your reference image) */}
      <section className="relative">
        <div className="relative h-[240px] w-full md:h-[280px]">
          {/* If you later upload a hero image, change src to "/hero/browse-hero.jpg" */}
          <Image
            src="/hero/browse-hero.jpg"
            alt="Members Time"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // fallback: no hero image yet, keep background
              const img = e.currentTarget as unknown as HTMLImageElement;
              img.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#0b221b]" />
        </div>

        <div className="mx-auto -mt-24 max-w-6xl px-4 pb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Browse clubs
            </h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Explore top private clubs available to Members Time guests. Prestigious clubs shown first.
            </p>

            {/* Controls row (matches your reference controls) */}
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={country}
                  onChange={setCountry}
                  options={countries.map((c) => ({ value: c, label: c }))}
                />
                <Select
                  value={limitMode}
                  onChange={(v) => setLimitMode(v as "top100" | "all")}
                  options={[
                    { value: "top100", label: "Top 100" },
                    { value: "all", label: "All clubs" },
                  ]}
                />
              </div>

              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-sm text-white/60">
                  {limitMode === "top100" ? "Showing top 100" : "Showing all"} •{" "}
                  {filtered.merged.length} clubs
                </div>

                <label className="flex items-center gap-2 text-sm text-white/80">
                  <span>Hide unavailable</span>
                  <button
                    type="button"
                    onClick={() => setHideUnavailable((s) => !s)}
                    className={cx(
                      "relative h-6 w-11 rounded-full border border-white/15 transition",
                      hideUnavailable ? "bg-[#c58a3a]" : "bg-white/10"
                    )}
                    aria-pressed={hideUnavailable}
                  >
                    <span
                      className={cx(
                        "absolute top-1 h-4 w-4 rounded-full bg-white transition",
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

      {/* LIST */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {loading && <p className="mt-8 text-white/70">Loading clubs…</p>}
        {err && <p className="mt-8 text-red-300">{err}</p>}

        {!loading && !err && filtered.merged.length === 0 && (
          <p className="mt-8 text-white/70">No clubs found.</p>
        )}

        {!loading && !err && filtered.merged.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {filtered.merged.map((c, idx) => (
              <ClubRowListItem key={c.id} c={c} isFirst={idx === 0} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-white outline-none hover:bg-white/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-black">
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
        ▾
      </span>
    </div>
  );
}

function ClubRowListItem({ c, isFirst }: { c: ClubRow; isFirst: boolean }) {
  const location = formatLocation(c.town, c.region);

  return (
    <div
      className={cx(
        "flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6",
        !isFirst && "border-t border-white/10"
      )}
    >
      {/* Left: thumbnail + name */}
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {/* Optional: later swap to per-club images if you add them */}
          <Image
            src="/hero/club-thumb.jpg"
            alt=""
            fill
            className="object-cover"
            onError={(e) => {
              const img = e.currentTarget as unknown as HTMLImageElement;
              img.style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-white">
            {c.name}
          </div>
          <div className="mt-0.5 text-sm text-white/65">
            {location || c.country}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {c.tier}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              Guests: {c.guests_max}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
              Contribution: {currencyGBP(c.clubhouse_contribution_gbp)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: verified members + button */}
      <div className="flex flex-col gap-2 md:items-end">
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">
            {c.hosts_count ?? 0}
          </span>{" "}
          Verified Members
        </div>

        <div className="flex gap-2">
          <a
            href={`/clubs/${encodeURIComponent(c.id)}`}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            View Club
          </a>

          <a
            href={`/search?clubId=${encodeURIComponent(c.id)}&clubName=${encodeURIComponent(
              c.name
            )}`}
            className="inline-flex items-center justify-center rounded-full bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            View Hosts
          </a>
        </div>
      </div>
    </div>
  );
}
