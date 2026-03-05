import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SearchClient from "./SearchClient";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { clubId?: string; clubName?: string };
}) {
  const clubId = searchParams?.clubId ?? "";
  const clubName = searchParams?.clubName ?? "";

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
        {/* ✅ If clubId exists: show results immediately */}
        {clubId ? (
          <SearchClient clubId={clubId} clubName={clubName || "Selected club"} />
        ) : (
          /* ✅ If no clubId: show the search picker UI */
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h1 className="text-4xl font-semibold">Search clubs</h1>
            <p className="mt-2 text-white/70">Start typing and pick a club.</p>

            {/* If you already have a picker component, render it here.
               Otherwise your existing SearchClient can also handle "no club selected"
               BUT it must not require clubId in that mode. */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/70">
                This page is expecting a club selection. Please go back to Browse and
                pick a club, or we can add the same dropdown search here too.
              </p>
            </div>
          </div>
        )}
      </Suspense>
    </main>
  );
}
