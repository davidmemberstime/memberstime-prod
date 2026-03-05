"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RequestRoundModal({
  clubId,
  hostProfileId,
  hostName,
  onClose,
}: {
  clubId: string;
  hostProfileId: string;
  hostName: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [requestedDate, setRequestedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    const { error } = await supabase.from("booking_requests").insert({
      guest_user_id: user.id,
      host_profile_id: hostProfileId,
      club_id: clubId,
      requested_date: requestedDate,
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Request a round</h2>
            <p className="mt-1 text-sm text-white/70">
              Requesting a hosted round with{" "}
              <span className="font-semibold text-white/85">{hostName}</span>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {!success ? (
          <>
            <div className="mt-5">
              <label className="text-xs uppercase tracking-[0.18em] text-white/60">
                Preferred date
              </label>

              <input
                type="date"
                value={requestedDate}
                min={minDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white backdrop-blur outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              />

              <p className="mt-2 text-xs text-white/55">
                This is a request — the host will confirm availability.
              </p>
            </div>

            {err && <p className="mt-4 text-sm text-red-400">{err}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={submit}
                disabled={!requestedDate || loading}
                className="flex-1 rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14] hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send request"}
              </button>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white/90">
                Request sent.
              </p>
              <p className="mt-1 text-sm text-white/70">
                You’ll be notified when the host responds.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-[#d8b35a] px-4 py-2.5 text-sm font-semibold text-[#041b14] hover:brightness-110"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
