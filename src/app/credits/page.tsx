"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { summarizeCreditWallet, type WalletSummary } from "@/lib/credits/wallet";

export default function CreditsPage() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [message, setMessage] = useState("Loading your credit wallet…");

  useEffect(() => {
    let active = true;
    async function load() {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !auth.user) {
        setMessage("Please sign in to see your credits.");
        return;
      }
      const [ledger, reservations] = await Promise.all([
        supabase.from("reciprocal_credit_ledger").select("amount,expires_at,created_at").eq("user_id", auth.user.id),
        supabase.from("reciprocal_credit_reservations").select("credits,status,expiry_protected_until").eq("visitor_id", auth.user.id),
      ]);
      if (!active) return;
      if (ledger.error || reservations.error) {
        setMessage("We couldn't load your credits. Please try again later.");
        return;
      }
      setWallet(summarizeCreditWallet(ledger.data || [], (reservations.data || []) as Parameters<typeof summarizeCreditWallet>[1]));
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">My Give &amp; Play credits</h1>
      <p className="mt-3 text-gray-600">Your current credit overview. Bookings and automatic credit settlement are not yet enabled.</p>
      {!wallet ? <p className="mt-8" role="status">{message}</p> : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-5"><p className="text-sm text-gray-600">Available</p><p className="mt-2 text-3xl font-semibold">{wallet.available.toFixed(1)}</p></div>
            <div className="rounded-xl border p-5"><p className="text-sm text-gray-600">Reserved for bookings</p><p className="mt-2 text-3xl font-semibold">{wallet.held.toFixed(1)}</p></div>
            <div className="rounded-xl border p-5"><p className="text-sm text-gray-600">Total earned</p><p className="mt-2 text-3xl font-semibold">{wallet.earned.toFixed(1)}</p></div>
          </div>
          <p className="mt-6 text-sm text-gray-600">Hosting earns 1.5 credits per completed round, even with two visitors. Each visiting member uses 1 credit. You can earn up to 6 hosting credits per calendar month.</p>
          {wallet.protectedUntil && <p className="mt-4 text-sm">Host-cancellation protection recorded until {new Date(wallet.protectedUntil).toLocaleDateString("en-GB")}.</p>}
          <p className="mt-4 text-xs text-gray-500">This is a provisional wallet display; final expiry-aware balances will be confirmed by the secure settlement service before bookings are activated.</p>
        </>
      )}
    </main>
  );
}
