import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SearchClient from "./SearchClient";

export default function SearchPage({
  searchParams
}: {
  searchParams?: { clubId?: string; clubName?: string };
}) {
  const clubId = searchParams?.clubId ?? null;
  const clubName = searchParams?.clubName ?? "Selected club";

  return (
    <main>
      <SiteHeader />
      <Suspense fallback={<p className="mx-auto max-w-6xl px-4 py-10 text-white/70">Loading…</p>}>
        <SearchClient clubId={clubId} clubName={clubName} />
      </Suspense>
    </main>
  );
}
