"use client";

import { useMemo, useState } from "react";
import RequestRoundModal from "@/components/RequestRoundModal";

export type HostCard = {
  host_profile_id: string;
  hosted_rounds: number | null;
  rehost_rate: number | null;
  is_accepting: boolean | null;
  hosting_fee_gbp: number | null;
  guest_green_fee_gbp: number | null;
  full_name: string | null;
  cdh_number: string | null;
};

function pct(val: number | null) {
  if (val === null || val === undefined) return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return `${n}%`;
}

function gbp(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}

function firstName(fullName: string | null | undefined) {
  const s = (fullName || "").trim();
  if (!s) return null;
  return s.split(/\s+/)[0] || null;
}

export default function HostsClient({
  clubId,
  clubName,
  guestsMax,
  hosts,
}: {
  clubId: string;
  clubName: string;
  guestsMax: 1 | 2;
  hosts: HostCard[];
}) {
  const [selected, setSelected] = useState<HostCard | null>(null);

  const acceptingHosts = useMemo(() => {
    return hosts.filter((h) => h.is_accepting !== false);
  }, [hosts]);

  return (
    <section
      id="hosts"
      className="border-t border-white/10 bg-black/20 p-6 md:p-8 scroll-mt-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            Hosts at {clubName}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Select a host and request a date. The host will confirm availability.
          </p>
        </div>

        <a
          href="/browse"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
        >
          Browse clubs
        </a>
      </div>

      <div className="mt-3 text-xs text-white/55">
        <span className="font-semibold text-white/75">Payment on the day:</span>{" "}
        Host fee + guest green fee + £20 clubhouse contribution to the club. Booking
        fee is paid online at request.
      </div>

      {acceptingHosts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white/85">
            No hosts available yet.
          </div>
          <div className="mt-1 text-sm text-white/60">
            Check back soon — new hosts are added regularly.
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {acceptingHosts.map((h) => {
            const displayName = firstName(h.full_name) || "Member host";

            const hostingFee = h.hosting_fee_gbp ?? null;
            const greenFee = h.guest_green_fee_gbp ?? null;
            const total =
              hostingFee !== null && greenFee !== null
                ? hostingFee + greenFee
                : null;

            return (
              <div
                key={h.host_profile_id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">
                      {displayName}
                    </div>
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

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Hosted round price
                  </div>

                  <div className="mt-1 text-2xl font-semibold">
                    {total !== null ? gbp(total) : "£—"}
                    <span className="ml-2 text-sm font-normal text-white/60">
                      per guest
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-white/55">
                    Includes green fee + hosting{" "}
                    {greenFee !== null && hostingFee !== null ? (
                      <>
                        (<span className="text-white/70">{gbp(greenFee)}</span>{" "}
                        green fee +{" "}
                        <span className="text-white/70">{gbp(hostingFee)}</span>{" "}
                        hosting)
                      </>
                    ) : (
                      "(host pricing not set yet)"
                    )}
                    .
                    <div className="mt-1">
                      + £20 clubhouse contribution (paid to the club).
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(h)}
                  className="mt-5 block w-full rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14] hover:brightness-110"
                >
                  Request round
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <RequestRoundModal
          clubId={clubId}
          hostProfileId={selected.host_profile_id}
          hostName={firstName(selected.full_name) || "Member host"}
          guestsMax={guestsMax}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
