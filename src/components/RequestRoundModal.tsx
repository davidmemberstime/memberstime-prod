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
  const [preferred1, setPreferred1] = useState("");
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
    const d1 = preferred1.trim();
    const d2 = preferred2.trim();
    const d3 = preferred3.trim();

    if (!d1) return "Please select your preferred date.";
    if (!isValidISODate(d1)) return "Preferred date is invalid.";

    const provided = [d1, d2, d3].filter(Boolean);
    const unique = new Set(provided);
    if (unique.size !== provided.length)
      return "Please choose 3 different dates (no duplicates).";

    // If they fill date 2/3, validate formatting
    if (d2 && !isValidISODate(d2)) return "Second date is invalid.";
    if (d3 && !isValidISODate(d3)) return "Third date is invalid.";

    // Ensure dates are >= minDate (string compare works for YYYY-MM-DD)
    if (d1 < minDate) return "Preferred date must be from tomorrow onwards.";
    if (d2 && d2 < minDate) return "Second date must be from tomorrow onwards.";
    if (d3 && d3 < minDate) return "Third date must be from tomorrow onwards.";

    return null;
  }

 async function submit() {
  try {
    const res = await fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId,
        hostProfileId,
        guestsCount,
        preferredDate: preferred,
        secondDate: preferred2,
        thirdDate: preferred3,
        notes,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Unable to start payment.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

    const dateError = validateDates();
    if (dateError) {
      setErr(dateError);
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr) throw userErr;
      if (!user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      const d1 = preferred1.trim();
      const d2 = preferred2.trim() || null;
      const d3 = preferred3.trim() || null;

      // IMPORTANT: keep requested_date for existing flows
      const insertPayload = {
        guest_user_id: user.id,
        host_profile_id: hostProfileId,
        club_id: clubId,
        requested_date: d1, // legacy / compatibility
        preferred_date_1: d1,
        preferred_date_2: d2,
        preferred_date_3: d3,
        guests_count: guestsCount,
        notes: notes.trim() ? notes.trim() : null,
        status: "pending",
      };

      const { error: insErr } = await supabase
        .from("booking_requests")
        .insert(insertPayload);

      if (insErr) throw insErr;

      setSuccess(true);
    } catch (e: any) {
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

          <div className="sm:pt-[22px] text-xs text-white/55 leading-relaxed">
            <span className="text-white/75 font-semibold">Payment:</span> booking
            fee online at request. Hosted round price + £20 clubhouse contribution
            paid on the day.
          </div>
        </div>

        {/* Dates */}
        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-white/55">
              Preferred date
            </label>
            <input
              type="date"
              min={minDate}
              value={preferred1}
              onChange={(e) => setPreferred1(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-white/25"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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

          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-white/55">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Anything the host should know (tee time preference, walking only, etc.)"
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
            />
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Request sent. The host will confirm availability.
          </div>
        ) : null}

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => !loading && onClose()}
            className="w-1/2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading || success}
            className="w-1/2 rounded-xl bg-[#d8b35a] px-4 py-3 text-sm font-semibold text-[#041b14] hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Submitting…" : success ? "Sent" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}
