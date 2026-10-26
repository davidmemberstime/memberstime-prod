import Image from "next/image";
import Link from "next/link";

const features = [
  ["Reciprocal golf", "Meet verified members of other private clubs and arrange mutually agreed rounds, subject to each club's rules."],
  ["A wider golfing circle", "Build friendships and connections with fellow members who share your passion for the game."],
  ["Friendly competition", "Discover inter-club matches and a future Members Time league built around sportsmanship."],
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#f7f4ec] text-[#17392c]">
    <section className="relative flex min-h-[740px] items-center justify-center overflow-hidden">
      <Image src="/home-hero.jpg" alt="Members Time golf course" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071e16]/75 via-[#0c291f]/50 to-[#0c291f]/85" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center text-white">
        <Image src="/memberstime-headerlogo.png" alt="Members Time" width={240} height={240} className="mx-auto mb-8 h-40 w-auto object-contain md:h-48" priority />
        <p className="mb-7 text-xs uppercase tracking-[0.38em] text-[#e6c77e]">A private golfing society</p>
        <h1 className="font-serif text-5xl font-normal leading-[1.13] tracking-tight md:text-7xl">The art of belonging.<br /><span className="text-[#eed69c]">The freedom to explore.</span></h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/85">An exclusive golfing network for verified members of qualifying Top 100 and similarly prestigious private golf clubs. Make new connections and explore opportunities to play beyond your home course.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/membership" className="rounded-full bg-[#d8b35a] px-8 py-3.5 font-semibold text-[#071d16] hover:brightness-110">Explore membership</Link>
          <Link href="/how-it-works" className="rounded-full border border-white/40 px-8 py-3.5 font-medium hover:bg-white/10">How it works</Link>
        </div>
        <p className="mt-8 text-xs text-white/65">Membership subject to verification and acceptance.</p>
      </div>
    </section>
    <section className="border-b border-[#dfd6c5] bg-[#f7f4ec] px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div><p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#98732e]">A private world of golf</p>
          <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">Extraordinary courses. Enduring friendships.</h2>
          <div className="mt-7 h-px w-24 bg-[#b6954f]" />
          <p className="mt-8 max-w-xl text-lg leading-9 text-[#40564b]">Members Time is an exclusive community for verified members of qualifying Top 100 and similarly prestigious private golf clubs.</p>
          <p className="mt-5 max-w-xl leading-8 text-[#40564b]">Discover like-minded golfers, build lasting friendships and explore the pleasure of playing together beyond your home course.</p>
          <Link href="/membership" className="mt-9 inline-flex items-center border-b border-[#b6954f] pb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#17392c]">Explore membership <span className="ml-3">→</span></Link>
        </div>
        <div className="relative overflow-hidden border border-white shadow-2xl shadow-[#17392c]/15">
          <Image src="/home-hero.jpg" alt="Golf course landscape" width={850} height={1000} className="aspect-[4/5] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102c21]/85 to-transparent px-8 pb-9 pt-24 text-white"><p className="text-xs uppercase tracking-[0.24em] text-[#eed69c]">Membership by application</p><p className="mt-2 font-serif text-2xl">A more personal way to play.</p></div>
        </div>
      </div>
    </section>
    <section className="bg-[#fffdf8] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-[#98732e]">The Members Time experience</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-center font-serif text-4xl md:text-6xl">An invitation to something exceptional.</h2>
        <p className="mx-auto mt-6 max-w-2xl text-center leading-8 text-[#52655a]">Thoughtful introductions, shared experiences and a genuine respect for the traditions of every club.</p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map(([title,body],i)=><article key={title} className="group border border-[#e4ddcf] bg-[#f7f4ec] px-8 py-10 shadow-sm transition-shadow hover:shadow-xl">
            <p className="font-serif text-4xl text-[#b6954f]">0{i+1}</p><div className="mt-7 h-px w-12 bg-[#b6954f]" /><h3 className="mt-7 font-serif text-2xl">{title}</h3><p className="mt-4 leading-8 text-[#52655a]">{body}</p>
          </article>)}
        </div>
      </div>
    </section>
    <section className="bg-[#173c2e] px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl text-center"><p className="text-xs uppercase tracking-[0.32em] text-[#e6c77e]">A considered introduction</p>
        <h2 className="mt-5 font-serif text-4xl md:text-6xl">How membership works</h2>
        <div className="mt-16 grid gap-10 text-left md:grid-cols-3">
          {[["01","Apply & verify","Apply with your qualifying home club. Membership is verified and applications are individually reviewed."],["02","Meet members","Connect with approved members who have opted into introductions across the network."],["03","Arrange a round","Arrange golf by mutual agreement, subject to the host club’s guest policies, fees and availability."]].map(([n,title,body])=><div key={n} className="border-t border-[#c5a76a]/70 pt-7"><span className="font-serif text-4xl text-[#e6c77e]">{n}</span><h3 className="mt-5 font-serif text-2xl">{title}</h3><p className="mt-4 leading-8 text-white/75">{body}</p></div>)}
        </div><p className="mx-auto mt-12 max-w-3xl text-sm leading-7 text-white/65">Members Time facilitates introductions between individuals. It is not affiliated with or endorsed by every club listed, and membership does not guarantee a tee time or access to any club.</p>
        <Link href="/how-it-works" className="mt-9 inline-flex rounded-full border border-[#d8b35a] px-9 py-3.5 font-semibold text-[#eed69c] hover:bg-white/10">Discover how it works</Link>
      </div>
    </section>
    <section className="bg-[#f6f3eb] px-6 py-24 text-[#17392c]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden border border-[#d9c9a8] bg-[#e5e1d5] shadow-xl shadow-[#163a2a]/10">
          <Image src="/home-hero.jpg" alt="A golf course, representing the inspiration behind Members Time" width={900} height={1050} className="aspect-[4/5] w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#102d22]/90 to-transparent px-7 pb-7 pt-20 text-sm tracking-wide text-white">The game that brings us together</div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#98732e]">The story behind Members Time</p>
          <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight md:text-5xl">Born from a love of the game.</h2>
          <div className="mt-6 h-px w-20 bg-[#b6954f]" />
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#42564c]">Members Time began with a simple idea: belonging to a great golf club can be the beginning of golfing friendships that reach far beyond your home course.</p>
          <p className="mt-5 max-w-xl leading-8 text-[#42564c]">Inspired by the enjoyment of playing at Parkstone and meeting golfers from other clubs, the network is designed to bring verified members of qualifying leading private clubs together through genuine introductions, shared rounds and mutual respect.</p>
          <p className="mt-5 max-w-xl leading-8 text-[#42564c]">Not a shortcut around club traditions, but a more personal way to discover the people who make the game special.</p>
          <Link href="/how-it-works" className="mt-9 inline-flex rounded-full bg-[#17392c] px-8 py-3.5 font-semibold text-white hover:bg-[#24523e]">Discover how it works</Link>
        </div>
      </div>
    </section>
    <section className="border-t border-[#dfd6c5] bg-[#eee8db] text-[#17392c] px-6 py-20 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#d8b35a]">Built on mutual respect</p><h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl md:text-5xl">A shared love of golf. A respect for every club.</h2><p className="mx-auto mt-6 max-w-2xl leading-8 text-[#52655a]">Members Time respects private club traditions and policies. We do not sell access to clubs or override their guest rules.</p><Link href="/membership" className="mt-8 inline-flex rounded-full bg-[#d8b35a] px-8 py-3 font-semibold text-[#071d16]">Discover membership</Link></section>
  </main>;
}
