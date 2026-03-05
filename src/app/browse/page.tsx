"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Tier = "Curated" | "Prestigious";

type ClubRow = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  tier: Tier | null;
  guests_max: number | null;
  clubhouse_contribution_gbp: number | null;
  host_profiles?: { count: number }[] | null;
};

function formatLocation(region: string | null, country: string | null) {
  const r = (region || "").trim();
  const c = (country || "").trim();
  if (r && c) return `${r}, ${c}`;
  return r || c || "";
}

function normaliseClubKey(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/&/g, " and ")
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\bthe\b/g, " ")
      .replace(/\bgolf\s*&\s*country\s*club\b/g, " ")
      .replace(/\bgolf\s*and\s*country\s*club\b/g, " ")
      .replace(/\bcountry\s*club\b/g, " ")
      .replace(/\bgolf\s*club\b/g, " ")
      .replace(/\bgolf\b/g, " ")
      .replace(/\bg\.?\s*c\.?\b/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function chooseBestCandidate(candidates: ClubRow[]) {
  const score = (n: string) => {
    const s = n.toLowerCase();
    let pts = 0;
    if (/\bgolf\s*club\b/.test(s)) pts += 50;
    else if (/\bgolf\b/.test(s)) pts += 30;
    if (/\bg\.?\s*c\.?\b/.test(s)) pts += 20;
    pts += Math.min(n.length, 60);
    return pts;
  };

  return [...candidates].sort((a, b) => score(b.name) - score(a.name))[0];
}

const COUNTRY_OPTIONS = [
  "All locations",
  "England",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "Ireland",
];

type Mode = "recommended" | "all" | "curated";

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [countryFilter, setCountryFilter] = useState<string>("All locations");
  const [mode, setMode] = useState<Mode>("recommended"); // default: Prestigious
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const countryBoxRef = useRef<HTMLDivElement | null>(null);
  const modeBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("clubs")
        .select(
          `
          id,
          name,
          region,
          country,
          tier,
          guests_max,
          clubhouse_contribution_gbp,
          host_profiles(count)
        `
        )
        .order("name", { ascending: true });

      if (error) setErr(error.message);
      else setClubs((data as ClubRow[]) || []);

      setLoading(false);
    }

    load();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;

      if (searchBoxRef.current && !searchBoxRef.current.contains(t)) {
        setIsOpen(false);
      }
      if (countryBoxRef.current && !countryBoxRef.current.contains(t)) {
        setCountryMenuOpen(false);
      }
      if (modeBoxRef.current && !modeBoxRef.current.contains(t)) {
        setModeMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches = clubs.filter((c) => c.name.toLowerCase().includes(q));

    const groups = new Map<string, ClubRow[]>();
    for (const m of matches) {
      const key = normaliseClubKey(m.name) || m.name.toLowerCase();
      const arr = groups.get(key);
      if (arr) arr.push(m);
      else groups.set(key, [m]);
    }

    const deduped = Array.from(groups.values()).map(chooseBestCandidate);
    deduped.sort((a, b) => a.name.localeCompare(b.name));

    return deduped.slice(0, 8);
  }, [query, clubs]);

  const firstSuggestion = suggestions[0];

  const filteredClubs = useMemo(() => {
    let list = clubs;

    // Mode filter
    if (mode === "recommended") {
      list = list.filter((c) => c.tier === "Prestigious");
    } else if (mode === "curated") {
      list = list.filter((c) => c.tier === "Curated");
    }

    // Country filter
    if (countryFilter !== "All locations") {
      const target = countryFilter.toLowerCase();
      list = list.filter((c) => (c.country || "").toLowerCase() === target);
    }

    // Sort: recommended should feel alive => hosts desc then name
    const hostCount = (c: ClubRow) => c.host_profiles?.[0]?.count ?? 0;

    list = [...list].sort((a, b) => {
      if (mode === "recommended") {
        const ha = hostCount(a);
        const hb = hostCount(b);
        if (hb !== ha) return hb - ha;
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [clubs, mode, countryFilter]);

  const modeLabel =
    mode === "recommended"
      ? "Sort by Recommended"
      : mode === "all"
      ? "All clubs"
      : "Curated only";

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      {/* HERO */}
      <section className="relative w-full overflow-hidden border-b border-white/10">
        <div className="relative h-[340px] w-full">
          <Image
            src="/home-hero.jpg"
            alt="Members Time"
            fill
            priority
            className="object-cover brightness-[0.82]"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto w-full max-w-7xl px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Browse clubs
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-white/70">
              A curated UK list of verified member hosts at prestigious golf
              clubs.
            </p>

            {/* SEARCH + FILTER ROW */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {/* Search */}
              <div ref={searchBoxRef} className="relative w-[360px] max-w-full">
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
                      window.location.href = `/clubs/${encodeURIComponent(
                        firstSuggestion.id
                      )}`;
                    }
                    if (e.key === "Escape") setIsOpen(false);
                  }}
                  placeholder="Search clubs"
                  className="w-full rounded-xl border border-white/20 bg-black/35 px-4 py-3 text-sm backdrop-blur outline-none focus:border-white/40"
                />

                {isOpen && suggestions.length > 0 && (
                  <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b2a1f] shadow-2xl">
                    {suggestions.map((club) => (
                      <a
                        key={club.id}
                        href={`/clubs/${encodeURIComponent(club.id)}`}
                        className="block w-full px-4 py-3 text-left hover:bg-white/10"
                      >
                        <div className="text-sm font-medium">{club.name}</div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* All locations dropdown */}
              <div ref={countryBoxRef} className="relative">
                <button
                  onClick={() => {
                    setCountryMenuOpen((v) => !v);
                    setModeMenuOpen(false);
                  }}
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10"
                >
                  {countryFilter}
                </button>

                {countryMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#0b2a1f] shadow-2xl">
                    {COUNTRY_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountryFilter(c);
                          setCountryMenuOpen(false);
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm hover:bg-white/10 ${
                          c === countryFilter ? "bg-white/10" : ""
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended dropdown */}
              <div ref={modeBoxRef} className="relative">
                <button
                  onClick={() => {
                    setModeMenuOpen((v) => !v);
                    setCountryMenuOpen(false);
                  }}
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10"
                >
                  {modeLabel}
                </button>

                {modeMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#0b2a1f] shadow-2xl">
                    <button
                      onClick={() => {
                        setMode("recommended");
                        setModeMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm hover:bg-white/10 ${
                        mode === "recommended" ? "bg-white/10" : ""
                      }`}
                    >
                      Recommended (Prestigious)
                    </button>

                    <button
                      onClick={() => {
                        setMode("all");
                        setModeMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm hover:bg-white/10 ${
                        mode === "all" ? "bg-white/10" : ""
                      }`}
                    >
                      All clubs
                    </button>

                    <button
                      onClick={() => {
                        setMode("curated");
                        setModeMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm hover:bg-white/10 ${
                        mode === "curated" ? "bg-white/10" : ""
                      }`}
                    >
                      Curated only
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Small status line */}
            <p className="mt-4 text-xs text-white/55">
              Showing{" "}
              <span className="text-white/80 font-semibold">
                {filteredClubs.length}
              </span>{" "}
              clubs
              {mode === "recommended" ? " (Prestigious)" : ""}
              {countryFilter !== "All locations" ? ` in ${countryFilter}` : ""}.
            </p>
          </div>
        </div>
      </section>

      {/* CLUB GRID */}
      <div className="mx-auto max-w-7xl px-6 -mt-10 pb-12">
        {loading && <p className="text-white/70">Loading clubs…</p>}
        {err && <p className="text-red-400">{err}</p>}

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredClubs.map((c) => {
            const location = formatLocation(c.region, c.country);
            const hostsAvailable = c.host_profiles?.[0]?.count;

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition"
              >
                <div className="text-lg font-semibold">{c.name}</div>
                <div className="mt-1 text-sm text-white/70">{location}</div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-white/80">
                    👤{" "}
                    <span className="font-semibold">
                      {typeof hostsAvailable === "number"
                        ? hostsAvailable
                        : "—"}
                    </span>{" "}
                    hosts available
                  </div>

                  <div className="text-white/80">
                    <div className="text-white/60 text-xs">Contribution</div>
                    <div className="font-semibold">£20</div>
                  </div>
                </div>

                <a
                  href={`/clubs/${encodeURIComponent(c.id)}`}
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
