import Link from "next/link";

export const metadata = {
  title: "Match Play Championships | Members Time",
  description: "Discover the proposed Members Time Singles and Pairs Match Play Championships, open to verified golfers from eligible leading golf clubs.",
};

const competitions = [
  { title: "Singles Championship", label: "One golfer. One national title.", member: "£39", guest: "£69", note: "Per player", details: "Compete individually in single-leg knockout match play against golfers from other eligible clubs." },
  { title: "Pairs Championship", label: "Two golfers. One team.", member: "£69", guest: "£119", note: "Per pair", details: "Four-ball better-ball match play. Partners may belong to different eligible clubs and do not need a linked subscription." },
];
const stages = [
  { n: "01", title: "Local regional qualifiers", detail: "Begin in a geographically grouped knockout bracket, aiming for manageable local journeys. Each tie is one match at one competitor's home club." },
  { n: "02", title: "Super-regional championships", detail: "Regional champions enter the Gold pathway; regional runners-up enter Silver. Meet golfers from further afield and experience new courses." },
  { n: "03", title: "National championships", detail: "Successful super-regional qualifiers progress to the national Gold Cup or Silver Plate, with separate singles and pairs titles." },
];
const trophies = [
  { name: "MT Gold Cup", detail: "Singles · Gold pathway", gold: true },
  { name: "MT Silver Plate", detail: "Singles · Silver pathway", gold: false },
  { name: "MT Pairs Gold Cup", detail: "Pairs · Gold pathway", gold: true },
  { name: "MT Pairs Silver Plate", detail: "Pairs · Silver pathway", gold: false },
];
const regions = [
  "South Coast & South West", "South East", "Thames Valley & Central", "Midlands",
  "North of England", "Wales", "Scotland", "Ireland",
];
export default function MatchPlay() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#173a2b]">
      <section className="relative overflow-hidden bg-[#123729] px-6 py-24 text-white md:py-32">
        <div className="pointer-events-none absolute -right-28 top-8 h-96 w-96 rounded-full border border-[#c5a365]/20 md:h-[36rem] md:w-[36rem]" />
        <div className="pointer-events-none absolute -right-12 top-24 h-72 w-72 rounded-full border border-[#c5a365]/15 md:h-[28rem] md:w-[28rem]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#e4c77d]">Members Time · The Championships</p>
          <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[1.08] md:text-7xl">Play Britain's finest courses.<br /><span className="text-[#e4c77d]">Compete for the Cups.</span></h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75">An exclusive match-play championship for verified members of eligible leading golf clubs. Enter as a singles player or a pair, represent your club and progress from local rivalries to the national stage.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4"><span className="border border-[#e4c77d]/60 px-5 py-3 text-sm font-medium text-[#e4c77d]">Launching soon · Entries not yet open</span><a href="#format" className="text-sm font-semibold text-white underline decoration-[#e4c77d] underline-offset-8">Explore the format</a></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20" id="competitions">
        <p className="text-xs uppercase tracking-[0.28em] text-[#967538]">Two ways to compete</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">Singles or pairs. Your road to the national final.</h2>
        <p className="mt-5 max-w-3xl leading-8 text-[#647468]">Open to Members Time subscribers and non-subscribers alike, provided every competitor is verified as a current member of an eligible club. A Members Time subscription gives you a reduced entry price.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {competitions.map(c => <article key={c.title} className="border border-[#ded5c5] bg-white p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#a17f3e]">{c.label}</p><h3 className="mt-4 font-serif text-3xl">{c.title}</h3><p className="mt-4 min-h-20 leading-7 text-[#647468]">{c.details}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#e8e1d6] pt-6"><div><p className="text-xs text-[#647468]">Members Time</p><p className="mt-2 font-serif text-4xl">{c.member}</p></div><div><p className="text-xs text-[#647468]">Non-members</p><p className="mt-2 font-serif text-4xl">{c.guest}</p></div></div>
            <p className="mt-4 text-sm text-[#647468]">{c.note} · One entry covers every qualifying stage</p>
            {c.title.startsWith("Pairs") && <p className="mt-2 text-sm text-[#647468]">Mixed pair (one subscriber): £94 per team</p>}
          </article>)}
        </div>
        <p className="mt-5 text-sm leading-6 text-[#647468]">Proposed launch prices, subject to confirmation. Entry does not include a Members Time subscription, guest green fees, travel or accommodation. The away golfer pays any applicable member-guest green fee. Course access and rates remain subject to club permission and availability.</p>
      </section>

      <section id="format" className="bg-[#ece7dc] px-6 py-20"><div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[#967538]">The championship journey</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">Local pride. Wider horizons. National glory.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">{stages.map(s => <article key={s.n} className="border border-[#d9cfbc] bg-[#f7f4ed] p-8"><span className="font-serif text-4xl text-[#a78747]">{s.n}</span><h3 className="mt-6 font-serif text-2xl">{s.title}</h3><p className="mt-4 leading-7 text-[#647468]">{s.detail}</p></article>)}</div>
        <div className="mt-10 border-l-2 border-[#ad8c4b] pl-6"><p className="font-medium">Earn your place. Never pay another entry fee to progress.</p><p className="mt-2 leading-7 text-[#647468]">Regional winners follow the Gold route; regional runners-up follow the Silver route. Both pathways operate independently for singles and pairs. Exact draw sizes, match rules and regional boundaries will be confirmed before registration.</p></div>
      </div></section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-[#967538]">The honours</p><h2 className="mt-4 font-serif text-4xl md:text-5xl">Four national titles. One Members Time tradition.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{trophies.map(t => <article key={t.name} className="border border-[#ded5c5] bg-white p-7 text-center"><div aria-hidden="true" className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-3xl ${t.gold ? "border-[#c4a15a] bg-[#f6f0e0] text-[#9b7935]" : "border-[#b8c1c0] bg-[#edf0ef] text-[#6b7978]"}`}>{t.gold ? "★" : "✦"}</div><h3 className="mt-5 font-serif text-2xl">{t.name}</h3><p className="mt-3 text-sm text-[#647468]">{t.detail}</p></article>)}</div>
      </section>

      <section className="bg-[#173a2b] px-6 py-20 text-white"><div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[#e4c77d]">From your home club to new fairways</p><h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl">A chance to play somewhere extraordinary.</h2><p className="mt-6 max-w-3xl leading-8 text-white/75">Start close to home, then meet fellow competitors from other regions as you advance. The ambition is to create memorable matches at leading clubs across Britain and Ireland, subject to each club's access arrangements.</p>
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{regions.map(r => <div key={r} className="border border-white/20 px-5 py-4 text-sm text-white/85">{r}</div>)}</div><p className="mt-5 text-sm text-white/55">Illustrative super-regions; final groupings depend on entrant numbers and travel practicality.</p>
      </div></section>

      <section className="mx-auto max-w-6xl px-6 py-20"><div className="grid gap-10 md:grid-cols-2">
        <div><p className="text-xs uppercase tracking-[0.28em] text-[#967538]">Who can enter?</p><h2 className="mt-4 font-serif text-4xl">Membership of an eligible club is the key.</h2><p className="mt-5 leading-8 text-[#647468]">You do not have to subscribe to Members Time to enter. Every golfer must hold current membership at a club on the approved championship list and pass verification. Pairs partners can belong to different eligible clubs.</p><p className="mt-4 leading-8 text-[#647468]">The proposed pairs format is four-ball better-ball match play. Each knockout tie is a single match, with the away golfer responsible for any applicable member-guest green fee at the host club. Handicaps, tie-breaks, venue allocation and deadlines will be covered by the published competition rules.</p></div>
        <div className="border border-[#ded5c5] bg-white p-8 md:p-10"><p className="text-xs uppercase tracking-[0.2em] text-[#a17f3e]">Registration status</p><h3 className="mt-4 font-serif text-3xl">Entries opening soon.</h3><p className="mt-4 leading-7 text-[#647468]">We're finalising club eligibility, the regional draws and competition administration. No payments or entries are being accepted yet.</p><Link href="/membership" className="mt-7 inline-flex rounded-full bg-[#173a2b] px-7 py-3 font-medium text-white transition hover:bg-[#25563f]">Explore Members Time membership</Link><p className="mt-5 text-sm text-[#647468]">Joining Members Time is optional for championship eligibility, but subscribers receive discounted entry and separate member-network benefits.</p></div>
      </div></section>
    </main>
  );
}
