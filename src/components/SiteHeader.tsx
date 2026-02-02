"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type ClubResult = {
  id: string;
  name: string;
  city?: string | null;
  county?: string | null;
  country?: string | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClientComponentClient(), []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClubResult[]>([]);
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

  // Debounced search
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
          .select("id,name,city,county,country")
          .ilike("name", `%${trimmed}%`)
          .order("name", { ascending: true })
          .limit(8);

        if (error) throw error;

        const mapped = (data ?? []) as ClubResult[];
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
  }, [query, supabase]);

  function goToClub(id: string) {
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
    router.push(`/clubs/${id}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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

    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
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
      <div className="bg-[#041b14]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[#041b14]/55 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Desktop / tablet bar */}
          <div className="h-[76px] flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center min-w-[168px]">
              <Link
                href="/"
                className="group flex items-center gap-3"
                aria-label="Members Time home"
              >
                <div className="relative h-[44px] w-[176px]">
                  <Image
                    src="/memberstime-headerlogo.png"
                    alt="Members Time"
                    fill
                    priority
                    className="object-contain object-left"
                    sizes="176px"
                  />
                </div>

                <span className="hidden lg:inline text-[11px] tracking-[0.28em] uppercase text-white/60 group-hover:text-white/75 transition">
                  Private Golf Society
                </span>
              </Link>
            </div>

            {/* Center nav */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <ul className="flex items-center gap-10">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "text-[12px] uppercase tracking-[0.22em] transition",
                          active ? "text-white" : "text-white/70 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                      <span
                        className={cn(
                          "absolute left-0 right-0 -bottom-2 mx-auto h-px w-full transition-opacity",
                          active ? "opacity-100 bg-white/55" : "opacity-0 bg-white/40"
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right side: search + CTAs */}
            <div className="flex items-center justify-end gap-3 min-w-[320px]">
              {/* Desktop search */}
              <div
                ref={desktopWrapRef}
                className="relative hidden sm:block w-[280px] lg:w-[320px]"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full",
                    "bg-white/[0.06] border border-white/10",
                    "hover:border-white/20 focus-within:border-white/25",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                  )}
                >
                  <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      if (results.length) setOpen(true);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Search clubs"
                    className={cn(
                      "w-full bg-transparent h-[38px] pr-3 pl-2",
                      "text-[13px] tracking-wide text-white placeholder:text-white/45 outline-none"
                    )}
                    aria-label="Search golf clubs"
                    autoComplete="off"
                  />
                  {loading ? (
                    <span className="mr-3 text-[11px] tracking-widest text-white/45">
                      …
                    </span>
                  ) : null}
                </div>

                {open && results.length > 0 && (
                  <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/95 backdrop-blur-xl shadow-2xl">
                    <ul className="py-1">
                      {results.map((r, idx) => {
                        const meta = [r.city, r.county, r.country]
                          .filter(Boolean)
                          .join(", ");
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
                                active
                                  ? "bg-white/[0.07]"
                                  : "bg-transparent hover:bg-white/[0.05]"
                              )}
                            >
                              <div className="text-[13px] text-white/90 tracking-wide">
                                {r.name}
                              </div>
                              {meta ? (
                                <div className="mt-0.5 text-[11px] tracking-[0.16em] uppercase text-white/45">
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

              {/* CTAs */}
              <Link
                href="/signin"
                className={cn(
                  "hidden sm:inline-flex items-center justify-center",
                  "h-[38px] px-4 rounded-full",
                  "text-[12px] uppercase tracking-[0.22em]",
                  "text-white/75 hover:text-white",
                  "border border-white/10 hover:border-white/20",
                  "bg-white/[0.02] hover:bg-white/[0.04]",
                  "transition"
                )}
              >
                Sign in
              </Link>

              <Link
                href="/join"
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-[38px] px-5 rounded-full",
                  "text-[12px] uppercase tracking-[0.22em]",
                  "text-[#041b14]",
                  "bg-[#d8b35a] hover:bg-[#e2c06d]",
                  "shadow-[0_10px_30px_rgba(216,179,90,0.15)]",
                  "transition"
                )}
              >
                Join
              </Link>
            </div>
          </div>

          {/* Mobile section */}
          <div className="md:hidden pb-4">
            <div className="flex items-center justify-between gap-3">
              <nav className="flex-1">
                <ul className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                  {nav.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href} className="shrink-0">
                        <Link
                          href={item.href}
                          className={cn(
                            "text-[11px] uppercase tracking-[0.22em] transition",
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

              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-[34px] px-3 rounded-full",
                    "text-[11px] uppercase tracking-[0.22em]",
                    "text-white/75 hover:text-white",
                    "border border-white/10 hover:border-white/20",
                    "bg-white/[0.02] hover:bg-white/[0.04]",
                    "transition"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href="/join"
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-[34px] px-4 rounded-full",
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

            {/* Mobile search */}
            <div ref={mobileWrapRef} className="relative mt-3">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full",
                  "bg-white/[0.06] border border-white/10",
                  "hover:border-white/20 focus-within:border-white/25"
                )}
              >
                <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length) setOpen(true);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search clubs"
                  className={cn(
                    "w-full bg-transparent h-[38px] pr-3 pl-2",
                    "text-[13px] tracking-wide text-white placeholder:text-white/45 outline-none"
                  )}
                  aria-label="Search golf clubs"
                  autoComplete="off"
                />
                {loading ? (
                  <span className="mr-3 text-[11px] tracking-widest text-white/45">
                    …
                  </span>
                ) : null}
              </div>

              {open && results.length > 0 && (
                <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061f18]/95 backdrop-blur-xl shadow-2xl">
                  <ul className="py-1">
                    {results.map((r, idx) => {
                      const meta = [r.city, r.county, r.country].filter(Boolean).join(", ");
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
                              active ? "bg-white/[0.07]" : "hover:bg-white/[0.05]"
                            )}
                          >
                            <div className="text-[13px] text-white/90 tracking-wide">
                              {r.name}
                            </div>
                            {meta ? (
                              <div className="mt-0.5 text-[11px] tracking-[0.16em] uppercase text-white/45">
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
          </div>
        </div>
      </div>
    </header>
  );
}
