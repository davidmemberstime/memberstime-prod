import { Suspense } from "react";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SearchClient from "./SearchClient";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { clubId?: string; clubName?: string };
}) {
  const clubId = (searchParams?.clubId ?? "").trim();

  // ✅ If a clubId is present, go straight to the existing club results route
  // (prevents the “type it again” problem entirely).
  if (clubId) {
    redirect(`/clubs/${encodeURIComponent(clubId)}`);
  }

  return (
    <main className="min-h-screen bg-[#0b2a1f] text-white">
      <SiteHeader />

      <Suspense
        fallback={
          <p className="mx-auto max-w-6xl px-6 py-10 text-white/70">
            Loading…
          </p>
        }
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Search clubs
          </h1>
          <p className="mt-3 text-white/70">
            Start typing and pick a club.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <SearchClient />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
