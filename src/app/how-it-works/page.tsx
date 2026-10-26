import Link from "next/link";

const steps = [
  { number: "01", title: "Check your home club is eligible", body: "Members Time is exclusively for golfers who are current members of a club on our qualifying club directory. The directory focuses on Top 100 and similarly prestigious private golf clubs. Before applying, check that your home club appears on our list.", note: "A club appearing on the list means its members may be eligible to apply; it does not mean the club has endorsed or partnered with Members Time." },
  { number: "02", title: "Apply and verify your membership", body: "Create an account, select your home club and submit your membership application. We review applications and verify that you belong to the club you have named before granting access to the members-only network.", note: "Approval is not automatic. You must remain an eligible club member to use the network." },
  { number: "03", title: "Discover golfers at other clubs", body: "Once approved and your access is active, you can browse members who have chosen to be visible to the network. Explore their home clubs and find someone you would like to meet for a reciprocal round.", note: "You are connecting with individual golfers, not booking directly with their clubs." },
  { number: "04", title: "Send a friendly introduction", body: "Send an introduction request to a fellow member. They can accept or decline; hosting is entirely voluntary. Once they accept, you can message privately to get acquainted and discuss whether a round would suit you both.", note: "No member is obliged to host or accept a request." },
  { number: "05", title: "Agree the reciprocal arrangement", body: "If both members are happy, arrange a suitable date, format and venue together. You might welcome them to your home course on one occasion and visit theirs on another. You can agree the order and timing that works best for you.", note: "All visits are subject to the host club's guest policies, visitor eligibility, availability and any applicable green fees. Reciprocal rounds are not guaranteed." },
  { number: "06", title: "Enjoy the golf and grow your circle", body: "Meet on the first tee, enjoy a round and make a new golfing connection. Over time, Members Time can help you build a trusted circle of golfers at other eligible clubs across the country.", note: "The best part of the network is the people you meet, not simply the courses you visit." },
];

export default function HowItWorksPage() {
  return <main className="min-h-screen bg-[#f7f4ec] text-[#17392c]">
    <section className="border-b border-[#ded5c5] bg-[#173c2e] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e6c77e]">Your guide to Members Time</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">How it works</h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-white/80">From verifying your home-club membership to making your first introduction, discover how reciprocal golf works through our exclusive member-to-member network.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/browse" className="rounded-full bg-[#d8b35a] px-8 py-3.5 font-semibold text-[#10291f]">Check eligible clubs</Link>
          <Link href="/membership" className="rounded-full border border-white/40 px-8 py-3.5 font-semibold text-white">Membership details</Link>
        </div>
      </div>
    </section>

    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#98732e]">Six simple steps</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">From your home club to a wider world of golf.</h2><p className="mt-6 leading-8 text-[#52655a]">Membership is selective, introductions are personal and every reciprocal round begins with two golfers who genuinely want to play together.</p></div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {steps.map(step => <article key={step.number} className="border border-[#e1d7c6] bg-[#fffdf8] p-8 shadow-sm md:p-10">
            <p className="font-serif text-5xl text-[#b6954f]">{step.number}</p>
            <div className="mt-7 h-px w-14 bg-[#b6954f]" />
            <h3 className="mt-7 font-serif text-2xl md:text-3xl">{step.title}</h3>
            <p className="mt-5 leading-8 text-[#40564b]">{step.body}</p>
            <p className="mt-6 border-t border-[#e7dfd1] pt-5 text-sm leading-7 text-[#647268]">{step.note}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="bg-[#ede7db] px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#98732e]">An example arrangement</p><h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">A welcome at another course.</h2></div>
        <div className="border-l-2 border-[#b6954f] pl-7"><p className="text-lg leading-9 text-[#40564b]">Imagine you belong to an eligible club in Dorset and discover an approved member at another eligible club in Scotland. You send an introduction; they accept. After getting to know each other, you agree a date when they can welcome you as their guest, subject to their club's rules. You might then offer to host them at your own club on a future visit.</p><p className="mt-5 text-sm leading-7 text-[#647268]">The reciprocal arrangement is agreed between members. Neither visit is automatic, and there is no requirement to exchange rounds.</p></div>
      </div>
    </section>

    <section className="bg-[#173c2e] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#e6c77e]">Looking ahead</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">Friendly competition, too.</h2><p className="mx-auto mt-6 max-w-3xl leading-8 text-white/80">We're also planning a Members Time match-play tournament, bringing members together through friendly competition and a shared love of the game. Tournament details, entry criteria and formats will be announced when the feature is ready.</p><p className="mt-5 text-sm text-white/60">The match-play tournament is a future feature and is not currently open for entries.</p></div>
    </section>

    <section className="px-6 py-20 text-center"><h2 className="font-serif text-4xl md:text-5xl">Ready to explore?</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#52655a]">Start by checking that your home club is included in the qualifying directory, then learn more about applying for membership.</p><div className="mt-9 flex flex-wrap justify-center gap-4"><Link href="/browse" className="rounded-full border border-[#b6954f] px-8 py-3.5 font-semibold">View eligible clubs</Link><Link href="/membership" className="rounded-full bg-[#17392c] px-8 py-3.5 font-semibold text-white">Explore membership</Link></div></section>
  </main>;
}
