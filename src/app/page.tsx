import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b2a1f] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/home-hero.jpg"
            alt="Members Time — private golf hosted experiences"
            fill
            priority
            className="object-cover"
          />
          {/* Luxury overlay: lift shadows, keep greens, readable type */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/35 via-[#041b14]/55 to-[#0b2a1f] " />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-20">
          {/* Eyebrow */}
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">
            Hosted golf access • Verified members • Verified guests
          </p>

          {/* Headline */}
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            A hosted golf experience,
            <span className="text-white/90"> delivered with respect</span>
          </h1>

          {/* Subcopy */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Members Time connects verified guests with verified members of
            private clubs who choose to host during members’ times — aligned with
            each club’s rules, culture and standards.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/browse"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#d8b35a] px-6 text-sm font-semibold text-[#041b14] hover:brightness-110"
            >
              Browse clubs
            </Link>

            <Link
              href="/for-guests"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              I’m a guest
            </Link>

            <Link
              href="/for-members"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-transparent px-6 text-sm font-semibold text-white/90 hover:bg-white/5"
            >
              I’m a club member
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-white/60">
                For clubs
              </div>
              <div className="mt-2 text-sm text-white/80">
                Protected standards, preserved culture, and incremental clubhouse
                value.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-white/60">
                For members
              </div>
              <div className="mt-2 text-sm text-white/80">
                Join free. Host optionally. Full control and responsibility over
                your guests.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.22em] text-white/60">
                For guests
              </div>
              <div className="mt-2 text-sm text-white/80">
                Access through trust — verified handicap, identity checks where
                needed, and conduct ratings.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BELOW HERO (optional placeholder) */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Not discount golf.
            </h2>
            <p className="mt-3 text-white/70">
              Members Time exists to protect clubs, respect membership
              privileges, and ensure guests are accountable — creating a better,
              hosted round.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-white/60">
              How it works
            </div>
            <ol className="mt-4 space-y-3 text-sm text-white/80">
              <li>1) Guests create a verified profile.</li>
              <li>2) Members choose when to host.</li>
              <li>3) Bookings follow club guest rules.</li>
              <li>4) Post-round ratings maintain standards.</li>
            </ol>

            <Link
              href="/how-it-works"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Read the full process
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
