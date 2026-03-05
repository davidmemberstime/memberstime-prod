"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RequestRoundModal({
  clubId,
  hostProfileId,
  onClose,
}: {
  clubId: string;
  hostProfileId: string;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitRequest() {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("booking_requests").insert({
      guest_user_id: user.id,
      host_profile_id: hostProfileId,
      club_id: clubId,
      requested_date: date,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b2a1f] p-6">

        <h2 className="text-xl font-semibold">Request a round</h2>

        {!success && (
          <>
            <p className="mt-2 text-sm text-white/70">
              Choose a preferred date and send a request to the host.
            </p>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-4 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm"
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={submitRequest}
                disabled={!date || loading}
                className="flex-1 rounded-xl bg-[#d8b35a] px-4 py-2 text-sm font-semibold text-[#041b14]"
              >
                {loading ? "Sending..." : "Send request"}
              </button>
            </div>
          </>
        )}

        {success && (
          <div className="mt-4">
            <p className="text-sm text-green-400">
              Request sent successfully.
            </p>

            <button
              onClick={onClose}
              className="mt-4 w-full rounded-xl bg-[#d8b35a] px-4 py-2 text-sm font-semibold text-[#041b14]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
