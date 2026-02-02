"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

const LOGO_SRC = "/memberstime-logo.png";

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

  // Match your “original” vibe: short nav labels
  const nav = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/browse", label: "Clubs" },
      { href: "/how-it-works", label: "How It Works" },
    ],
    []
  );

  // close on outside click
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

  // live search (debounced)
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
        .limit(8);

      setResults((data as ClubHit[]) || []);
      setOpen(true);
      setLoading(false);
    }, 160);

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0e2a22]/95 backdrop-blur">
      {/* Slim header like your reference */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Brand (smaller + cleaner) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border border-white/10 bg-white/5">
            <Image
              src={LOGO_SRC}
              alt="Members Time"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Members Time</div>
            <div className="text-[11px] text-white/60">
              Hosted. Verified. Respectful.
            </div>
          </div>
        </Link>

        {/* Nav (compact, not chunky pills) */}
        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "text-sm transition",
                  active ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Search (RIGHT SIZE) */}
        <div ref={wrapperRef} className="relative ml-auto hidden md:block">
          <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2">
            <span className="text-white/55">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search a club…"
              className="w-[320px] bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
            />
            {loading && <span className="text-xs text-white/55">…</span>}
          </div>

          {open && query && (
            <div className="absolute right-0 mt-2 w-[420px] overflow-hidden rounded-md border border-white/10 bg-[#0b221b] shadow-2xl">
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
                      "flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition",
                      i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">
                        {c.name}
                      </div>
                      <div className="truncate text-xs text-white/60">
                        {[c.region, c.country].filter(Boolean).join(", ")}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                      {c.tier}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right buttons (more like reference: subtle sign in) */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md border border-[#c58a3a]/70 px-3 py-2 text-sm text-[#f1d7b1] hover:bg-[#c58a3a]/10"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-md bg-[#c58a3a] px-3 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            Join
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-white/10 px-4 py-3 md:hidden">
        <div ref={wrapperRef} className="relative">
          <div className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2">
            <span className="text-white/55">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search a club…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
            />
            {loading && <span className="text-xs text-white/55">…</span>}
          </div>

          {open && query && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-md border border-white/10 bg-[#0b221b] shadow-2xl">
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
                      "flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition",
                      i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">
                        {c.name}
                      </div>
                      <div className="truncate text-xs text-white/60">
                        {[c.region, c.country].filter(Boolean).join(", ")}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                      {c.tier}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
