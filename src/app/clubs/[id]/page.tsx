import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ClubRow = {
  id: string;
  name: string;
  region: string;
  country: string;
  tier: "Curated" | "Prestigious";
  guests_max: 1 | 2;
  clubhouse_contribution_gbp: number;
  address: string | null;
  town: string | null;
  postcode: string | null;
  website: string | null;
  logo_url: string | null;
};

export default async function ClubPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: club, error } = await supabase
    .from("clubs")
    .select(
      "id,name,region,country,tier,guests_max,clubhouse_contribution_gbp,address,town,postcode,website,logo_url"
    )
    .eq("id", params.id)
    .single();

  if (error || !club) return notFound();

  const c = club as ClubRow;

  const websiteHref =
    c.website && c.website.startsWith("http")
      ? c.website
      : c.website
      ? `https://${c.website}`
      : null;

  return (
    <main>
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-4">
            {c.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.logo_url}
                alt={`${c.name} logo`}
                className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 object-contain p-2"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-white/70">
                Logo
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {c.name}
                </h1>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  {c.tier}
                </span>
              </div>

              <p className="mt-2 text-white/70">
                {c.region}, {c.country}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">Guests allowed</div>
                  <div className="text-lg font-semibold">{c.guests_max}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">
                    Clubhouse contribution
                  </div>
                  <div className="text-lg font-semibold">
                    £{c.clubhouse_contribution_gbp}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">Status</div>
                  <div className="text-lg font-semibold">Active</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white/90">Address</h2>
              <div className="mt-2 text-sm text-white/70">
                {c.address ? <div>{c.address}</div> : null}
                {c.town ? <div>{c.town}</div> : null}
                {c.postcode ? <div>{c.postcode}</div> : null}
                {!c.address && !c.town && !c.postcode ? (
                  <div className="text-white/60">Not added yet</div>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-sm font-semibold text-white/90">Website</h2>
              <div className="mt-2 text-sm text-white/70">
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#c58a3a] hover:underline"
                  >
                    {c.website}
                  </a>
                ) : (
                  <div className="text-white/60">Not added yet</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/browse"
              className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              ← Back to browse
            </a>

            <a
              href={`/search?clubId=${encodeURIComponent(
                c.id
              )}&clubName=${encodeURIComponent(c.name)}`}
              className="inline-flex rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
            >
              View hosts
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
