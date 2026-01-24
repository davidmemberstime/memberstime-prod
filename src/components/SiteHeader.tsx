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

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Search state
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
      { href: "/how-it-works", label: "How it works" },
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
        .select("id,name,region,country,tier")
        .ilike("name", `%${q}%`)
        .limit(10);

      if (error) {
        setResults([]);
      } else {
        setResults((data as ClubHit[]) || []);
      }

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
    if (!open) return;

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
      setActiveIndex(-1);
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#163428]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* Put your real logo here later (see note below) */}
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/15 bg-white/5">
            {/* If you add a real logo file, replace this with <Image ... /> */}
            <div className="grid h-full w-full place-items-center text-sm font-semibold text-white">
              M
            </div>
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">Members Time</div>
            <div className="text-[11px] text-white/70">
              Hosted. Verified. Respectful.
            </div>
          </div>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden items-center gap-6 md:flex md:pl-6">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cx(
                "text-sm tracking-wide transition",
                isActive(n.href)
                  ? "text-[#d2aa67]"
                  : "text-white/80 hover:text-white"
              )}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/search"
            className={cx(
              "text-sm tracking-wide transition",
              isActive("/search")
                ? "text-[#d2aa67]"
                : "text-white/80 hover:text-white"
            )}
          >
            Member search
          </Link>
        </nav>

        {/* Right: Search + auth */}
        <div className="ml-auto flex w-full items-center justify-end gap-3">
          {/* Search */}
          <div ref={wrapperRef} className="relative w-full max-w-[520px]">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <span className="text-white/70">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="Browse clubs…"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
              />
              {loading && (
                <span className="text-[11px] text-white/70">Searching…</span>
              )}
            </div>

            {open && query && (
              <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#10291f] shadow-2xl">
                {results.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-white/70">
                    No clubs found
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-auto">
                    {results.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => goToClub(c.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cx(
                          "flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition",
                          i === activeIndex
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-white">
                            {c.name}
                          </div>
                          <div className="mt-0.5 truncate text-[12px] text-white/70">
                            {[c.region, c.country].filter(Boolean).join(", ")}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75">
                          {c.tier}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              className="rounded-full bg-[#d2aa67] px-4 py-2 text-sm font-semibold text-[#14281f] hover:brightness-110"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
