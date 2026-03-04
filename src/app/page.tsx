import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative text-white">

      {/* HERO */}
      <section className="relative h-[80vh] min-h-[620px] w-full overflow-hidden">

        {/* Background Image */}
        <Image
          src="/home-hero.jpg"
          alt="Golf course"
          fill
          priority
          className="object-cover brightness-[1.15]"
        />

        {/* Softer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/55 via-[#041b14]/45 to-[#041b14]/70" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">

          {/* Centered Logo */}
    <div className="flex justify-center mb-8">
  <img
    src="/memberstime-headerlogo.png"
    alt="Members Time"
    className="h-24 md:h-28 w-auto scale-200"
  />
</div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            A hosted golf experience,
            delivered with respect
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl text-white/80 text-lg">
            Members Time connects verified guests with verified members of private clubs
            who choose to host during members’ times — aligned with each club’s rules,
            culture and standards.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/browse"
              className="rounded-full bg-[#d4af37] px-6 py-3 text-black font-semibold hover:brightness-110 transition"
            >
              Browse clubs
            </Link>

            <Link
              href="/for-guests"
              className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition"
            >
              I’m a guest
            </Link>

            <Link
              href="/for-members"
              className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition"
            >
              I’m a club member
            </Link>

          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
            For clubs
          </h3>
          <p className="mt-3 text-white/80">
            Protected standards, preserved culture, and incremental clubhouse value.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
            For members
          </h3>
          <p className="mt-3 text-white/80">
            Join free. Host optionally. Full control and responsibility over your guests.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-sm uppercase tracking-[0.2em] text-white/60">
            For guests
          </h3>
          <p className="mt-3 text-white/80">
            Access through trust — verified handicap, identity checks where needed.
          </p>
        </div>

      </section>

    </main>
  );
}

