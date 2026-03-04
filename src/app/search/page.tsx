import SearchClient from "./SearchClient";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchPage() {
  const supabase = createClient();

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id,name")
    .order("name", { ascending: true });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Search clubs</h1>
      <p className="mt-2 text-white/70">
        Start typing and pick a club.
      </p>

      <div className="mt-8">
        <SearchClient clubs={(clubs ?? []) as { id: string; name: string }[]} />
      </div>
    </main>
  );
}
