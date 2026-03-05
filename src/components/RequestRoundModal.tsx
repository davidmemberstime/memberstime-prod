"use client";

import { useState } from "react";

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

  async function submit() {
    try {
      setLoading(true);

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
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
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
          </div>

          <button
            onClick={() => !loading && onClose()}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4">

          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">
              Guests
            </label>

            <select
              value={guestsCount}
              onChange={(e) =>
                setGuestsCount(Number(e.target.value) === 2 ? 2 : 1)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            >
              <option value={1}>1 guest</option>
              {guestsMax === 2 && <option value={2}>2 guests</option>}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">
              Preferred date
            </label>

            <input
              type="date"
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">
                Second option
              </label>

              <input
                type="date"
                value={preferred2}
                onChange={(e) => setPreferred2(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">
                Third option
              </label>

              <input
                type="date"
                value={preferred3}
                onChange={(e) => setPreferred3(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">
              Notes (optional)
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || !preferred}
            className="mt-2 rounded-xl bg-[#c6a15b] px-4 py-3 font-medium text-black hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Processing..." : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}
