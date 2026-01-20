"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type HostRow = {
  id: string;
  hosted_rounds: number;
  is_accepting: boolean;
  user_id: string;
  profiles: {
    full_name: string | null;
    handicap_range: string | null;
    rating_avg: number | null;
    ratings_count: number | null;
  }[] | null;
};

export default function SearchClient({
  clubId,
  clubName
}: {
  clubId: string | null;
  clubName: string;
}) {
  const [hosts, setHosts] = useState<HostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const canLoad = useMemo(() => !!clubId, [clubId]);

  useEffect(() => {
    async function load() {
      if (!clubId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from("host_profiles")
        .select(
          "id, hosted_rounds, is_accepting, user_id, profiles(full_name, handicap_range, rating_avg, ratings_count)"
        )
        .eq("club_id", clubId)
        .eq("is_accepting", true)
        .order("hosted_rounds", { ascending: false });

      if (error) setErr(error.message);
      else setHosts(((data as unknown) as HostRow[]) || []);

      setLoading(false);
    }

    load();
  }, [clubId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Member hosts</h1>
      <p className="mt-2 text-white/70">
        Showing hosts for <span className="font-semibold text-white">{clubName}</span>
      </p>

      {!canLoad && (
        <p className="mt-8 text-white/70">
          Please go to <a className="underline" href="/browse">Browse clubs</a> and select a club.
        </p>
      )}

      {loading && canLoad && <p className="mt-8 text-white/70">Loading hosts…</p>}
      {err && <p className="mt-8 text-red-300">{err}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {hosts.map((h) => {
          const p = h.profiles?.[0];
          return (
            <div
              key={h.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {p?.full_name ?? "Member host"}
                  </div>
                  <div className="mt-1 text-sm text-white/70">{clubName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70">Rating</div>
                  <div className="text-lg font-semibold">
                    {typeof p?.rating_avg === "number" ? p.rating_avg.toFixed(1) : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">Handicap</div>
                  <div className="text-sm font-semibold">{p?.handicap_range ?? "—"}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/70">Hosted rounds</div>
                  <div className="text-sm font-semibold">{h.hosted_rounds}</div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => alert("Next: booking request form (we add this next).")}
                  className="w-full rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
                >
                  Request to book
                </button>
              </div>

              <p className="mt-4 text-xs text-white/60">
                Bookings are hosted during members’ times. Guests pay club fees and clubhouse contribution directly on the day.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
