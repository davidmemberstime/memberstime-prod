import Image from "next/image";
import Link from "next/link";

const features = [
  ["Reciprocal golf", "Meet verified members of other private clubs and arrange mutually agreed rounds, subject to each club's rules."],
  ["A wider golfing circle", "Build friendships and connections with fellow members who share your passion for the game."],
  ["Friendly competition", "Discover inter-club matches and a future Members Time league built around sportsmanship."],
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#071d16] text-white">
    <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden">
      <Image src="/home-hero.jpg" alt="Members Time golf course" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#041b14]/70 via-[#041b14]/50 to-[#071d16]" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <Image src="/memberstime-headerlogo.png" alt="Members Time" width={240} height={240} className="mx-auto mb-8 h-40 w-auto object-contain md:h-48" priority />
        <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[#e6c77e]">A private golfing network</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Your club is where you belong.<br /><span className="text-[#e6c77e]">Your game can take you further.</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/85">An exclusive community connecting verified members of distinguished golf clubs for reciprocal rounds, meaningful friendships and friendly competition.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/membership" className="rounded-full bg-[#d8b35a] px-8 py-3.5 font-semibold text-[#071d16] hover:brightness-110">Explore membership</Link>
          <Link href="/how-it-works" className="rounded-full border border-white/40 px-8 py-3.5 font-medium hover:bg-white/10">How it works</Link>
        </div>
        <p className="mt-8 text-xs text-white/65">Membership subject to verification and acceptance.</p>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#d8b35a]">More than a round of golf</p>
      <h2 className="mx-auto mt-5 max-w-3xl text-center text-3xl font-semibold md:text-5xl">The privilege of belonging. <span className="text-[#d8b35a]">The pleasure of playing elsewhere.</span></h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">{features.map(([title,body],i)=><article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-8"><p className="text-[#d8b35a]">0{i+1}</p><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-white/70">{body}</p></article>)}</div>
    </section>
    <section className="border-y border-white/10 bg-[#0b281e] px-6 py-20 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#d8b35a]">Built on mutual respect</p><h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold md:text-5xl">The right people. The right clubs. The right spirit.</h2><p className="mx-auto mt-6 max-w-2xl leading-8 text-white/75">Members Time respects private club traditions and policies. We do not sell access to clubs or override their guest rules.</p><Link href="/membership" className="mt-8 inline-flex rounded-full bg-[#d8b35a] px-8 py-3 font-semibold text-[#071d16]">Discover membership</Link></section>
  </main>;
}
