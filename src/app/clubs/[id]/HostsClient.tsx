"use client";

import { useMemo, useState } from "react";
import RequestRoundModal from "@/components/RequestRoundModal";

export type HostCard = {
  host_profile_id: string;
  hosted_rounds: number | null;
  rehost_rate: number | null;
  is_accepting: boolean | null;
  full_name: string | null;
  cdh_number: string | null;
};

function pct(val: number | null) {
  if (val === null || val === undefined) return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return `${n}%`;
}

export default function HostsClient({
  clubId,
  clubName,
  hosts,
}: {
  clubId: string;
  clubName: string;
  hosts: HostCard[];
}) {
  const [selected, setSelected] = useState<HostCard | null>(null);

  const acceptingHosts = useMemo(() => {
    // keep only accepting hosts in UI
    return hosts.filter((h) => h.is_accepting !== false);
  }, [hosts]);

  return (
    <section id="hosts" className="border-t border-white/10 bg-black/20 p-6 md:p-8 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Hosts at {clubName}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Verified member hosts. Request a date and the host will confirm.
          </p>
        </div>

        <a
          href="/browse"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
        >
          Browse clubs
        </a>
      </div>

      {acceptingHosts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/80 font-semibold">
            No hosts available yet.
          </div>
          <div className="mt-1 text-sm text-white/60">
            Check back soon — new hosts are added regularly.
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {acceptingHosts.map((h) => {
            const name = h.full_name?.trim() || "Member host";

            return (
              <div
                key={h.host_profile_id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">{name}</div>
                    <div className="mt-1 text-sm text-white/70">
                      {h.cdh_number ? `CDH ${h.cdh_number}` : "CDH not provided"}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">
                    Accepting
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs text-white/60">Hosted rounds</div>
                    <div className="text-lg font-semibold">
                      {h.hosted_rounds ?? 0}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="text-xs text-white/60">Rehost rate</div>
                    <div className="text-lg font-semibold">{pct(h.rehost_rate)}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(h)}
                  className="mt-5 block w-full text-center rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14] hover:brightness-110"
                >
                  Request round
                </button>

                <p className="mt-3 text-xs text-white/55">
                  Payment breakdown shown at booking.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <RequestRoundModal
          clubId={clubId}
          hostProfileId={selected.host_profile_id}
          hostName={selected.full_name?.trim() || "Member host"}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
