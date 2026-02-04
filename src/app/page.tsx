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

        {/* VERY LIGHT overlays – image should feel bright & golden */}
        {/* gentle top blend only, no heavy vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/25 via-transparent to-[#041b14]/35" />
      </div>

      {/* Content */}
      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-[120px] pb-[100px] text-center">
          {/* MASSIVE hero logo (dominant, like concept) */}
          <div className="mx-auto mb-10 flex justify-center">
            <div className="relative
              h-[260px] w-[640px]
              sm:h-[300px] sm:w-[720px]
              md:h-[340px] md:w-[820px]
            ">
              <Image
                src="/memberstime-logo.png"
                alt="Members Time"
                fill
                priority
                className="object-contain"
                sizes="820px"
              />
            </div>
          </div>

          <h1 className="font-serif text-[36px] sm:text-[48px] md:text-[58px] leading-tight tracking-wide">
            A hosted golf experience
            <span className="block">at the world’s great private clubs</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[14px] sm:text-[15px] leading-relaxed text-white/90 tracking-wide">
            Play top-rated courses as an invited guest — accompanied by trusted members at exceptional private clubs.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

          {/* Footer line */}
          <div className="mt-14 text-[11px] uppercase tracking-[0.24em] text-white/75">
            By invitation <span className="mx-2">•</span> For verified members & guests
            <span className="mx-2">•</span> In line with club culture
          </div>
        </div>
      </section>
    </main>
  );
}
