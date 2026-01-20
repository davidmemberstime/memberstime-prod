import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b2a1f]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight">
              Members Time
            </div>
            <div className="text-xs text-white/70">
              Hosted. Verified. Respectful.
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          <Link href="/browse" className="hover:text-white">
            Browse clubs
          </Link>
          <Link href="/search" className="hover:text-white">
            Member search
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/sign-in"
            className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            Join
          </Link>
        </div>
      </div>
    </header>
  );
}
