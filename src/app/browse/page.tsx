"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/client"

type ClubRow = {
  id: string
  name: string
  region: string | null
  country: string | null
  tier: "Curated" | "Prestigious"
  guests_max: 1 | 2
  clubhouse_contribution_gbp: number
  hosts_count: number
}

function formatLocation(region: string | null, country: string | null) {
  const r = (region || "").trim()
  const c = (country || "").trim()
  if (r && c) return `${r}, ${c}`
  return r || c || ""
}

export default function BrowsePage() {
  const [clubs, setClubs] = useState<ClubRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data, error } = await supabase
        .from("club_directory")
        .select(
          "id,name,region,country,tier,guests_max,clubhouse_contribution_gbp,hosts_count"
        )
        .order("hosts_count", { ascending: false })

      if (error) setErr(error.message)
      else setClubs((data as ClubRow[]) || [])

      setLoading(false)
    }

    load()
  }, [])

  const suggestions = useMemo(() => {
    if (!query) return []
    return clubs
      .filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6)
  }, [query, clubs])

  return (
    <main className="min-h-screen bg-[#0b221b] text-white">

      {/* HERO */}
      <div
        className="relative h-[340px] w-full flex items-center justify-center"
        style={{
          backgroundImage: "url('/golf-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative text-center">

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Browse Clubs
          </h1>

          {/* SEARCH BAR */}
          <div className="mt-6 flex justify-center gap-3">

            {/* AUTOCOMPLETE */}
            <div className="relative w-[340px]">

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIsOpen(true)
                }}
                placeholder="Search clubs"
                className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-sm backdrop-blur"
              />

              {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full rounded-xl bg-[#0b2a1f] border border-white/10 shadow-lg">

                  {suggestions.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => {
                        setQuery(club.name)
                        setIsOpen(false)
                      }}
                      className="block w-full px-4 py-3 text-left text-sm hover:bg-white/10"
                    >
                      {club.name}
                    </button>
                  ))}

                </div>
              )}

            </div>

            <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
              All locations
            </button>

            <button className="rounded-xl border border-white/20 px-5 py-3 text-sm hover:bg-white/10">
              Sort by Recommended
            </button>

          </div>
        </div>
      </div>

      {/* CLUB LIST */}
      <div className="mx-auto max-w-7xl px-6 py-10">

        {loading && (
          <p className="text-white/70">Loading clubs…</p>
        )}

        {err && (
          <p className="text-red-400">{err}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {clubs.map((c) => {
            const location = formatLocation(c.region, c.country)

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition"
              >
                <div className="text-lg font-semibold">
                  {c.name}
                </div>

                <div className="mt-1 text-sm text-white/70">
                  {location}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">

                  <div>
                    <div className="text-white/60 text-xs">
                      Hosts
                    </div>
                    <div className="font-semibold">
                      {c.hosts_count}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/60 text-xs">
                      Contribution
                    </div>
                    <div className="font-semibold">
                      £{c.clubhouse_contribution_gbp}
                    </div>
                  </div>

                </div>

                <a
                  href={`/search?clubId=${encodeURIComponent(
                    c.id
                  )}&clubName=${encodeURIComponent(c.name)}`}
                  className="mt-5 block text-center rounded-xl bg-[#d8b35a] text-[#041b14] px-4 py-2 text-sm font-semibold hover:brightness-110"
                >
                  View Hosts
                </a>
              </div>
            )
          })}

        </div>

      </div>

    </main>
  )
}
