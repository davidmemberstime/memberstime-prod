"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = {
  id: string;
  name: string;
  town?: string | null;
  region?: string | null;
  country?: string | null;
  tier?: string | null;
  hosts_count?: number | null;
  is_active?: boolean | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClubHit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const desktopWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileWrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      const inDesktop = desktopWrapRef.current?.contains(t);
      const inMobile = mobileWrapRef.current?.contains(t);
      if (!inDesktop && !inMobile) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Debounced Supabase search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("club_directory")
          .select("id,name,town,region,country,tier,hosts_count,is_active")
          .ilike("name", `%${trimmed}%`)
          .eq("is_active", true)
          .order("name", { ascending: true })
          .limit(8);

        if (error) throw error;

        const mapped = (data ?? []) as ClubHit[];
        setResults(mapped);
        setOpen(true);
        setActiveIndex(mapped.length ? 0 : -1);
      } catch {
        setResults([]);
        setOpen(false);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  function goToClub(id: string) {
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
    router.push(`/clubs/${id}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      if (results.length) setOpen(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!results.length) return;
      setActiveIndex((prev) => (prev + 1) % results.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    }

    if (e.key === "Enter") {
      if (!results.length) return;
      const chosen = results[Math.max(activeIndex, 0)];
      if (chosen?.id) {
        e.preventDefault();
        goToClub(chosen.id);
      }
    }
  }

  const nav = [
    { href: "/browse", label: "Browse" },
    { href: "/rankings", label: "Rankings" },
    { href: "/pricing", label: "Membership" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Slimmer, premium bar */}
      <div className="bg-[#041b14]/72 backdrop-blur-xl supports-[backdrop-filter]:bg-[#041b14]/55 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Slightly slimmer than before, calmer rhythm */}
          <div className="h-[72px] flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" aria-label="Members Time home" className="flex items-center">
                <div className="relative h-[40px] w-[190px]">
                  <Image
                    src="/memberstime-headerlogo.png"
                    alt="Members Time"
                    fill
                    priority
                    className="object-contain object-left"
                    sizes="190px"
                  />
                </div>
              </Link>
            </div>

            {/* Center nav (editorial spacing) */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center gap-12">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "text-[12px] uppercase tracking-[0.22em] transition-colors",
                          active ? "text-white" : "text-white/70 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                      <span
                        className={cn(
                          "pointer-events-none absolute left-0 right-0 -bottom-2 mx-auto h-px w-full transition-opacity",
                          active ? "opacity-100 bg-white/55" : "opacity-0 bg-white/35"
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right side */}
            <div className="flex items-center justify-end gap-4">
              {/* Desktop search: NOT a pill. Minimal, underline style. */}
              <div ref={desktopWrapRef} className="relative hidden sm:block w-[260px] lg:w-[300px]">
                <div
                  className={cn(
                    "flex items-center gap-3",
                    "px-1",
                    "border-b border-white/18",
                    "focus-within:border-white/35",
                    "transition"
                  )}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/55 translate-y-[1px]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      if (results.length) setOpen(true);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search clubs"
                    className={cn(
                      "w-full bg-transparent",
                      "h-[34px]",
                      "text-[13px] tracking-wide text-white placeholder:text-white/45",
                      "outline-none"
                    )}
                    aria-label="Search clubs"
                    autoComplete="off"
                  />
                  {loading ? (
                    <span className="text-[11px] tracking-[0.3em] text-white/45">…</span>
                  ) : null}
                </div>

                {open && results.length > 0 && (
                  <div className="absolute mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/96 backdrop-blur-xl shadow-2xl">
                    <ul className="py-1">
                      {results.map((r, idx) => {
                        const meta = [r.town, r.region, r.country].filter(Boolean).join(", ");
                        const active = idx === activeIndex;

                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveIndex(idx)}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => goToClub(r.id)}
                              className={cn(
                                "w-full text-left px-4 py-3 transition",
                                active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                              )}
                            >
                              <div className="flex items-baseline justify-between gap-3">
                                <div className="text-[13px] text-white/92 tracking-wide">
                                  {r.name}
                                </div>
                                {r.tier ? (
                                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                                    {r.tier}
                                  </div>
                                ) : null}
                              </div>
                              {meta ? (
                                <div className="mt-1 text-[11px] tracking-[0.16em] uppercase text-white/45">
                                  {meta}
                                </div>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTAs: less chunky than pills */}
              <Link
                href="/signin"
                className={cn(
                  "hidden sm:inline-flex items-center justify-center",
                  "h-[34px] px-3",
                  "text-[12px] uppercase tracking-[0.22em]",
                  "text-white/75 hover:text-white transition-colors"
                )}
              >
                Sign in
              </Link>

              <Link
                href="/join"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-[34px] px-4",
                  "text-[12px] uppercase tracking-[0.22em]",
                  "text-[#041b14]",
                  "bg-[#d8b35a] hover:bg-[#e2c06d]",
                  "transition"
                )}
              >
                Join
              </Link>
            </div>
          </div>

          {/* Mobile nav + search */}
          <div className="md:hidden pb-4">
            <nav className="pt-1">
              <ul className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="shrink-0">
                      <Link
                        href={item.href}
                        className={cn(
                          "text-[11px] uppercase tracking-[0.22em] transition-colors",
                          active ? "text-white" : "text-white/70 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div ref={mobileWrapRef} className="relative mt-4">
              <div
                className={cn(
                  "flex items-center gap-3",
                  "px-1",
                  "border-b border-white/18",
                  "focus-within:border-white/35",
                  "transition"
                )}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/55 translate-y-[1px]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length) setOpen(true);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search clubs"
                  className={cn(
                    "w-full bg-transparent",
                    "h-[34px]",
                    "text-[13px] tracking-wide text-white placeholder:text-white/45",
                    "outline-none"
                  )}
                  aria-label="Search clubs"
                  autoComplete="off"
                />
                {loading ? (
                  <span className="text-[11px] tracking-[0.3em] text-white/45">…</span>
                ) : null}
              </div>

              {open && results.length > 0 && (
                <div className="absolute mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/96 backdrop-blur-xl shadow-2xl">
                  <ul className="py-1">
                    {results.map((r, idx) => {
                      const meta = [r.town, r.region, r.country].filter(Boolean).join(", ");
                      const active = idx === activeIndex;

                      return (
                        <li key={r.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => goToClub(r.id)}
                            className={cn(
                              "w-full text-left px-4 py-3 transition",
                              active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="flex items-baseline justify-between gap-3">
                              <div className="text-[13px] text-white/92 tracking-wide">
                                {r.name}
                              </div>
                              {r.tier ? (
                                <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                                  {r.tier}
                                </div>
                              ) : null}
                            </div>
                            {meta ? (
                              <div className="mt-1 text-[11px] tracking-[0.16em] uppercase text-white/45">
                                {meta}
                              </div>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Link
                href="/signin"
                className={cn(
                  "text-[11px] uppercase tracking-[0.22em]",
                  "text-white/75 hover:text-white transition-colors"
                )}
              >
                Sign in
              </Link>

              <Link
                href="/join"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-[34px] px-4",
                  "text-[11px] uppercase tracking-[0.22em]",
                  "text-[#041b14]",
                  "bg-[#d8b35a] hover:bg-[#e2c06d]",
                  "transition"
                )}
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
