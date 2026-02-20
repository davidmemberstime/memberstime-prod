"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
        .order("tier", { ascending: false })
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
    return arr.includes("England")
      ? ["England", ...arr.filter((x) => x !== "England")]
      : arr;
  }, [clubs]);

  useEffect(() => {
    if (!countries.length) return;
    if (!countries.includes(country)) setCountry(countries[0]);
  }, [countries]);

  const filtered = useMemo(() => {
    let list = clubs.filter((c) => (c.country || "Unknown") === country);

    if (hideUnavailable) {
      list = list.filter((c) => (c.hosts_count ?? 0) > 0);
    }

    const prestigious = list.filter((c) => c.tier === "Prestigious");
    const curated = list.filter((c) => c.tier !== "Prestigious");

    let merged = [...prestigious, ...curated];

    if (limitMode === "top100") merged = merged.slice(0, 100);

    return { merged };
  }, [clubs, country, hideUnavailable, limitMode]);

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[240px] w-full md:h-[280px]">
          <Image
            src="/hero/browse-hero.jpg"
            alt="Members Time"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-[#0b221b]" />
        </div>

        <div className="mx-auto -mt-24 max-w-6xl px-4 pb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Browse clubs
            </h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Explore top private clubs available to Members Time guests.
            </p>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        {loading && <p className="mt-8 text-white/70">Loading clubs…</p>}
        {err && <p className="mt-8 text-red-300">{err}</p>}

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

function ClubRowListItem({ c, isFirst }: { c: ClubRow; isFirst: boolean }) {
  const location = formatLocation(c.town, c.region);

  return (
    <div
      className={cx(
        "flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6",
        !isFirst && "border-t border-white/10"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <Image
            src="/hero/club-thumb.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div>
          <div className="text-base font-semibold">{c.name}</div>
          <div className="text-sm text-white/65">
            {location || c.country}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={`/clubs/${encodeURIComponent(c.id)}`}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          View Club
        </a>

        <a
          href={`/search?clubId=${encodeURIComponent(c.id)}`}
          className="rounded-full bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
        >
          View Hosts
        </a>
      </div>
    </div>
  );
}
