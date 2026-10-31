"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Invite = { id: string; inviter_id: string; invitee_id: string; status: string };
type Pair = { id: string; member_a_id: string; member_b_id: string; status: string };
export default function MembershipPairPage() {
  const [uid,setUid]=useState("");
  const [partnerId,setPartnerId]=useState("");
  const [invites,setInvites]=useState<Invite[]>([]);
  const [pairs,setPairs]=useState<Pair[]>([]);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function refresh(id: string) {
    const [a,b]=await Promise.all([
      supabase.from("membership_pair_invitations").select("id,inviter_id,invitee_id,status").or(`inviter_id.eq.${id},invitee_id.eq.${id}`).order("created_at",{ascending:false}),
      supabase.from("membership_pairs").select("id,member_a_id,member_b_id,status").or(`member_a_id.eq.${id},member_b_id.eq.${id}`)
    ]);
    if(a.error || b.error) setMessage(a.error?.message || b.error?.message || "");
    setInvites(a.data || []);setPairs(b.data || []);
  }
  useEffect(()=>{supabase.auth.getUser().then(({data})=>{if(data.user){setUid(data.user.id);void refresh(data.user.id);}else setMessage("Sign in to manage your membership.");});},[]);
  async function invite() {
    if(!uid || !partnerId.trim())return;
    if(partnerId.trim()===uid){setMessage("You cannot invite yourself.");return;}
    setBusy(true);setMessage("");
    const {error}=await supabase.from("membership_pair_invitations").insert({inviter_id:uid,invitee_id:partnerId.trim(),status:"pending"});
    setMessage(error ? "Could not send invitation. Check that the member ID is valid and not already invited." : "Invitation sent. No billing changes have been made.");
    await refresh(uid);setBusy(false);
  }
  async function respond(invite: Invite, status: "accepted"|"declined") {
    setBusy(true);setMessage("");
    const {error}=await supabase.from("membership_pair_invitations").update({status,responded_at:new Date().toISOString()}).eq("id",invite.id).eq("invitee_id",uid).eq("status","pending");
    setMessage(error?.message || (status==="accepted" ? "Invitation accepted. Paired pricing will start only after both subscriptions are confirmed by billing." : "Invitation declined."));
    await refresh(uid);setBusy(false);
  }
  return <main className="min-h-screen bg-[#0b221b] text-white px-5 py-12"><div className="mx-auto max-w-2xl space-y-7">
    <h1 className="text-3xl font-semibold">Playing partner membership</h1>
    <p className="text-white/75">Individual: £39/month. Link two verified paying members for £29.50/month each (£59 total). Each golfer keeps their own account, credits and singles privileges.</p>
    <section className="rounded-xl border border-white/20 p-5 space-y-3">
      <h2 className="text-xl font-semibold">Invite a subscription partner</h2>
      <p className="text-sm text-white/70">Enter the other member’s account ID. A member search and invitation notifications will be added before launch.</p>
      <input aria-label="Playing partner member ID" className="w-full rounded bg-white p-3 text-black" placeholder="Verified member account ID" value={partnerId} onChange={e=>setPartnerId(e.target.value)} />
      <button disabled={!uid || busy} onClick={invite} className="rounded bg-[#d8b35a] px-5 py-3 text-[#10291f] font-semibold disabled:opacity-50">Send invitation</button>
    </section>
    <section className="rounded-xl border border-white/20 p-5 space-y-3">
      <h2 className="text-xl font-semibold">Invitations</h2>
      {invites.length===0 && <p className="text-white/60">No invitations yet.</p>}
      {invites.map(i=><div key={i.id} className="border-b border-white/10 pb-3">
        <p className="text-sm">{i.inviter_id===uid ? "Sent invitation" : "Received invitation"} · {i.status}</p>
        {i.invitee_id===uid && i.status==="pending" && <div className="flex gap-3 mt-2">
          <button disabled={busy} onClick={()=>respond(i,"accepted")} className="rounded bg-[#d8b35a] text-[#10291f] px-3 py-2">Accept</button>
          <button disabled={busy} onClick={()=>respond(i,"declined")} className="rounded border px-3 py-2">Decline</button>
        </div>}
      </div>)}
    </section>
    <section className="rounded-xl border border-white/20 p-5 space-y-2"><h2 className="text-xl font-semibold">Linked subscription</h2>
      {pairs.length===0 ? <p className="text-white/60">No active paired subscription. Your existing subscription remains unchanged.</p> :
      pairs.map(p=><p key={p.id}>{p.status==="active"?"Active paired subscription":"Pending billing confirmation"} · {p.id}</p>)}
      <p className="text-xs text-white/60">Accepting an invitation does not change either subscription or charge a card. Billing integration is required before discounted pricing can activate.</p>
    </section>
    {message && <p role="status">{message}</p>}
  </div></main>;
}
