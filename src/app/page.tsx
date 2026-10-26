import Image from "next/image";
import Link from "next/link";

const features = [
  ["Reciprocal golf", "Meet verified members of other private clubs and arrange mutually agreed rounds, subject to each club's rules."],
  ["A wider golfing circle", "Build friendships and connections with fellow members who share your passion for the game."],
  ["Friendly competition", "Discover inter-club matches and a future Members Time league built around sportsmanship."],
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#12372a] text-white">
    <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden">
      <Image src="/home-hero.jpg" alt="Members Time golf course" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09271d]/50 via-[#09271d]/30 to-[#12372a]/90" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <Image src="/memberstime-headerlogo.png" alt="Members Time" width={240} height={240} className="mx-auto mb-8 h-40 w-auto object-contain md:h-48" priority />
        <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[#e6c77e]">A private golfing network</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">The privilege of belonging.<br /><span className="text-[#e6c77e]">The pleasure of playing elsewhere.</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/85">A private community bringing together members of established golf clubs to meet, make new golfing friendships and explore opportunities to play one another’s courses.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/membership" className="rounded-full bg-[#d8b35a] px-8 py-3.5 font-semibold text-[#071d16] hover:brightness-110">Explore membership</Link>
          <Link href="/how-it-works" className="rounded-full border border-white/40 px-8 py-3.5 font-medium hover:bg-white/10">How it works</Link>
        </div>
        <p className="mt-8 text-xs text-white/65">Membership subject to verification and acceptance.</p>
      </div>
    </section>
    <section className="bg-[#194331] px-6 py-20"><div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1.15fr_1fr]"><div><p className="text-xs uppercase tracking-[0.3em] text-[#e6c77e]">What is Members Time?</p><h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">Your golfing community, beyond your home course.</h2><p className="mt-6 text-lg leading-8 text-white/85">Members Time is a private network for verified members of established golf clubs. It helps golfers meet fellow members from other clubs, discover shared interests and make introductions that may lead to enjoyable rounds at one another’s courses.</p><p className="mt-5 leading-8 text-white/80">Whether you are travelling, visiting another part of the country or simply keen to broaden your golfing circle, the idea is simple: connect with another member, get to know each other and explore playing together.</p></div><div className="rounded-2xl border border-white/20 bg-white/[0.07] p-8"><h3 className="text-2xl font-semibold">How it works</h3><ol className="mt-6 space-y-5 text-white/85"><li><strong className="text-[#e6c77e]">01 · Apply to join.</strong> We verify your membership of an eligible golf club before approving access.</li><li><strong className="text-[#e6c77e]">02 · Meet fellow golfers.</strong> Browse participating members who have chosen to be discoverable, and request an introduction.</li><li><strong className="text-[#e6c77e]">03 · Arrange a round together.</strong> If you both wish to play, agree the details directly, always respecting the host club’s guest policies, fees and availability.</li></ol><p className="mt-7 border-t border-white/20 pt-5 text-sm leading-6 text-white/70">Members Time is a member-to-member introduction network, not a tee-time booking service. Joining does not guarantee access to any particular club. Club matches and competitions are planned future features.</p><Link href="/how-it-works" className="mt-6 inline-block font-semibold text-[#e6c77e] underline underline-offset-4">Read how Members Time works</Link></div></div></section>
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-[#d8b35a]">More than a round of golf</p>
      <h2 className="mx-auto mt-5 max-w-3xl text-center text-3xl font-semibold md:text-5xl">One membership. A wider world of golf.</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">{features.map(([title,body],i)=><article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-8"><p className="text-[#d8b35a]">0{i+1}</p><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-4 leading-7 text-white/70">{body}</p></article>)}</div>
    </section>
    <section className="border-y border-white/10 bg-[#1a4534] px-6 py-20 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#d8b35a]">Built on mutual respect</p><h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold md:text-5xl">A shared love of golf. A respect for every club.</h2><p className="mx-auto mt-6 max-w-2xl leading-8 text-white/75">Members Time respects private club traditions and policies. We do not sell access to clubs or override their guest rules.</p><Link href="/membership" className="mt-8 inline-flex rounded-full bg-[#d8b35a] px-8 py-3 font-semibold text-[#071d16]">Discover membership</Link></section>
  </main>;
}
