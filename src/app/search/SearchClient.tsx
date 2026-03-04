<div className="relative w-full max-w-[460px]">
  <input
    value={query}
    onChange={(e) => {
      setQuery(e.target.value);
      setIsOpen(true);
      setActiveIndex(-1);
    }}
    onFocus={() => setIsOpen(true)}
    onBlur={() => {
      // small delay so click works
      setTimeout(() => setIsOpen(false), 120);
    }}
    onKeyDown={(e) => {
      if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setIsOpen(true);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === "Enter") {
        if (suggestions.length && activeIndex >= 0) {
          e.preventDefault();
          setQuery(suggestions[activeIndex].name);
          setIsOpen(false);
        } else {
          // Enter with free text just closes dropdown
          setIsOpen(false);
        }
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }}
    placeholder="Search clubs"
    className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-md focus:border-white/30"
  />

  {/* Suggestions dropdown */}
  {isOpen && query.trim() && suggestions.length > 0 && (
    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-2xl border border-white/12 bg-[#061a14]/95 shadow-2xl backdrop-blur-xl">
      <div className="max-h-[320px] overflow-auto">
        {suggestions.map((club, idx) => (
          <button
            key={club.id ?? club.name}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // prevents blur before click
            onClick={() => {
              setQuery(club.name);
              setIsOpen(false);
            }}
            className={[
              "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
              "transition",
              idx === activeIndex ? "bg-white/10" : "hover:bg-white/5",
            ].join(" ")}
          >
            <div className="min-w-0">
              <div className="truncate text-white">{club.name}</div>
              <div className="truncate text-xs text-white/60">
                {club.region ? `${club.region}, ` : ""}{club.country ?? ""}
              </div>
            </div>

            {club.tier && (
              <span className="ml-3 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/70">
                {club.tier}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
