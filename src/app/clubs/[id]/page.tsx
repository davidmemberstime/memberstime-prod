import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import HostsClient, { HostCard } from "./HostsClient";

type ClubRow = {
  id: string;
  name: string;
  region: string;
  country: string;
  tier: "Curated" | "Prestigious";
  guests_max: number;
  clubhouse_contribution_gbp: number;
  address: string | null;
  town: string | null;
  postcode: string | null;
  website: string | null;
  logo_url: string | null;
};

function moneyGBP(value: number | null | undefined) {
  const n = Number(value || 0);
  return `£${n.toLocaleString("en-GB")}`;
}

export default async function ClubPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select(
      "id,name,region,country,tier,guests_max,clubhouse_contribution_gbp,address,town,postcode,website,logo_url"
    )
    .eq("id", params.id)
    .single();

  if (clubError || !club) return notFound();

  const c = club as ClubRow;

  const websiteHref =
    c.website && c.website.startsWith("http")
      ? c.website
      : c.website
      ? `https://${c.website}`
      : null;

  // ✅ Hosts query (host_profiles joined to profiles)
  // NOTE: We only select columns that exist in your screenshots.
  const { data: hostRows } = await supabase
    .from("host_profiles")
    .select(
      `
      id,
      hosted_rounds,
      rehost_rate,
      is_accepting,
      profiles:profiles (
        full_name,
        cdh_number
      )
    `
    )
    .eq("club_id", params.id);

  const hosts: HostCard[] =
    (hostRows || []).map((h: any) => ({
      host_profile_id: h.id,
      hosted_rounds: h.hosted_rounds ?? 0,
      rehost_rate:
        h.rehost_rate === null || h.rehost_rate === undefined
          ? null
          : Number(h.rehost_rate),
      is_accepting: h.is_accepting ?? true,
      full_name: h.profiles?.full_name ?? null,
      cdh_number: h.profiles?.cdh_number ?? null,
    })) || [];

  return (
    <main className="min-h-screen bg-[#071e17] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="relative h-[260px] w-full">
          <Image
            src="/home-hero.jpg"
            alt="Members Time"
            fill
            priority
            className="object-cover brightness-[0.65]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#071e17]" />
        </div>

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl items-end px-6 pb-10">
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                  {c.tier}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                  {c.region}, {c.country}
                </span>
              </div>

              <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                {c.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm md:text-base text-white/70">
                A hosted golf experience, delivered with respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CARD */}
      <div className="mx-auto max-w-6xl px-6 -mt-10 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-5">
              {c.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo_url}
                  alt={`${c.name} logo`}
                  className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 object-contain p-2"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70">
                  Logo
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Guests allowed
                    </div>
                    <div className="mt-1 text-2xl font-semibold">
                      {c.guests_max}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Clubhouse contribution
                    </div>
                    <div className="mt-1 text-2xl font-semibold">
                      {moneyGBP(20)}
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Paid to the club on the day (goodwill).
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Status
                    </div>
                    <div className="mt-1 text-2xl font-semibold">Active</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h2 className="text-sm font-semibold text-white/90">Address</h2>
                <div className="mt-3 text-sm text-white/70">
                  {c.address ? <div>{c.address}</div> : null}
                  {c.town ? <div>{c.town}</div> : null}
                  {c.postcode ? <div>{c.postcode}</div> : null}
                  {!c.address && !c.town && !c.postcode ? (
                    <div className="text-white/60">Not added yet</div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h2 className="text-sm font-semibold text-white/90">Website</h2>
                <div className="mt-3 text-sm text-white/70">
                  {websiteHref ? (
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#d8b35a] hover:underline"
                    >
                      {c.website}
                    </a>
                  ) : (
                    <div className="text-white/60">Not added yet</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/browse"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                ← Back to browse
              </a>

              <a
                href="#hosts"
                className="inline-flex items-center justify-center rounded-xl bg-[#d8b35a] px-4 py-2 text-sm font-semibold text-[#041b14] hover:brightness-110"
              >
                View hosts
              </a>
            </div>
          </div>

          {/* HOSTS */}
          <HostsClient clubId={c.id} clubName={c.name} hosts={hosts} />
        </div>
      </div>
    </main>
  );
}
