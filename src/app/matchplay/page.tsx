import Link from "next/link";
import { competition, entryRequirements } from "@/lib/matchplay/demo";

export const metadata = { title: "National Match Play | Members Time", description: "Discover the planned Members Time National Match Play Championship." };

export default function MatchplayPage() {
 return <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
  <div className="mb-4 inline-flex rounded-full border border-[#d4af37]/50 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#e4ca75]">{competition.status} · {competition.year}</div>
  <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">The National <span className="text-[#d4af37]">Match Play</span> Championship</h1>
  <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">A nationwide knockout championship bringing together members of outstanding golf clubs. Regional fixtures, competitive match play and a proposed national final.</p>
  <div className="mt-9 flex flex-wrap gap-3"><Link href="/matchplay/format" className="rounded-full bg-[#d4af37] px-6 py-3 font-semibold text-[#092219]">Explore the format</Link><Link href="/matchplay/draw" className="rounded-full border border-white/30 px-6 py-3">Preview the draw</Link><Link href="/matchplay/entry" className="rounded-full border border-white/30 px-6 py-3">Entry information</Link></div>
  <section className="mt-16 grid gap-5 md:grid-cols-3">{[["01","Regional rounds","Compete in a structured knockout draw with fixtures arranged between opponents."],["02","Progress through the draw","Winning players advance round by round, subject to result confirmation."],["03","National final","The championship concludes with a proposed showcase final; venue and dates are not yet confirmed."]].map(([number,title,body])=><div key={number} className="rounded-2xl border border-white/15 bg-white/5 p-7"><div className="text-3xl font-semibold text-[#d4af37]">{number}</div><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-white/70">{body}</p></div>)}</section>
  <section className="mt-16 rounded-2xl border border-white/15 bg-[#12382a] p-7 md:p-10"><h2 className="text-2xl font-semibold">Who will be eligible?</h2><ul className="mt-5 grid gap-3 md:grid-cols-2">{entryRequirements.map(item=><li key={item} className="flex gap-3 text-white/80"><span className="text-[#d4af37]">✓</span>{item}</li>)}</ul><p className="mt-7 text-sm text-white/60">Competition entry is not yet open. Handicap access, official rules, fees, venues and dates are subject to confirmation. This championship is not represented as endorsed by any governing body.</p></section>
 </main>;
}
