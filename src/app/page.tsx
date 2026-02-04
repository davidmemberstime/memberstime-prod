import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-[calc(100vh-0px)] bg-[#041b14] text-white">
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
        {/* Dark vignette + top header blend + bottom fade (matches the mock) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/75 via-[#041b14]/25 to-[#041b14]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.60)_70%,rgba(0,0,0,0.78)_100%)]" />
      </div>

      {/* Content */}
      <section className="relative z-10">
        {/* This padding allows the hero to sit under the sticky header nicely */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[120px] pb-[90px] text-center">
          {/* Optional: use your main site logo here if you want the big mark like the mock.
              If your main logo filename differs, change it here. */}
          <div className="mx-auto mb-8 flex justify-center">
            <div className="relative h-[110px] w-[260px] sm:h-[130px] sm:w-[320px] opacity-95">
              <Image
                src="/memberstime-logo.png"
                alt="Members Time"
                fill
                className="object-contain"
                sizes="320px"
              />
            </div>
          </div>

          <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[52px] leading-tight tracking-wide">
            A hosted golf experience
            <span className="block">at the world’s great private clubs</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[13px] sm:text-[14px] leading-relaxed text-white/80 tracking-wide">
            Play top-rated courses as an invited guest — accompanied by trusted members at exceptional private clubs.
          </p>

          {/* Buttons like the mock (rectangular, subtle) */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/join?type=member"
              className="inline-flex h-[44px] w-[220px] items-center justify-center border border-white/35 bg-white/10 px-6 text-[12px] uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              I’m a Club Member
            </Link>

            <Link
              href="/join?type=guest"
              className="inline-flex h-[44px] w-[220px] items-center justify-center border border-[#d8b35a]/70 bg-[#d8b35a]/90 px-6 text-[12px] uppercase tracking-[0.22em] text-[#041b14] transition hover:bg-[#e2c06d]"
            >
              I’m a Guest
            </Link>
          </div>

          {/* Bottom note line like the mock */}
          <div className="mt-12 text-[11px] uppercase tracking-[0.22em] text-white/60">
            By invitation <span className="mx-2">•</span> For verified members & guests{" "}
            <span className="mx-2">•</span> In line with club culture
          </div>
        </div>
      </section>
    </main>
  );
}
