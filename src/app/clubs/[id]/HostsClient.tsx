"use client";

import { useMemo, useState } from "react";
import RequestRoundModal from "@/components/RequestRoundModal";

type Host = {
  host_profile_id: string;
  user_id: string;
  full_name: string | null;
  cdh_number: string | null;
  handicap: number | null;
  hosted_rounds: number;
  rehost_rate: number;
  is_accepting: boolean;
  hosting_fee_gbp: number;
  guest_green_fee_gbp: number;
};

function firstName(fullName: string | null) {
  const s = (fullName || "").trim();
  if (!s) return "Member host";
  // split on whitespace and take first token
  return s.split(/\s+/)[0];
}

function money(n: number) {
  return `£${Math.round(n).toLocaleString("en-GB")}`;
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
  hosts: Host[];
}) {
  const [openFor, setOpenFor] = useState<Host | null>(null);

  const acceptingHosts = useMemo(
    () => hosts.filter((h) => h.is_accepting),
    [hosts]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hosts at {clubName}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Select a host and request a date. The host will confirm availability.
          </p>
          <p className="mt-2 text-xs text-white/55">
            <span className="font-semibold text-white/70">Payment on the day:</span>{" "}
            Hosted round price includes green fee + hosting fee. + £20 clubhouse
            contribution paid to the club. Booking fee is paid online at request.
          </p>
        </div>

        <a
          href="/browse"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
        >
          Browse clubs
        </a>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {acceptingHosts.map((h) => {
          const hostLabel = firstName(h.full_name);
          const hostedRoundPrice =
            (h.guest_green_fee_gbp || 0) + (h.hosting_fee_gbp || 0);

          return (
            <div
              key={h.host_profile_id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{hostLabel}</div>
                  <div className="mt-1 text-xs text-white/60">
                    {h.handicap !== null && h.handicap !== undefined
                      ? `Handicap ${h.handicap}`
                      : "Handicap not provided"}
                  </div>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/70">
                  Accepting
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                    Hosted rounds
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {h.hosted_rounds ?? 0}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                    Rehost rate
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {Math.round(Number(h.rehost_rate || 0))}%
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                  Hosted round price
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {money(hostedRoundPrice)}{" "}
                  <span className="text-sm font-medium text-white/60">
                    per guest
                  </span>
                </div>

                <div className="mt-2 text-xs text-white/60 leading-relaxed">
                  Includes green fee + hosting ({money(h.guest_green_fee_gbp || 0)}{" "}
                  green fee + {money(h.hosting_fee_gbp || 0)} hosting).
                  <br />+ £20 clubhouse contribution (paid to the club).
                </div>
              </div>

              <button
                onClick={() => setOpenFor(h)}
                className="mt-5 w-full rounded-xl bg-[#d8b35a] px-4 py-3 text-sm font-semibold text-[#041b14] hover:brightness-110"
              >
                Request round
              </button>
            </div>
          );
        })}
      </div>

      {openFor && (
        <RequestRoundModal
          clubId={clubId}
          hostProfileId={openFor.host_profile_id}
          hostName={firstName(openFor.full_name)}
          guestsMax={guestsMax}
          onClose={() => setOpenFor(null)}
        />
      )}
    </div>
  );
}
