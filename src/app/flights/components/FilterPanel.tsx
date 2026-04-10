"use client";

import { Filters } from "./type";


interface FilterPanelProps {
  filters: Filters;
  setFilters: (f: Filters) => void;
  allAirlines: string[];
}

function TimeSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const h = Math.floor(value / 60).toString().padStart(2, "0");
  const m = (value % 60).toString().padStart(2, "0");
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-bold text-amber-600 tabular-nums bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
          {h}:{m}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1439}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "#f59e0b" }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-neutral-400">00:00</span>
        <span className="text-[10px] text-neutral-400">23:59</span>
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, setFilters, allAirlines }: FilterPanelProps) {
  function toggleAirline(name: string) {
    const next = filters.airlines.includes(name)
      ? filters.airlines.filter((a) => a !== name)
      : [...filters.airlines, name];
    setFilters({ ...filters, airlines: next });
  }

  return (
    <aside className="w-72 shrink-0 self-start">
      <div className="sticky top-[164px] bg-white border border-black/[0.08] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-amber-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-neutral-800">Filters</h2>
          </div>
          <button
            onClick={() => setFilters({ maxDeparture: 1439, maxArrival: 1439, directOnly: false, airlines: [] })}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* Stops */}
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Stops</p>
            <div
              className="flex items-center justify-between p-3.5 rounded-xl border border-black/[0.07] bg-neutral-50 hover:border-amber-300 transition-colors cursor-pointer"
              onClick={() => setFilters({ ...filters, directOnly: !filters.directOnly })}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800 leading-tight">Non-stop only</p>
                  <p className="text-xs text-neutral-400">No layovers</p>
                </div>
              </div>
              <div className={`w-11 h-6 rounded-full transition-all relative border-2 shrink-0 ${filters.directOnly ? "bg-amber-400 border-amber-400" : "bg-neutral-200 border-neutral-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${filters.directOnly ? "left-5" : "left-0.5"}`} />
              </div>
            </div>
          </div>

          {/* Time */}
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Time</p>
            <div className="space-y-3">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-black/[0.06]">
                <TimeSlider
                  label="Depart before"
                  value={filters.maxDeparture}
                  onChange={(v) => setFilters({ ...filters, maxDeparture: v })}
                />
              </div>
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-black/[0.06]">
                <TimeSlider
                  label="Arrive before"
                  value={filters.maxArrival}
                  onChange={(v) => setFilters({ ...filters, maxArrival: v })}
                />
              </div>
            </div>
          </div>

          {/* Airlines */}
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Airlines</p>
            <div className="space-y-1.5">
              {allAirlines.map((name) => {
                const checked = filters.airlines.length === 0 || filters.airlines.includes(name);
                return (
                  <label
                    key={name}
                    onClick={() => toggleAirline(name)}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all border ${
                      checked ? "bg-amber-50 border-amber-200/70" : "hover:bg-neutral-50 border-transparent hover:border-neutral-200"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${checked ? "bg-amber-400 border-amber-400" : "border-neutral-300 bg-white"}`}>
                      {checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium text-neutral-700">{name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}