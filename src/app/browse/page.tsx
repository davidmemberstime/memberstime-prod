"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ClubRow = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  tier: "Curated" | "Prestigious";
  guests_max: 1 | 2;
  clubhouse_contribution_gbp: number;
  hosts_count: number;
};

function formatLocation(region: string | null, country: string | null) {
  const r = (region || "").trim();
  const c = (country || "").trim();
  if (r && c) return `${r}, ${c}`;
  return r || c || "";
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("club_directory")
        .select(
          "id,name,region,country,tier,guests_max,clubhouse_contribution_gbp,hosts_count"
        )
        .order("hosts_count", { ascending: false })
        .order("tier", { ascending: false })
        .order("name", { ascending: true });

      if (!alive) return;

      if (error) {
        setErr(error.message);
        setClubs([]);
      } else {
        setClubs((data as ClubRow[]) || []);
      }

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Browse clubs</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          A curated UK list. See how many verified member hosts are available at
          each club.
        </p>

        {loading && <p className="mt-8 text-white/70">Loading clubs…</p>}
        {err && <p className="mt-8 text-red-300">{err}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {clubs.map((c) => {
            const location = formatLocation(c.region, c.country);

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold">
                      {c.name}
                    </div>
                    <div className="mt-1 text-sm text-white/70">
                      {location || "—"}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                    {c.tier}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/70">
                      Hosts on platform
                    </div>
                    <div className="text-lg font-semibold">{c.hosts_count}</div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/70">
                      Clubhouse contribution
                    </div>
                    <div className="text-lg font-semibold">
                      £
                      {Number(c.clubhouse_contribution_gbp || 0).toLocaleString(
                        "en-GB"
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
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
            );
          })}
        </div>
      </div>
    </main>
  );
}


