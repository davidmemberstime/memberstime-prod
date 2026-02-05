import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/home-hero.jpg"
        alt="Members Time golf course"
        fill
        priority
        className="object-cover"
      />

      {/* Soft dark overlay (already tuned, do not darken further) */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Hero content */}
      <div className="relative z-10 h-full flex items-start justify-center">
        {/* 
          THIS IS THE IMPORTANT PART:
          - items-start instead of items-center
          - padding-top to lift content upward
        */}
        <div className="w-full max-w-5xl px-6 pt-[14vh] text-center">
          {/* Logo */}
         <div className="mx-auto mb-6 w-[340px] md:w-[380px]">
  <Image
    src="/memberstime-logo.png"
    alt="Members Time"
    width={760}
    height={340}
    className="w-full h-auto"
    priority
  />
</div>


          {/* Headline */}
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] leading-tight text-white">
            A hosted golf experience
            <br />
            at the world’s great private clubs
          </h1>

          {/* Subtext */}
          <p className="mt-4 text-sm text-white/80 max-w-2xl mx-auto">
            Play top-rated courses as an invited guest — accompanied by trusted
            members at exceptional private clubs.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/sign-up?type=member"
              className="px-8 py-3 text-xs uppercase tracking-[0.25em] border border-white/60 text-white hover:bg-white/10 transition"
            >
              I’m a Club Member
            </Link>

            <Link
              href="/auth/sign-up?type=guest"
              className="px-8 py-3 text-xs uppercase tracking-[0.25em] bg-[#d8b35a] text-[#041b14] hover:bg-[#e2c06d] transition"
            >
              I’m a Guest
            </Link>
          </div>

          {/* Footer line */}
          <p className="mt-10 text-[10px] uppercase tracking-[0.35em] text-white/60">
            By invitation &nbsp;•&nbsp; For verified members & guests &nbsp;•&nbsp;
            In line with club culture
          </p>
        </div>
      </div>
    </main>
  );
}

