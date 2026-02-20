"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ClubHit = {
  id: string;
  name: string;
  town?: string | null;
  region?: string | null;
  country?: string | null;
  tier?: string | null;
  is_active?: boolean | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClubHit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const desktopWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileWrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

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
          .select("id,name,town,region,country,tier,is_active")
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
    { href: "/browse", label: "Browse Clubs" },
    { href: "/auth/sign-up?type=guest", label: "For Guests" },
    { href: "/auth/sign-up?type=member", label: "For Members" },
    { href: "/how-it-works", label: "How It Works" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-[9999]">
      <div className="pointer-events-auto border-b border-white/10 bg-[#041b14]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#041b14]/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="h-[74px] flex items-center justify-between gap-6">
            <div className="flex items-center shrink-0">
              <Link href="/" aria-label="Members Time home" className="block">
                <div className="relative h-[74px] w-[280px]">
                  <Image
                    src="/memberstime-headerlogo.png"
                    alt="Members Time"
                    fill
                    priority
                    className="object-contain object-left"
                    sizes="280px"
                  />
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center gap-10">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "text-[12px] uppercase tracking-[0.22em] transition-colors whitespace-nowrap",
                          active ? "text-white" : "text-white/75 hover:text-white"
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

            <div className="flex items-center justify-end gap-4 shrink-0">
              <div
                ref={desktopWrapRef}
                className="relative hidden sm:block w-[240px] lg:w-[280px]"
              >
                <div className="flex items-center gap-3 px-1 border-b border-white/20 focus-within:border-white/45 transition">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/55 translate-y-[1px]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      if (results.length) setOpen(true);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search clubs"
                    className="w-full bg-transparent h-[34px] text-[13px] tracking-wide text-white placeholder:text-white/55 outline-none"
                    aria-label="Search clubs"
                    autoComplete="off"
                  />
                  {loading ? (
                    <span className="text-[11px] tracking-[0.3em] text-white/55">
                      …
                    </span>
                  ) : null}
                </div>

                {open && results.length > 0 && (
                  <div className="absolute mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/96 backdrop-blur-xl shadow-2xl">
                    <ul className="py-1">
                      {results.map((r, idx) => {
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
                              <div className="text-[13px] text-white/92 tracking-wide">
                                {r.name}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <Link
                href="/auth/sign-in"
                className="hidden sm:inline-flex items-center justify-center h-[34px] px-4 text-[11px] uppercase tracking-[0.22em] text-white/90 hover:text-white transition-colors border border-white/45 hover:bg-white/5"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="md:hidden pb-4">
            <nav className="pt-1">
              <ul className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                {nav.map((item) => (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      className="text-[11px] uppercase tracking-[0.22em] text-white/85 hover:text-white transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="shrink-0">
                  <Link
                    href="/auth/sign-in"
                    className="text-[11px] uppercase tracking-[0.22em] text-white/90 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
            </nav>

            <div ref={mobileWrapRef} className="relative mt-4">
              <div className="flex items-center gap-3 px-1 border-b border-white/20 focus-within:border-white/45 transition">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/55 translate-y-[1px]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length) setOpen(true);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search clubs"
                  className="w-full bg-transparent h-[34px] text-[13px] tracking-wide text-white placeholder:text-white/55 outline-none"
                  aria-label="Search clubs"
                  autoComplete="off"
                />
                {loading ? (
                  <span className="text-[11px] tracking-[0.3em] text-white/55">
                    …
                  </span>
                ) : null}
              </div>

              {open && results.length > 0 && (
                <div className="absolute mt-3 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/96 backdrop-blur-xl shadow-2xl">
                  <ul className="py-1">
                    {results.map((r, idx) => {
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
                            <div className="text-[13px] text-white/92 tracking-wide">
                              {r.name}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
