"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Club = {
  id: string;
  name: string;
};

/**
 * Normalise club names so "Parkstone" and "Parkstone Golf Club" group together.
 * This suppresses area-name duplicates in autocomplete suggestions.
 */
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

function chooseBestCandidate(candidates: Club[]) {
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

export default function SearchClient() {
  const router = useRouter();

  const [clubs, setClubs] = useState<Club[]>([]);
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
        .select("id,name")
        .order("name", { ascending: true });

      if (error) setErr(error.message);
      setClubs(((data as Club[]) || []).filter((c) => c?.id && c?.name));
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

    const matches = clubs.filter((c) => c.name.toLowerCase().includes(q));

    const groups = new Map<string, Club[]>();
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

  return (
    <div ref={boxRef} className="relative w-full max-w-[520px]">
      <div className="flex items-center gap-3">
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
              router.push(
                `/search?clubId=${encodeURIComponent(
                  firstSuggestion.id
                )}&clubName=${encodeURIComponent(firstSuggestion.name)}`
              );
              setIsOpen(false);
            }
            if (e.key === "Escape") setIsOpen(false);
          }}
          placeholder="Search clubs"
          className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/50 backdrop-blur outline-none focus:border-white/30 focus:ring-2 focus:ring-white/15"
        />
        <button
          type="button"
          className="shrink-0 rounded-xl bg-[#d8b35a] px-4 py-3 text-sm font-semibold text-[#041b14] hover:brightness-110"
          onClick={() => {
            if (!firstSuggestion) return;
            router.push(
              `/search?clubId=${encodeURIComponent(
                firstSuggestion.id
              )}&clubName=${encodeURIComponent(firstSuggestion.name)}`
            );
            setIsOpen(false);
          }}
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-white/60">Loading clubs…</p>
      )}
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#071e17]/95 shadow-2xl backdrop-blur">
          {suggestions.map((club) => (
            <Link
              key={club.id}
              href={`/search?clubId=${encodeURIComponent(
                club.id
              )}&clubName=${encodeURIComponent(club.name)}`}
              className="block px-4 py-3 text-sm text-white/85 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              {club.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
