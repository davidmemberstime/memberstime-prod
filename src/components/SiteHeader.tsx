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
  const isHome = pathname === "/";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClubHit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("club_directory")
        .select("id,name,town,region,country,is_active")
        .ilike("name", `%${query}%`)
        .eq("is_active", true)
        .limit(8);

      setResults((data ?? []) as ClubHit[]);
      setOpen(true);
      setActiveIndex(0);
    }, 200);
  }, [query]);

  function goToClub(id: string) {
    setQuery("");
    setOpen(false);
    router.push(`/clubs/${id}`);
  }

  const nav = [
    { href: "/browse", label: "How It Works" },
    { href: "/auth/sign-up?type=guest", label: "For Guests" },
    { href: "/auth/sign-up?type=member", label: "For Members" },
    { href: "/search", label: "For Clubs" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#041b14]/85 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-[74px] flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="relative h-[44px] w-[220px] shrink-0">
              <Image
                src="/memberstime-headerlogo.png"
                alt="Members Time"
                fill
                priority
                className="object-contain"
              />
            </Link>

            {/* MENU — NOW VISIBLE ON NORMAL DESKTOP */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex gap-10">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[12px] uppercase tracking-[0.22em] text-white/85 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Search */}
            <div ref={wrapRef} className="relative hidden sm:block w-[260px]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clubs"
                className="w-full bg-transparent border-b border-white/30 text-white placeholder:text-white/50 text-[13px] h-[34px] outline-none"
              />

              {open && results.length > 0 && (
                <div className="absolute mt-3 w-full bg-[#061f18] border border-white/10 rounded-xl overflow-hidden">
                  {results.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => goToClub(r.id)}
                      className={cn(
                        "block w-full text-left px-4 py-3 text-sm text-white/90 hover:bg-white/5",
                        i === activeIndex && "bg-white/10"
                      )}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign in */}
            <Link
              href="/auth/sign-in"
              className="hidden sm:inline-flex h-[34px] px-4 items-center border border-white/40 text-[11px] uppercase tracking-[0.22em] text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
