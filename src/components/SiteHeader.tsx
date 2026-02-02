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

const LOGO_SRC = "/memberstime-logo.png"; // ✅ public/memberstime-logo.png

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
      { href: "/how-it-works", label: "How it Works" },
      { href: "/for-guests", label: "For Guests" },
      { href: "/for-members", label: "For Members" },
      { href: "/for-clubs", label: "For Clubs" },
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
        .limit(10);

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f2b22]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        {/* Brand (bigger, like your reference) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-white/10 bg-white/5">
            <Image
              src={LOGO_SRC}
              alt="Members Time"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-white">Members Time</div>
            <div className="text-[11px] tracking-wide text-white/60">
              Hosted. Verified. Respectful.
            </div>
          </div>
        </Link>

        {/* Center nav (matches “original” vibe) */}
        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "rounded-full px-3 py-2 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/75 hover:bg-white/5 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Search bar (long pill, premium) */}
        <div ref={wrapperRef} className="relative hidden w-[520px] lg:block">
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2">
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
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b221b] shadow-2xl">
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

        {/* Right actions (gold sign in / join like reference) */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/login"
            className="rounded-full border border-[#c58a3a]/60 bg-transparent px-4 py-2 text-sm text-[#f1d7b1] hover:border-[#c58a3a] hover:bg-[#c58a3a]/10"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            Join
          </Link>
        </div>
      </div>

      {/* Mobile: show search under header */}
      <div className="border-t border-white/10 px-4 py-3 lg:hidden">
        <div ref={wrapperRef} className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2">
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
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b221b] shadow-2xl">
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
