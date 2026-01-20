import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />

      <section className="relative">
        <div className="absolute inset-0">
          <div className="h-[680px] w-full bg-[radial-gradient(circle_at_20%_20%,rgba(197,138,58,0.20),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b2a1f]/30 to-[#0b2a1f]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
              A hosted golf experience at private members’ clubs
            </p>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Golf, by invitation — hosted by verified members.
            </h1>

            <p className="mt-5 text-lg text-white/80 md:text-xl">
              Members Time connects verified guests with verified club members who choose to host during members’ times.
              This is not discount golf — it’s a respectful, accountable hosted experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up?role=member"
                className="rounded-2xl bg-[#c58a3a] px-6 py-3 text-center font-semibold text-[#0b2a1f] hover:brightness-110"
              >
                I’m a Club Member
              </Link>
              <Link
                href="/auth/sign-up?role=guest"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold hover:bg-white/10"
              >
                I’m a Guest
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <Feature title="Verified handicaps" text="CDH + evidence checks to protect pace of play." />
              <Feature title="Members’ time only" text="Designed to align with club culture and availability." />
              <Feature title="Accountability" text="Post-round ratings keep standards high." />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Browse clubs" text="Explore curated UK clubs and see how many verified hosts are available.">
            <Link className="text-sm font-semibold text-[#c58a3a] hover:underline" href="/browse">
              Browse clubs →
            </Link>
          </Card>

          <Card title="Search hosts" text="Choose a club and view member hosts, ratings, and availability.">
            <Link className="text-sm font-semibold text-[#c58a3a] hover:underline" href="/search">
              Search hosts →
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{text}</div>
    </div>
  );
}

function Card({
  title,
  text,
  children
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/70">{text}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
