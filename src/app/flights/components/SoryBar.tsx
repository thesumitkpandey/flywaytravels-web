"use client";

import { SortKey, SortOption } from "./type";


interface SortBarProps {
  sort: SortKey;
  setSort: (k: SortKey) => void;
  sortOptions: SortOption[];
  resultCount: number;
}

export default function SortBar({ sort, setSort, sortOptions, resultCount }: SortBarProps) {
  return (
    <div className="sticky top-[72px] z-20 bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-3">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mr-2 shrink-0">
          Sort by
        </span>

        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`flex items-center gap-3.5 px-6 py-3.5 rounded-2xl border text-left transition-all duration-200 min-w-[185px] ${
              sort === opt.key
                ? "bg-amber-400 border-amber-400 text-neutral-900 shadow-[0_4px_20px_rgba(251,191,36,0.40)]"
                : "bg-white border-black/[0.08] text-neutral-600 hover:border-amber-300 hover:bg-amber-50/60 shadow-sm"
            }`}
          >
            <span className={`shrink-0 ${sort === opt.key ? "text-neutral-900" : "text-neutral-400"}`}>
              {opt.icon}
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">{opt.label}</p>
              <p className={`text-xs mt-0.5 tabular-nums font-semibold ${sort === opt.key ? "text-neutral-700" : "text-neutral-400"}`}>
                {opt.sub}
              </p>
            </div>
          </button>
        ))}

        <div className="ml-2 text-xs font-bold text-neutral-500 bg-neutral-100 border border-black/[0.07] px-3.5 py-2 rounded-xl">
          {resultCount} flight{resultCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}