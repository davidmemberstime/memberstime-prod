import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#0b2a1f] text-white">
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

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/30 via-[#041b14]/55 to-[#0b2a1f]" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20">

          {/* BIG HERO LOGO */}
          <div className="mb-10">
            <Image
              src="/memberstime-logo.png"
              alt="Members Time"
              width={320}
              height={120}
              priority
              className="object-contain"
            />
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
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
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center rounded-full bg-[#d8b35a] px-6 py-3 text-sm font-semibold text-[#041b14] hover:brightness-110"
            >
              Browse clubs
            </Link>

            <Link
              href="/for-guests"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              I'm a guest
            </Link>

            <Link
              href="/for-members"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              I'm a club member
            </Link>
          </div>

          {/* Trust cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                For clubs
              </div>
              <p className="mt-3 text-sm text-white/80">
                Protected standards, preserved culture, and incremental clubhouse value.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                For members
              </div>
              <p className="mt-3 text-sm text-white/80">
                Join free. Host optionally. Full control and responsibility over your guests.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                For guests
              </div>
              <p className="mt-3 text-sm text-white/80">
                Access through trust — verified handicap, identity checks where needed.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
