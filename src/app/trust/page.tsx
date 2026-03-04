// src/app/trust/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Trust & Verification | Members Time",
  description:
    "How Members Time verifies guests and members to protect clubs, standards, and the hosted experience.",
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#0b2a1f] text-white">
      {/* top glow */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_20%_-10%,rgba(197,138,58,0.18),transparent_60%),radial-gradient(900px_420px_at_80%_-10%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-16">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
            Trust • Verification • Accountability
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Trust &amp; Verification
          </h1>

          <p className="mt-4 max-w-2xl text-white/70">
            Members Time protects clubs and standards with proportionate checks,
            clear accountability, and transparent rules for both guests and
            members.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/for-guests"
              className="rounded-xl bg-[#c58a3a] px-5 py-3 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
            >
              I’m a guest → create profile
            </Link>
            <Link
              href="/for-members"
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08]"
            >
              I’m a club member → create profile
            </Link>
            <Link
              href="/browse"
              className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08]"
            >
              Browse clubs
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        {/* Guests vs Members */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="For Guests">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Create a profile with your basic details (kept private by
                default).
              </li>
              <li>
                Handicap evidence may be requested where appropriate (now or
                later).
              </li>
              <li>
                Identity verification may be required for certain access or
                where risk signals are detected.
              </li>
              <li>
                Post-round ratings and reporting help keep standards high.
              </li>
            </ul>
          </Card>

          <Card title="For Members">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Light-touch checks to confirm you’re eligible to host (club
                affiliation where needed).
              </li>
              <li>
                Hosting rules protect pace of play, etiquette, and club culture.
              </li>
              <li>
                Members remain in control: you decide whether to host and when.
              </li>
              <li>
                Misuse, poor conduct, or repeated reports can lead to
                restrictions or removal.
              </li>
            </ul>
          </Card>
        </div>

        {/* How it works */}
        <div className="mt-8">
          <Card title="How verification works">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["1", "Create a profile", "Basic account details and role."],
                [
                  "2",
                  "Provide information",
                  "Optional CDH/handicap, phone, and relevant details.",
                ],
                [
                  "3",
                  "If prompted, upload evidence",
                  "Only requested when needed (e.g., ID/handicap/affiliation).",
                ],
                [
                  "4",
                  "Get verified status",
                  "Displayed on your profile to build confidence and trust.",
                ],
              ].map(([n, t, d]) => (
                <div
                  key={n}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                    Step {n}
                  </div>
                  <div className="mt-2 font-semibold">{t}</div>
                  <div className="mt-2 text-sm text-white/70">{d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Accountability */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card title="Accountability & reporting">
            <ul className="list-disc pl-5 space-y-2">
              <li>Post-round ratings help maintain quality and fairness.</li>
              <li>
                Misconduct can be reported and reviewed with a clear audit
                trail.
              </li>
              <li>
                Actions may include warnings, temporary restriction, or removal.
              </li>
              <li>
                Clubs and members are protected by proportionate enforcement.
              </li>
            </ul>
          </Card>

          <Card title="Data & privacy (plain English)">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We store what’s needed to run the platform (name, email, role,
                profile details).
              </li>
              <li>
                Optional evidence (ID/handicap) is requested only when needed.
              </li>
              <li>We do not sell your data.</li>
              <li>
                Evidence is retained only as long as required for verification
                and compliance.
              </li>
            </ul>
            <p className="mt-4 text-white/60">
              (Add your Privacy Policy link when you’re ready.)
            </p>
          </Card>
        </div>

        {/* CTA bottom */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Ready to start?
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Create a profile in under a minute — verification remains
                proportionate and respectful.
              </p>
            </div>

            <div className="mt-5 md:mt-0 flex flex-wrap gap-3">
              <Link
                href="/for-guests"
                className="rounded-xl bg-[#c58a3a] px-5 py-3 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
              >
                Guest registration
              </Link>
              <Link
                href="/for-members"
                className="rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08]"
              >
                Member registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
