"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RequestRoundModal({
  clubId,
  clubName,
  hostProfileId,
  hostName,
  guestsMax,
  onClose,
}: {
  clubId: string;
  clubName: string;
  hostProfileId: string;
  hostName: string;
  guestsMax: 1 | 2;
  onClose: () => void;
}) {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [guestsCount, setGuestsCount] = useState<1 | 2>(1);

  const [ackHold, setAckHold] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const minDate = useMemo(() => tomorrowISO(), []);

  function uniqueDatesValid() {
    const dates = [date1, date2, date3].filter(Boolean);
    const set = new Set(dates);
    return dates.length === set.size;
  }

  async function startPayment() {
    setErr(null);

    if (!date1) {
      setErr("Please select at least one preferred date.");
      return;
    }
    if (!uniqueDatesValid()) {
      setErr("Please ensure your dates are not duplicated.");
      return;
    }
    if (!ackHold) {
      setErr("Please confirm you understand how the authorisation hold works.");
      return;
    }

    setLoading(true);

    // Must be signed in (we need guest_user_id for booking_requests)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setErr(userError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setErr("Please sign in to request a hosted round.");
      setLoading(false);
      return;
    }

    const safeGuestsCount: 1 | 2 =
      guestsMax === 1 ? 1 : guestsCount === 2 ? 2 : 1;

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          clubId,
          clubName,
          hostProfileId,
          hostName,
          guestsCount: safeGuestsCount,
          requested_date: date1,
          requested_date_2: date2 || null,
          requested_date_3: date3 || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErr(json?.error || "Unable to start payment.");
        setLoading(false);
        return;
      }

      if (!json?.url) {
        setErr("Payment link missing. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = json.url;
    } catch (e: any) {
      setErr(e?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b2a1f] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Request a hosted round</h2>
            <p className="mt-1 text-sm text-white/70">
              Host: <span className="text-white/85 font-semibold">{hostName}</span> ·{" "}
              <span className="text-white/75">{clubName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-sm font-semibold text-white/90">
              How payment works (important)
            </div>
            <div className="mt-2 text-sm text-white/70 space-y-2">
              <p>
                You’ll enter your card details now. We place a{" "}
                <span className="text-white/85 font-semibold">temporary authorisation</span>{" "}
                for the booking fee.
              </p>
              <p>
                You are{" "}
                <span className="text-white/85 font-semibold">only charged</span>{" "}
                if the host confirms one of your dates within{" "}
                <span className="text-white/85 font-semibold">72 hours</span>.
              </p>
              <p>
                If the host can’t confirm, the authorisation is{" "}
                <span className="text-white/85 font-semibold">released automatically</span>.
              </p>
            </div>

            <label className="mt-3 flex items-start gap-3 text-sm text-white/75">
              <input
                type="checkbox"
                checked={ackHold}
                onChange={(e) => setAckHold(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/30 bg-black/30"
              />
              <span>
                I understand this is a temporary authorisation and I’ll only be charged
                if the host confirms within 72 hours.
              </span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-white/60">
                Preferred date
              </label>
              <input
                type="date"
                min={minDate}
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-white/60">
                2nd choice
              </label>
              <input
                type="date"
                min={minDate}
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-white/60">
                3rd choice
              </label>
              <input
                type="date"
                min={minDate}
                value={date3}
                onChange={(e) => setDate3(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.18em] text-white/60">
              Guests
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value) as 1 | 2)}
              disabled={guestsMax === 1}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white disabled:opacity-60"
            >
              <option value={1}>1 guest</option>
              {guestsMax === 2 && <option value={2}>2 guests</option>}
            </select>
            <p className="mt-2 text-xs text-white/55">
              This club allows up to <span className="text-white/75">{guestsMax}</span>{" "}
              guest{guestsMax === 2 ? "s" : ""}.
            </p>
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <div className="mt-1 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={startPayment}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14] hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Continue to payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
