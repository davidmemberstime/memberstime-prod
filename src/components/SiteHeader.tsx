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
  return [
    "text-[11px] tracking-[0.14em] text-white/78 transition-colors hover:text-white",
    isActive ? "text-white" : "",
  ].join(" ");
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#041b14]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[92px] max-w-7xl items-center justify-between px-6 py-0">
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center">
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
              sizes="130px"
            />
          </Link>
        </div>

        {/* Centre: Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
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
            className={navLinkClass(pathname?.startsWith("/for-members") ?? false)}
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

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-3">
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
                className="hidden rounded-xl border border-[#d8b35a]/60 bg-[#d8b35a]/10 px-4 py-2 text-sm font-medium text-[#f1d28c] transition hover:bg-[#d8b35a]/18 md:inline-flex"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-white/12 px-4 py-2 text-sm text-white/78 transition hover:bg-white/5 hover:text-white"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-white/10 px-6 pb-4 pt-3 md:hidden">
        <div className="flex flex-wrap gap-x-5 gap-y-3">
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
            className={navLinkClass(pathname?.startsWith("/for-members") ?? false)}
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

          {!loadingAuth && !isLoggedIn && (
            <Link
              href="/auth/sign-in"
              className="text-[11px] tracking-[0.14em] text-white/78 transition-colors hover:text-white"
            >
              Sign in
            </Link>
          )}

          {!loadingAuth && isLoggedIn && (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-[11px] tracking-[0.14em] text-white/78 transition-colors hover:text-white"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
