import Link from "next/link";
const steps = [
  ["Apply for membership", "You must belong to a qualifying Top 100 or similarly prestigious private golf club. We verify your home-club membership before approval."],
  ["Connect with fellow members", "Find other verified members interested in reciprocal rounds and friendly matches."],
  ["Arrange a round", "Agree the details directly. Hosting is voluntary and always subject to the host club's guest policies."],
  ["Play and participate", "Enjoy reciprocal golf and, as the network grows, opt into inter-club fixtures and league events."],
];
export default function HowItWorksPage() {
  return <main className="min-h-screen bg-[#f6f3eb] px-6 py-20 text-[#122d24]"><div className="mx-auto max-w-5xl"><p className="text-xs uppercase tracking-[0.3em] text-[#d8b35a]">The Members Time experience</p><h1 className="mt-5 text-4xl font-semibold md:text-6xl">How it works</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#42564c]">An exclusive, members-only network connecting verified golfers from qualifying Top 100 and similarly prestigious private clubs.</p><div className="mt-14 grid gap-5 md:grid-cols-2">{steps.map(([title,body],i)=><article key={title} className="rounded-2xl border border-[#c5ac74]/35 bg-white shadow-lg p-8"><p className="text-[#d8b35a]">0{i+1}</p><h2 className="mt-4 text-2xl font-semibold">{title}</h2><p className="mt-4 leading-7 text-[#42564c]">{body}</p></article>)}</div><p className="mt-12 text-sm text-[#617267]">Membership does not guarantee access to any particular club or tee time. Club rules always take precedence.</p><Link href="/membership" className="mt-8 inline-flex rounded-full bg-[#d8b35a] px-7 py-3 font-semibold text-[#071d16]">Explore membership</Link></div></main>;
}