import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Club = {
  id: string;
  name: string;
  region: string;
  country: string;
  tier: string;
  clubhouse_contribution_gbp: number;
};

export default async function BrowsePage() {

  const supabase = createClient();

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id,name,region,country,tier,clubhouse_contribution_gbp")
    .order("name");

  return (
    <main className="min-h-screen bg-[#041b14] text-white">

      {/* HERO */}
      <section className="relative h-[420px] w-full overflow-hidden">

        <Image
          src="/home-hero.jpg"
          alt="Golf course"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#041b14]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 text-center">

          <h1 className="text-5xl font-semibold tracking-tight">
            Browse clubs
          </h1>

          <p className="mt-4 text-white/70 text-lg">
            A curated UK list of verified member hosts at prestigious golf clubs.
          </p>

          {/* SEARCH BAR */}

          <div className="mt-8 flex justify-center gap-3">

            <input
              placeholder="Search clubs"
              className="w-[320px] rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm backdrop-blur"
            />

            <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
              All locations
            </button>

            <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
              Sort by Recommended
            </button>

          </div>
        </div>
      </section>


      {/* CLUB GRID */}

      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

          {clubs?.map((club) => (

            <Link
              key={club.id}
              href={`/clubs/${club.id}`}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c2d22]"
            >

              {/* IMAGE */}
              <div className="relative h-[160px] w-full">

                <Image
                  src="/home-hero.jpg"
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs">
                  {club.tier}
                </div>

              </div>

              {/* CONTENT */}

              <div className="p-4">

                <h3 className="text-lg font-semibold">
                  {club.name}
                </h3>

                <p className="text-white/60 text-sm">
                  {club.region}, {club.country}
                </p>

                <div className="mt-4 flex items-center justify-between text-sm">

                  <div>
                    <p className="text-white/50 text-xs">
                      Clubhouse contribution
                    </p>

                    <p className="text-amber-400 font-semibold">
                      £{club.clubhouse_contribution_gbp}
                    </p>
                  </div>

                  <span className="rounded-lg bg-amber-500 px-3 py-1 text-xs text-black font-medium">
                    View hosts
                  </span>

                </div>
              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}

