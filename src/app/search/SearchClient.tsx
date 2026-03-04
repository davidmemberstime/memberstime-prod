"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Club = {
  id: string;
  name: string;
};

export default function SearchClient({
  clubs = [],
}: {
  clubs?: Club[];
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!query) return [];
    return clubs
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [query, clubs]);

  return (
    <div className="relative w-full max-w-[460px]">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        placeholder="Search clubs"
        className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#071e17]/95 shadow-2xl backdrop-blur">
          {suggestions.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${encodeURIComponent(club.id)}`}
              className="block px-4 py-3 text-sm text-white/85 hover:bg-white/10"
              onMouseDown={(e) => e.preventDefault()}
            >
              {club.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
