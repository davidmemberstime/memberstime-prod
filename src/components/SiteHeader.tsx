"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = {
  id: string;
  name: string;
  town?: string | null;
  region?: string | null;
  country?: string | null;
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
      { href: "/how-it-works", label: "How it Works" },
      { href: "/for-guests", label: "For Guests" },
      { href: "/for-members", label: "For Members" },
      { href: "/for-clubs", label: "For Clubs" },
    ],
    []
  );

  // Close dropdown on outside click
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
      const { data, error } = await supabase
        .from("club_directory")
        .select("id,name,town,region,country,tier,is_active")
        .eq("is_active", true)
        .ilike("name", `%${q}%`)
        .order("hosts_count", { ascending: false })
        .limit(8);

      if (error) {
        setResults([]);
      } else {
        setResults((data as ClubHit[]) || []);
      }

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
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        goToClub(results[activeIndex].id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0d2a22]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        {/* LEFT: Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-[#134032] ring-1 ring-white/10">
            <Image
              src="/memberstime-headerlogo.png"
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

        {/* CENTER: Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "text-sm transition",
                  active
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* CENTER-RIGHT: Search (smaller + premium) */}
        <div
          ref={wrapperRef}
          className="relative ml-auto hidden w-[420px] max-w-[45vw] md:block"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="text-white/60">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search a club..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
            />
            {loading && (
              <span className="text-xs text-white/55">…</span>
            )}
          </div>

          {open && query && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a2019] shadow-2xl">
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
                      "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition",
                      i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="mt-0.5 text-xs text-white/55">
                        {[c.town || c.region, c.country].filter(Boolean).join(", ")}
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

        {/* RIGHT: Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="rounded-full border border-[#c58a3a]/40 bg-transparent px-4 py-2 text-sm text-white/90 hover:bg-white/5"
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

      {/* MOBILE: optional simple search under header */}
      <div className="mx-auto block max-w-7xl px-4 pb-3 md:hidden">
        <div ref={wrapperRef} className="relative">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="text-white/60">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search a club..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/45 outline-none"
            />
            {loading && <span className="text-xs text-white/55">…</span>}
          </div>

          {open && query && (
            <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a2019] shadow-2xl">
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
                      "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition",
                      i === activeIndex ? "bg-white/10" : "hover:bg-white/5"
                    )}
                  >
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="mt-0.5 text-xs text-white/55">
                        {[c.town || c.region, c.country].filter(Boolean).join(", ")}
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
      </div>
    </header>
  );
}
