"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [requestedDate, setRequestedDate] = useState("");
  const [guestsCount, setGuestsCount] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  async function submit() {
    setErr(null);
    setLoading(true);

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
      const next = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.push(`/auth/sign-in?next=${next}`);
      setLoading(false);
      return;
    }

    const safeGuestsCount: 1 | 2 =
      guestsMax === 1 ? 1 : guestsCount === 2 ? 2 : 1;

    const { error } = await supabase.from("booking_requests").insert({
      guest_user_id: user.id,
      host_profile_id: hostProfileId,
      club_id: clubId,
      requested_date: requestedDate,
      guests_count: safeGuestsCount,
    });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b2a1f] p-6 shadow-2xl">

        <h2 className="text-xl font-semibold">
          Request a round with {hostName}
        </h2>

        {!success ? (
          <>
            <div className="mt-5 grid gap-4">

              <div>
                <label className="text-xs text-white/60">Preferred date</label>

                <input
                  type="date"
                  value={requestedDate}
                  min={minDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">Guests</label>

                <select
                  value={guestsCount}
                  onChange={(e) =>
                    setGuestsCount(Number(e.target.value) as 1 | 2)
                  }
                  disabled={guestsMax === 1}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white"
                >
                  <option value={1}>1 guest</option>

                  {guestsMax === 2 && (
                    <option value={2}>2 guests</option>
                  )}
                </select>
              </div>

            </div>

            {err && (
              <p className="mt-4 text-sm text-red-400">{err}</p>
            )}

            <div className="mt-6 flex gap-3">

              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                disabled={!requestedDate || loading}
                className="flex-1 rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14]"
              >
                {loading ? "Sending…" : "Send request"}
              </button>

            </div>
          </>
        ) : (
          <div className="mt-6">

            <p className="text-sm text-white/80">
              Request sent. The host will confirm availability.
            </p>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14]"
            >
              Close
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
