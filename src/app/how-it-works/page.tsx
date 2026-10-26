import Link from "next/link";
const steps = [
  ["Apply for membership", "Membership is intended for golfers belonging to selected private clubs. Applications will be reviewed and verified."],
  ["Connect with fellow members", "Find other verified members interested in reciprocal rounds and friendly matches."],
  ["Arrange a round", "Agree the details directly. Hosting is voluntary and always subject to the host club's guest policies."],
  ["Play and participate", "Enjoy reciprocal golf and, as the network grows, opt into inter-club fixtures and league events."],
];
export default function HowItWorksPage() {
  return <main className="min-h-screen bg-[#071d16] px-6 py-20 text-white"><div className="mx-auto max-w-5xl"><p className="text-xs uppercase tracking-[0.3em] text-[#d8b35a]">The Members Time experience</p><h1 className="mt-5 text-4xl font-semibold md:text-6xl">How it works</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">A considered way for verified private club members to meet, play and compete beyond their home course.</p><div className="mt-14 grid gap-5 md:grid-cols-2">{steps.map(([title,body],i)=><article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-8"><p className="text-[#d8b35a]">0{i+1}</p><h2 className="mt-4 text-2xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-white/70">{body}</p></article>)}</div><p className="mt-12 text-sm text-white/65">Membership does not guarantee access to any particular club or tee time. Club rules always take precedence.</p><Link href="/membership" className="mt-8 inline-flex rounded-full bg-[#d8b35a] px-7 py-3 font-semibold text-[#071d16]">Explore membership</Link></div></main>;
}