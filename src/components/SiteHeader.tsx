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
  hosts_count?: number | null;
  is_active?: boolean | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClubHit[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const desktopWrapRef = useRef<HTMLDivElement | null>(null);
  const mobileWrapRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (
        !desktopWrapRef.current?.contains(t) &&
        !mobileWrapRef.current?.contains(t)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(async () => {
      const { data } = await supabase
        .from("club_directory")
        .select("id,name,town,region,country,tier,is_active")
        .ilike("name", `%${q}%`)
        .eq("is_active", true)
        .limit(8);

      setResults((data ?? []) as ClubHit[]);
      setOpen(true);
      setActiveIndex(0);
      setLoading(false);
    }, 220);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  function goToClub(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/clubs/${id}`);
  }

  const nav = [
    { href: "/browse", label: "Browse" },
    { href: "/search", label: "Search" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* THIS IS THE IMPORTANT CHANGE */}
      <div
        className={cn(
          isHome
            ? "bg-gradient-to-b from-[#041b14]/65 to-[#041b14]/15"
            : "bg-[#041b14]/75 backdrop-blur-xl border-b border-white/10"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="h-[74px] flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative h-[44px] w-[220px]">
              <Image
                src="/memberstime-headerlogo.png"
                alt="Members Time"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* Menu */}
            <nav className="hidden md:flex gap-10">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[12px] uppercase tracking-[0.22em] text-white/90 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <Link
              href="/auth/sign-in"
              className="hidden sm:inline-flex h-[32px] px-4 items-center justify-center text-[11px] uppercase tracking-[0.22em] text-white border border-white/50 hover:bg-white/10 transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
