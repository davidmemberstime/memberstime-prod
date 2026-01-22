import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold">Club not found</h1>
        <p className="mt-3 text-white/70">
          That club doesn’t exist (or the link is wrong).
        </p>
        <a
          href="/browse"
          className="mt-6 inline-flex rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
        >
          Back to browse
        </a>
      </div>
    </main>
  );
}
