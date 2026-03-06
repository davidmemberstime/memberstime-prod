"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type AuthUser = {
  id: string;
} | null;

function navLinkClass(isActive: boolean) {
  return isActive
    ? "text-white"
    : "text-white/80 hover:text-white transition-colors";
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      setUser(user ? { id: user.id } : null);
      setLoadingAuth(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null);
      setLoadingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#041b14]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">
        {/* Logo */}
       <Link
  href="/"
  className="relative block h-[130px] w-[130px] shrink-0 overflow-hidden"
  aria-label="Members Time home"
>
  <Image
    src="/memberstime-headerlogo.png"
    alt="Members Time"
    fill
    priority
    className="object-contain"
  />
</Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-[12px] uppercase tracking-[0.22em] md:flex">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Home
          </Link>

          <Link
            href="/browse"
            className={navLinkClass(pathname?.startsWith("/browse") ?? false)}
          >
            Browse Clubs
          </Link>

          <Link
            href="/for-guests"
            className={navLinkClass(pathname?.startsWith("/for-guests") ?? false)}
          >
            For Guests
          </Link>

          <Link
            href="/for-members"
            className={navLinkClass(
              pathname?.startsWith("/for-members") ?? false
            )}
          >
            For Members
          </Link>

          <Link
            href="/how-it-works"
            className={navLinkClass(pathname?.startsWith("/how-it-works") ?? false)}
          >
            How It Works
          </Link>

          <Link
            href="/trust"
            className={navLinkClass(pathname?.startsWith("/trust") ?? false)}
          >
            Trust
          </Link>

          {isLoggedIn && (
            <Link
              href="/for-members/dashboard"
              className={navLinkClass(
                pathname?.startsWith("/for-members/dashboard") ?? false
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!loadingAuth && !isLoggedIn && (
            <Link
              href="/auth/sign-in"
              className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
            >
              Sign in
            </Link>
          )}

          {!loadingAuth && isLoggedIn && (
            <>
              <Link
                href="/for-members/dashboard"
                className="hidden rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition md:inline-flex"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="border-t border-white/10 px-6 pb-4 pt-3 md:hidden">
        <div className="flex flex-wrap gap-5 text-[11px] uppercase tracking-[0.22em]">
          <Link href="/" className={navLinkClass(pathname === "/")}>
            Home
          </Link>

          <Link
            href="/browse"
            className={navLinkClass(pathname?.startsWith("/browse") ?? false)}
          >
            Browse Clubs
          </Link>

          <Link
            href="/for-guests"
            className={navLinkClass(pathname?.startsWith("/for-guests") ?? false)}
          >
            For Guests
          </Link>

          <Link
            href="/for-members"
            className={navLinkClass(
              pathname?.startsWith("/for-members") ?? false
            )}
          >
            For Members
          </Link>

          <Link
            href="/how-it-works"
            className={navLinkClass(pathname?.startsWith("/how-it-works") ?? false)}
          >
            How It Works
          </Link>

          <Link
            href="/trust"
            className={navLinkClass(pathname?.startsWith("/trust") ?? false)}
          >
            Trust
          </Link>

          {isLoggedIn && (
            <>
              <Link
                href="/for-members/dashboard"
                className={navLinkClass(
                  pathname?.startsWith("/for-members/dashboard") ?? false
                )}
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          )}

          {!loadingAuth && !isLoggedIn && (
            <Link
              href="/auth/sign-in"
              className="text-white/80 hover:text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}



