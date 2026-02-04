import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#041b14] text-white">
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

        {/* Lighter overlays (closer to your concept image) */}
        {/* soft top blend for header */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/45 via-transparent to-[#041b14]/55" />
        {/* subtle vignette only (not crushing the whole image) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Content */}
      <section className="relative z-10">
        {/* Sit under the sticky header */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[110px] pb-[90px] text-center">
          {/* BIG hero logo like concept */}
          <div className="mx-auto mb-8 flex justify-center">
            <div className="relative h-[120px] w-[320px] sm:h-[150px] sm:w-[400px] md:h-[170px] md:w-[460px]">
              <Image
                src="/memberstime-logo.png"
                alt="Members Time"
                fill
                className="object-contain"
                sizes="460px"
                priority
              />
            </div>
          </div>

          <h1 className="font-serif text-[34px] sm:text-[46px] md:text-[56px] leading-tight tracking-wide drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
            A hosted golf experience
            <span className="block">at the world’s great private clubs</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[13px] sm:text-[14px] leading-relaxed text-white/85 tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
            Play top-rated courses as an invited guest — accompanied by trusted members at exceptional private clubs.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/join?type=member"
              className="inline-flex h-[44px] w-[220px] items-center justify-center border border-white/45 bg-white/12 px-6 text-[12px] uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white/18"
            >
              I’m a Club Member
            </Link>

            <Link
              href="/join?type=guest"
              className="inline-flex h-[44px] w-[220px] items-center justify-center border border-[#d8b35a]/80 bg-[#d8b35a]/95 px-6 text-[12px] uppercase tracking-[0.22em] text-[#041b14] transition hover:bg-[#e2c06d]"
            >
              I’m a Guest
            </Link>
          </div>

          {/* Bottom note */}
          <div className="mt-12 text-[11px] uppercase tracking-[0.22em] text-white/70 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            By invitation <span className="mx-2">•</span> For verified members & guests{" "}
            <span className="mx-2">•</span> In line with club culture
          </div>
        </div>
      </section>
    </main>
  );
}
