"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";

type BookingRequestRow = {
  id: string;
  requested_date: string | null;
  requested_date_2: string | null;
  requested_date_3: string | null;
  guests_count: number;
  status: string;
  notes: string | null;
  host_profile_id: string;
  club_id: string;
  guest_profile_id?: string | null;
  guest_user_id?: string | null;
};

type HostProfile = {
  id: string;
  club_id: string;
};

type GuestProfile = {
  id: string;
  full_name: string | null;
  handicap: number | null;
  dob: string | null;
};

type DisplayRequest = BookingRequestRow & {
  guest_first_name: string;
  guest_handicap: number | null;
  guest_age_band: string;
};

function firstName(fullName: string | null | undefined) {
  const s = (fullName || "").trim();
  if (!s) return "Guest";
  return s.split(/\s+/)[0];
}

function getAgeFromDob(dob: string | null | undefined) {
  if (!dob) return null;

  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
}

function getAgeBand(dob: string | null | undefined) {
  const age = getAgeFromDob(dob);
  if (age === null) return "Not provided";
  if (age < 20) return "Under 20";
  if (age >= 70) return "70+";
  return `${Math.floor(age / 10) * 10}s`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ForMembersDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<DisplayRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        setError("Please sign in to view booking requests.");
        setLoading(false);
        return;
      }

      const { data: hostProfiles, error: hostProfilesError } = await supabase
        .from("host_profiles")
        .select("id, club_id")
        .eq("user_id", user.id);

      if (hostProfilesError) throw hostProfilesError;

      const profileRows = (hostProfiles ?? []) as HostProfile[];

      if (profileRows.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const hostProfileIds = profileRows.map((p) => p.id);

      const { data: bookingRows, error: bookingError } = await supabase
        .from("booking_requests")
        .select(
          "id, requested_date, requested_date_2, requested_date_3, guests_count, status, notes, host_profile_id, club_id, guest_profile_id, guest_user_id"
        )
        .in("host_profile_id", hostProfileIds)
        .order("requested_date", { ascending: true });

      if (bookingError) throw bookingError;

      const rawRequests = (bookingRows ?? []) as BookingRequestRow[];

      const guestIds = Array.from(
        new Set(
          rawRequests
            .map((r) => r.guest_profile_id || r.guest_user_id)
            .filter(Boolean)
        )
      ) as string[];

      let guestMap = new Map<string, GuestProfile>();

      if (guestIds.length > 0) {
        const { data: guestRows, error: guestError } = await supabase
          .from("profiles")
          .select("id, full_name, handicap, dob")
          .in("id", guestIds);

        if (guestError) throw guestError;

        guestMap = new Map(
          ((guestRows ?? []) as GuestProfile[]).map((g) => [g.id, g])
        );
      }

      const enriched: DisplayRequest[] = rawRequests.map((req) => {
        const guestId = req.guest_profile_id || req.guest_user_id || "";
        const guest = guestMap.get(guestId);

        return {
          ...req,
          guest_first_name: firstName(guest?.full_name),
          guest_handicap:
            guest?.handicap === null || guest?.handicap === undefined
              ? null
              : Number(guest.handicap),
          guest_age_band: getAgeBand(guest?.dob),
        };
      });

      setRequests(enriched);
    } catch (e: any) {
      setError(e?.message || "Something went wrong loading requests.");
    } finally {
      setLoading(false);
    }
  }

  async function updateRequestStatus(
    id: string,
    status: "accepted" | "declined"
  ) {
    try {
      const { error: updateError } = await supabase
        .from("booking_requests")
        .update({ status })
        .eq("id", id);

      if (updateError) throw updateError;

      await loadRequests();
    } catch (e: any) {
      setError(e?.message || "Unable to update request.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0b2a1f] text-white">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Member dashboard
        </h1>
        <p className="mt-2 text-white/70">
          View and manage your incoming booking requests.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Loading requests...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-100">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No booking requests yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Booking request</h2>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80">
                    {req.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Guest</div>
                    <div className="mt-1 text-lg font-semibold">
                      {req.guest_first_name}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Handicap</div>
                    <div className="mt-1 text-lg font-semibold">
                      {req.guest_handicap !== null
                        ? Math.round(req.guest_handicap)
                        : "Not provided"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Age band</div>
                    <div className="mt-1 text-lg font-semibold">
                      {req.guest_age_band}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Preferred date</div>
                    <div className="mt-1 text-sm font-semibold text-white/90">
                      {formatDate(req.requested_date) || "Not provided"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Second option</div>
                    <div className="mt-1 text-sm font-semibold text-white/90">
                      {formatDate(req.requested_date_2) || "Not provided"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Third option</div>
                    <div className="mt-1 text-sm font-semibold text-white/90">
                      {formatDate(req.requested_date_3) || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Guests</div>
                    <div className="mt-1 text-lg font-semibold">
                      {req.guests_count}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-white/60">Club ID</div>
                    <div className="mt-1 break-all text-sm text-white/85">
                      {req.club_id}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/60">Notes</div>
                  <div className="mt-1 text-sm text-white/85">
                    {req.notes?.trim() ? req.notes : "No notes added."}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateRequestStatus(req.id, "accepted")}
                    className="rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateRequestStatus(req.id, "declined")}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
