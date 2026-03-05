"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RequestRoundModal({
  clubId,
  hostProfileId,
  hostName,
  guestsMax,
  onClose,
}: {
  clubId: string;
  hostProfileId: string;
  hostName: string;
  guestsMax: 1 | 2;
  onClose: () => void;
}) {
  const [preferred, setPreferred] = useState("");
  const [preferred2, setPreferred2] = useState("");
  const [preferred3, setPreferred3] = useState("");
  const [guestsCount, setGuestsCount] = useState<1 | 2>(1);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const minDate = useMemo(() => {
    // earliest is tomorrow (avoid "today" timezone weirdness)
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  function isValidISODate(s: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
  }

  function validateDates() {
    const d1 = preferred?.trim();
    const d2 = preferred2?.trim();
    const d3 = preferred3?.trim();

    if (!d1 || !isValidISODate(d1)) return "Please choose a preferred date.";
    if (d2 && !isValidISODate(d2)) return "Second option date is invalid.";
    if (d3 && !isValidISODate(d3)) return "Third option date is invalid.";

    const set = new Set([d1, d2, d3].filter(Boolean));
    if (set.size !== [d1, d2, d3].filter(Boolean).length) {
      return "Please choose three different dates (no duplicates).";
    }

    return null;
  }

  async function submit() {
    setErr(null);

    const datesErr = validateDates();
    if (datesErr) {
      setErr(datesErr);
      return;
    }

    setLoading(true);

    try {
      // 1) Create booking request row first (pending)
      const insertPayload: any = {
        club_id: clubId,
        host_profile_id: hostProfileId,
        requested_date: preferred,
        requested_date_2: preferred2 || null,
        requested_date_3: preferred3 || null,
        guests_count: guestsCount,
        notes: notes || null,
        status: "pending",
      };

      // If your table has guest_profile_id (recommended), we can attach it
      // without using "await" outside an async fn (we are inside async here).
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (!userErr && user?.id) {
        insertPayload.guest_profile_id = user.id;
      }

      const { data: bookingRow, error: insertErr } = await supabase
        .from("booking_requests")
        .insert(insertPayload)
        .select("id")
        .single();

      if (insertErr) throw insertErr;
      if (!bookingRow?.id) throw new Error("Booking request was not created.");

      // 2) Start Stripe checkout
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRequestId: bookingRow.id,
          clubId,
          hostProfileId,
          guestsCount,
          preferredDate: preferred,
          preferredDate2: preferred2 || null,
          preferredDate3: preferred3 || null,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Unable to start payment.");
      }

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert("Unable to start payment.");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => !loading && onClose()}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#071e17]/95 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Request a round</h2>
            <p className="mt-1 text-sm text-white/70">
              Requesting: <span className="text-white/90">{hostName}</span>
            </p>
            <p className="mt-2 text-xs text-white/55">
              We’ll share your preferred dates with the host to confirm.
            </p>
          </div>

          <button
            onClick={() => !loading && onClose()}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        {/* Guests */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-white/55">
              Guests
            </label>
            <select
              value={guestsCount}
              onChange={(e) =>
                setGuestsCount((Number(e.target.value) === 2 ? 2 : 1) as 1 | 2)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
            >
              <option value={1}>1 guest</option>
              {guestsMax === 2 ? <option value={2}>2 guests</option> : null}
            </select>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="text-xs font-semibold text-white/80">Payment</div>
            <div className="mt-1 text-xs text-white/60">
              Booking fee online at request.
              <br />
              Hosted round price + £20 clubhouse contribution paid on the day.
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mt-5">
          <label className="text-xs uppercase tracking-[0.22em] text-white/55">
            Preferred date
          </label>
          <input
            type="date"
            min={minDate}
            value={preferred}
            onChange={(e) => setPreferred(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.22em] text-white/55">
                Second option
              </label>
              <input
                type="date"
                min={minDate}
                value={preferred2}
                onChange={(e) => setPreferred2(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.22em] text-white/55">
                Third option
              </label>
              <input
                type="date"
                min={minDate}
                value={preferred3}
                onChange={(e) => setPreferred3(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label className="text-xs uppercase tracking-[0.22em] text-white/55">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
            placeholder="Anything the host should know (tee time preference, walking only, etc)"
          />
        </div>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
            {err}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            Request sent. The host will confirm availability.
          </div>
        ) : null}

        {/* Payment explanation */}
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/80">
          <div className="font-semibold text-white/90">
            Booking fee (held until confirmed)
          </div>

          <div className="mt-1 leading-relaxed">
            After you press{" "}
            <span className="font-semibold text-white/90">Continue</span>, you’ll
            be redirected to a secure payment page to pay the booking fee. Your
            booking fee is held while the host confirms one of your dates. If
            none of your dates work, you’ll receive an automatic refund.
          </div>

          <div className="mt-2 text-white/60">
            Green fee + host fee are paid on the day at the club.
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading || !preferred}
          className="mt-4 w-full rounded-xl bg-[#c6a15b] px-4 py-3 font-medium text-black hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Redirecting to payment..." : "Continue to secure payment"}
        </button>

        <button
          onClick={() => !loading && onClose()}
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
