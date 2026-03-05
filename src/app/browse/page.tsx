"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ClubRow = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  tier: "Curated" | "Prestigious";
  guests_max: 1 | 2;
  clubhouse_contribution_gbp: number;
  hosts_count: number;
};

function formatLocation(region: string | null, country: string | null) {
  const r = (region || "").trim();
  const c = (country || "").trim();
  if (r && c) return `${r}, ${c}`;
  return r || c || "";
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("club_directory")
        .select(
          "id,name,region,country,tier,guests_max,clubhouse_contribution_gbp,hosts_count"
        )
        .order("hosts_count", { ascending: false })
        .order("name", { ascending: true });

      if (error) setErr(error.message);
      else setClubs((data as ClubRow[]) || []);

      setLoading(false);
    }

    load();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return clubs
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, clubs]);

  const firstSuggestion = suggestions[0];

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      {/* HERO */}
      <section className="relative w-full overflow-hidden border-b border-white/10">
        <div className="relative h-[340px] w-full">
          {/* ✅ MUST exist at /public/home-hero.jpg */}
          <Image
            src="/home-hero.jpg"
            alt="Members Time"
            fill
            priority
            className="object-cover brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto w-full max-w-7xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Browse clubs
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-white/70">
              A curated UK list of verified member hosts at prestigious golf clubs.
            </p>

            {/* SEARCH ROW */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div ref={boxRef} className="relative w-[360px] max-w-full">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && firstSuggestion) {
                      e.preventDefault();
                      window.location.href = `/search?clubId=${encodeURIComponent(
                        firstSuggestion.id
                      )}&clubName=${encodeURIComponent(firstSuggestion.name)}`;
                    }
                    if (e.key === "Escape") setIsOpen(false);
                  }}
                  placeholder="Search clubs"
                  className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm backdrop-blur outline-none focus:border-white/40"
                />

                {/* ✅ Dropdown uses normal links so clicking ALWAYS works */}
                {isOpen && suggestions.length > 0 && (
                  <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b2a1f] shadow-2xl">
                    {suggestions.map((club) => (
                      <a
                        key={club.id}
                        href={`/search?clubId=${encodeURIComponent(
                          club.id
                        )}&clubName=${encodeURIComponent(club.name)}`}
                        className="block w-full px-4 py-3 text-left hover:bg-white/10"
                      >
                        <div className="text-sm font-medium">{club.name}</div>
                        <div className="text-xs text-white/55">
                          {formatLocation(club.region, club.country)}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
                All locations
              </button>

              <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
                Sort by Recommended
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CLUB GRID (pulled up closer to hero) */}
      <div className="mx-auto max-w-7xl px-6 -mt-10 pb-12">
        {loading && <p className="text-white/70">Loading clubs…</p>}
        {err && <p className="text-red-400">{err}</p>}

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {clubs.map((c) => {
            const location = formatLocation(c.region, c.country);

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition"
              >
                <div className="text-lg font-semibold">{c.name}</div>
                <div className="mt-1 text-sm text-white/70">{location}</div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-white/60 text-xs">Hosts</div>
                    <div className="font-semibold">{c.hosts_count}</div>
                  </div>

                  <div>
                    <div className="text-white/60 text-xs">Contribution</div>
                    <div className="font-semibold">
                      £
                      {Number(c.clubhouse_contribution_gbp || 0).toLocaleString(
                        "en-GB"
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={`/search?clubId=${encodeURIComponent(
                    c.id
                  )}&clubName=${encodeURIComponent(c.name)}`}
                  className="mt-5 block w-full text-center rounded-xl bg-[#d8b35a] px-4 py-2 text-sm font-semibold text-[#041b14] hover:brightness-110"
                >
                  View hosts
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
