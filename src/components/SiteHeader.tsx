"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-all duration-300 border-b border-white/10",
        scrolled
          ? "bg-[#041b14]/70 backdrop-blur-md"
          : "bg-[#041b14]/90 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="relative block h-[64px] w-[260px]">
          <Image
            src="/memberstime-headerlogo.png"
            alt="Members Time"
            fill
            priority
            className="object-contain object-left"
            sizes="260px"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-[12px] uppercase tracking-[0.22em] text-white/80">
          <Link href="/browse" className="hover:text-white transition-colors">
            Browse Clubs
          </Link>

          <Link href="/for-guests" className="hover:text-white transition-colors">
            For Guests
          </Link>

          <Link href="/for-members" className="hover:text-white transition-colors">
            For Members
          </Link>

          <Link href="/how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-white/10 px-6 pb-4 pt-3">
        <div className="flex flex-wrap gap-5 text-[11px] uppercase tracking-[0.22em] text-white/80">
          <Link href="/browse" className="hover:text-white">
            Browse Clubs
          </Link>

          <Link href="/for-guests" className="hover:text-white">
            For Guests
          </Link>

          <Link href="/for-members" className="hover:text-white">
            For Members
          </Link>

          <Link href="/how-it-works" className="hover:text-white">
            How It Works
          </Link>
        </div>
      </div>
    </header>
  );
}
