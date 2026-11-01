"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Slot = { day: number; from: string; to: string };
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = Array.from({ length: 29 }, (_, i) => {
  const h = String(6 + Math.floor(i / 2)).padStart(2, "0");
  return `${h}:${i % 2 ? "30" : "00"}`;
});
export default function ProfileSettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [flexible, setFlexible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { setMessage("Please sign in to edit your profile."); return; }
      setUserId(data.user.id);
      const { data: profile, error } = await supabase.from("profiles")
        .select("avatar_path,preferred_tee_times,flexible_tee_times")
        .eq("id", data.user.id).single();
      if (error) { setMessage(error.message); return; }
      setAvatarPath(profile.avatar_path);
      setSlots(Array.isArray(profile.preferred_tee_times) ? profile.preferred_tee_times : []);
      setFlexible(Boolean(profile.flexible_tee_times));
    })();
  }, []);
  const photoUrl = avatarPath ? supabase.storage.from("member-avatars").getPublicUrl(avatarPath).data.publicUrl : null;
  function changeSlot(day: number, key: "from" | "to", value: string) {
    setSlots(current => current.map(s => s.day === day ? { ...s, [key]: value } : s));
  }
  async function uploadPhoto(file?: File) {
    if (!file || !userId) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setMessage("Choose a JPG, PNG or WebP photo under 2 MB."); return;
    }
    setBusy(true); setMessage("");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${userId}/profile.${ext}`;
    const { error } = await supabase.storage.from("member-avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (error) setMessage(error.message);
    else {
      const { error: saveError } = await supabase.from("profiles").update({ avatar_path: path }).eq("id", userId);
      if (saveError) setMessage(saveError.message);
      else { setAvatarPath(path); setMessage("Photo saved."); }
    }
    setBusy(false);
  }
  async function save() {
    if (!userId) return;
    if (slots.some(s => s.from >= s.to)) { setMessage("Each time window must end after it starts."); return; }
    setBusy(true); setMessage("");
    const { error } = await supabase.from("profiles")
      .update({ preferred_tee_times: slots, flexible_tee_times: flexible }).eq("id", userId);
    setMessage(error ? error.message : "Playing preferences saved.");
    setBusy(false);
  }
  return (
    <main className="min-h-screen bg-[#0b221b] text-white px-5 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div><h1 className="text-3xl font-semibold">My golf profile</h1>
          <p className="mt-2 text-white/70">Set your usual hosting times. These are preferences, not confirmed bookings.</p></div>
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile photograph</h2>
          {photoUrl ? <img src={photoUrl} alt="Your profile" className="h-24 w-24 rounded-full object-cover" /> :
            <div className="h-24 w-24 rounded-full bg-white/10 grid place-items-center text-white/60">Photo</div>}
          <input aria-label="Upload profile photograph" type="file" accept="image/jpeg,image/png,image/webp"
            disabled={!userId || busy} onChange={e => uploadPhoto(e.target.files?.[0])}
            className="block w-full text-sm text-white/80" />
          <p className="text-xs text-white/60">Optional. Visible to other members. Maximum 2 MB.</p>
        </section>
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 space-y-5">
          <h2 className="text-xl font-semibold">Usual tee times</h2>
          {DAYS.map((name, day) => {
            const slot = slots.find(s => s.day === day);
            return <div key={day} className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
              <label className="flex w-36 items-center gap-2">
                <input type="checkbox" checked={Boolean(slot)} onChange={e => setSlots(current =>
                  e.target.checked ? [...current, { day, from: "08:00", to: "09:00" }] : current.filter(s => s.day !== day))} />
                {name}
              </label>
              {slot && <div className="flex items-center gap-2">
                <select aria-label={`${name} earliest tee time`} value={slot.from} onChange={e => changeSlot(day, "from", e.target.value)}
                  className="rounded-lg bg-[#204234] px-3 py-2">{TIMES.map(t => <option key={t}>{t}</option>)}</select>
                <span>to</span>
                <select aria-label={`${name} latest tee time`} value={slot.to} onChange={e => changeSlot(day, "to", e.target.value)}
                  className="rounded-lg bg-[#204234] px-3 py-2">{TIMES.map(t => <option key={t}>{t}</option>)}</select>
              </div>}
            </div>;
          })}
          <label className="flex items-center gap-3"><input type="checkbox" checked={flexible}
            onChange={e => setFlexible(e.target.checked)} /> Flexible on times / available at short notice</label>
          <button type="button" disabled={!userId || busy} onClick={save}
            className="w-full rounded-xl bg-[#d8b35a] px-5 py-3 font-semibold text-[#041b14] disabled:opacity-50">
            {busy ? "Saving…" : "Save playing preferences"}
          </button>
          {message && <p role="status" className="text-sm text-white/80">{message}</p>}
        </section>
      </div>
    </main>
  );
}
