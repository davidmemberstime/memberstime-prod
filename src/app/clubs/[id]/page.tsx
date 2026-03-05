import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

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

export default async function ClubPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!club) return notFound();

  const c = club as ClubRow;

  /* GET HOSTS */
  const { data: hosts } = await supabase
    .from("host_profiles")
    .select(`
      hosted_rounds,
      rehost_rate,
      profiles (
        full_name,
        cdh_number
      )
    `)
    .eq("club_id", params.id)
    .eq("is_accepting", true);

  return (
    <main className="min-h-screen bg-[#071e17] text-white">

      {/* HERO */}
      <section className="relative h-[240px] overflow-hidden border-b border-white/10">
        <Image
          src="/home-hero.jpg"
          alt=""
          fill
          className="object-cover brightness-[0.6]"
        />

        <div className="absolute bottom-10 left-1/2 w-full max-w-6xl -translate-x-1/2 px-6">
          <h1 className="text-4xl font-semibold">{c.name}</h1>
          <p className="text-white/70">
            {c.region}, {c.country}
          </p>
        </div>
      </section>

      {/* CLUB INFO */}
      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-3">

            <div>
              <p className="text-xs text-white/60">Guests allowed</p>
              <p className="text-xl font-semibold">{c.guests_max}</p>
            </div>

            <div>
              <p className="text-xs text-white/60">Clubhouse contribution</p>
              <p className="text-xl font-semibold">
                £{c.clubhouse_contribution_gbp}
              </p>
            </div>

            <div>
              <p className="text-xs text-white/60">Status</p>
              <p className="text-xl font-semibold">Active</p>
            </div>

          </div>
        </div>

        {/* HOSTS SECTION */}
        <section id="hosts" className="mt-12">

          <h2 className="text-2xl font-semibold mb-6">
            Hosts at {c.name}
          </h2>

          {!hosts || hosts.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
              No hosts available yet.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3">

            {hosts?.map((host: any, i: number) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-lg font-semibold">
                  {host.profiles?.full_name || "Member"}
                </p>

                <div className="mt-3 space-y-1 text-sm text-white/70">

                  {host.profiles?.cdh_number && (
                    <p>CDH: {host.profiles.cdh_number}</p>
                  )}

                  <p>Hosted rounds: {host.hosted_rounds}</p>

                  <p>Rehost rate: {host.rehost_rate}%</p>

                </div>

                <button className="mt-4 w-full rounded-lg bg-[#d8b35a] py-2 text-sm font-semibold text-black hover:brightness-110">
                  Request Round
                </button>

              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}
