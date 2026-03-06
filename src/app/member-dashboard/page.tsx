"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type BookingRequest = {
  id: string;
  requested_date: string;
  club_id: string;
  guest_user_id: string;
  host_profile_id: string;
};

export default function MemberDashboard() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) return;

    const { data, error } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("host_profile_id", userData.user.id)
      .order("requested_date", { ascending: true });

    if (!error && data) {
      setRequests(data);
    }

    setLoading(false);
  }

  async function acceptRequest(id: string) {
    await supabase
      .from("booking_requests")
      .update({ status: "accepted" })
      .eq("id", id);

    loadRequests();
  }

  async function declineRequest(id: string) {
    await supabase
      .from("booking_requests")
      .update({ status: "declined" })
      .eq("id", id);

    loadRequests();
  }

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Booking Requests</h1>

      {requests.length === 0 && (
        <p>No booking requests yet.</p>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded-lg p-6 mb-6"
        >
          <p className="mb-2">
            <strong>Requested Date:</strong>{" "}
            {req.requested_date}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => acceptRequest(req.id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => declineRequest(req.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
