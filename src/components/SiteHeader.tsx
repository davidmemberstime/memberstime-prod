"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  tier: "Curated" | "Prestigious" | string;
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClubHit[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  const nav = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/browse", label: "Clubs" },
      { href: "/search", label: "Member search" },
      { href: "/how-it-works", label: "How it works" },
    ],
    []
  );

  // Close search on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Live search (debounced)
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("club_directory")
        .select("id,name,region,country,tier")
        .ilike("name", `%${q}%`)
        .limit(10);

      setResults((data as ClubHit[]) || []);
      setOpen(true);
      setLoading(false);
    }, 180);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  function goToClub(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/clubs/${encodeURIComponent(id)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToClub(results[activeIndex].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f2b22]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5">
            <span className="font-semibold text-white">M</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Members Time</div>
            <div className="text-[11px] text-white/60">
              Hosted. Verified. Respectful.
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-1 md:flex">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div ref={wrapperRef} className="relative ml-auto w-full max-w-xl">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-white/60">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search clubs…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
            />
            {loading && (
              <span className="text-xs text-white/60">Searching…</span>
            )}
          </div>

          {open && query && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b221b] shadow-xl">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/60">
                  No clubs found
                </div>
              ) : (
                results.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => goToClub(c.id)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cx(
                      "flex w-full justify-between px-4 py-3 text-left text-sm transition",
                      i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-xs text-white/60">
                        {[c.region, c.country].filter(Boolean).join(", ")}
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      {c.tier}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Auth */}
        <div className="hidden gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f]"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
