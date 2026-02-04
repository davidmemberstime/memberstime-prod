import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#041b14] text-white overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0">
        <Image
          src="/home-hero.jpg"
          alt="Members Time — hosted golf experiences at great private clubs"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Very light overlay only */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/20 via-transparent to-[#041b14]/30" />
      </div>

      {/* Content */}
      <section className="relative z-10">
        {/* Key change: less top padding, tighter vertical rhythm */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-[90px] pb-[70px] text-center">
          {/* Raised hero logo */}
          <div className="mx-auto mb-8 flex justify-center">
            <div
              className="
                relative
                h-[240px] w-[600px]
                sm:h-[270px] sm:w-[680px]
                md:h-[300px] md:w-[760px]
              "
            >
              <Image
                src="/memberstime-logo.png"
                alt="Members Time"
                fill
                priority
                className="object-contain"
                sizes="760px"
              />
            </div>
          </div>

          {/* Raised headline */}
          <h1 className="font-serif text-[34px] sm:text-[46px] md:text-[56px] leading-tight tracking-wide">
            A hosted golf experience
            <span className="block">at the world’s great private clubs</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-white/90 tracking-wide">
            Play top-rated courses as an invited guest — accompanied by trusted members at exceptional private clubs.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/join?type=member"
              className="inline-flex h-[46px] w-[230px] items-center justify-center border border-white/50 bg-white/15 px-6 text-[12px] uppercase tracking-[0.24em] text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              I’m a Club Member
            </Link>

            <Link
              href="/join?type=guest"
              className="inline-flex h-[46px] w-[230px] items-center justify-center border border-[#d8b35a]/90 bg-[#d8b35a] px-6 text-[12px] uppercase tracking-[0.24em] text-[#041b14] transition hover:bg-[#e2c06d]"
            >
              I’m a Guest
            </Link>
          </div>

          {/* Footer line — now guaranteed above the fold */}
          <div className="mt-10 text-[11px] uppercase tracking-[0.24em] text-white/75">
            By invitation <span className="mx-2">•</span> For verified members & guests
            <span className="mx-2">•</span> In line with club culture
          </div>
        </div>
      </section>
    </main>
  );
}
