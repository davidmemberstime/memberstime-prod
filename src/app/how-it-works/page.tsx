// src/app/how-it-works/page.tsx
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#0b2a1f] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
            Hosted access · Clear standards · Accountability
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            How it works
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70">
            Members Time connects verified guests with verified club members who choose to host during
            members’ times — aligned with club culture and standards.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="rounded-xl bg-[#d6ab52] px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
            >
              Browse clubs
            </Link>
            <Link
              href="/for-guests"
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition"
            >
              I’m a guest
            </Link>
            <Link
              href="/for-members"
              className="rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
            >
              I’m a club member
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-white/10 my-2 md:my-4" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FlowCard
            title="For guests"
            steps={[
              "Create a guest profile (kept private by default).",
              "Browse clubs and understand access standards.",
              "Request a hosted round where a verified member is available.",
              "Play with respect for pace, etiquette, and club culture.",
              "Leave post-round feedback to keep standards high.",
            ]}
            ctaHref="/for-guests"
            ctaText="Create guest profile"
          />

          <FlowCard
            title="For members"
            steps={[
              "Create a member profile and complete verification where needed.",
              "Choose whether to host and when.",
              "Review requests and accept guests you’re comfortable hosting.",
              "Host within your club’s rules and standards.",
              "Use feedback and reporting to protect the experience.",
            ]}
            ctaHref="/for-members"
            ctaText="Create member profile"
          />
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <h3 className="text-lg font-semibold">Why verification exists</h3>
          <p className="mt-2 text-sm text-white/70 max-w-3xl">
            Verification is proportionate and designed to prevent misuse, protect pace of play, and
            preserve club standards — so the hosted experience stays respectful and accountable.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/trust"
              className="rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
            >
              Trust & verification
            </Link>
            <Link
              href="/browse"
              className="rounded-xl bg-[#d6ab52] px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
            >
              Browse clubs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowCard({
  title,
  steps,
  ctaHref,
  ctaText,
}: {
  title: string;
  steps: string[];
  ctaHref: string;
  ctaText: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ol className="mt-4 space-y-3 text-sm text-white/75">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-xs text-white/70">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <Link
          href={ctaHref}
          className="inline-flex rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
