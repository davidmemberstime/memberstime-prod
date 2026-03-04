// src/app/trust/page.tsx
import Link from "next/link";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#0b2a1f] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft gradient wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_20%,rgba(214,171,82,0.10),rgba(255,255,255,0)_55%)]" />

        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10 md:pt-20 md:pb-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
            Trust · Verification · Accountability
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
            Trust &amp; Verification
          </h1>

          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70">
            Members Time protects clubs and standards with proportionate checks, clear accountability,
            and transparent rules for both guests and members.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/for-guests"
              className="rounded-xl bg-[#d6ab52] px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
            >
              I’m a guest → create profile
            </Link>

            <Link
              href="/for-members"
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition"
            >
              I’m a club member → create profile
            </Link>

            <Link
              href="/browse"
              className="rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
            >
              Browse clubs
            </Link>
          </div>
        </div>

        {/* subtle divider under hero */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-white/10 my-2 md:my-4" />
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        {/* Two main cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <h2 className="text-lg font-semibold">For Guests</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Create a profile with your basic details (kept private by default).
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Handicap evidence may be requested where appropriate (now or later).
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Identity verification may be required for certain access or where risk signals are detected.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Post-round ratings and reporting help keep standards high.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <h2 className="text-lg font-semibold">For Members</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Light-touch checks to confirm you’re eligible to host (club affiliation where needed).
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Hosting rules protect pace of play, etiquette, and club culture.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Members remain in control: you decide whether to host and when.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#d6ab52]" />
                Misuse, poor conduct, or repeated reports can lead to restrictions or removal.
              </li>
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StepCard
            k="01"
            title="Proportionate checks"
            body="Verification is applied where it protects the experience — not as friction for its own sake."
          />
          <StepCard
            k="02"
            title="Transparent rules"
            body="Guests and members know what’s expected: pace, etiquette, accountability, and respect."
          />
          <StepCard
            k="03"
            title="Accountability"
            body="Post-round ratings help keep standards high and discourage misuse."
          />
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to browse?</h3>
              <p className="mt-1 text-sm text-white/70">
                Explore curated UK clubs and see hosted availability.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="rounded-xl bg-[#d6ab52] px-5 py-3 text-sm font-semibold text-black hover:brightness-95 transition"
              >
                Browse clubs
              </Link>
              <Link
                href="/for-guests"
                className="rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition"
              >
                Create guest profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StepCard({ k, title, body }: { k: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.06] transition">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.28em] text-white/50">Step</span>
        <span className="text-sm font-semibold text-white/60">{k}</span>
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{body}</p>
    </div>
  );
}
