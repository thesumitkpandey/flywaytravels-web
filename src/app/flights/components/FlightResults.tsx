"use client";

import { useState, useMemo } from "react";
import { Filters, FlightOffer, SortKey, SortOption } from "./type";
import SortBar from "./SoryBar";
import FlightResultsList from "./FilterResults";
import FilterPanel from "./FilterPanel";


function fmt(dt: string) {
  return new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface FlightResultsProps {
  offers: FlightOffer[];
  isLoading?: boolean;
  error?: string | null;
}

export default function FlightResults({ offers, isLoading = false, error = null }: FlightResultsProps) {
  const [sort, setSort] = useState<SortKey>("cheapest");
  const [filters, setFilters] = useState<Filters>({
    maxDeparture: 1439,
    maxArrival: 1439,
    directOnly: false,
    airlines: [],
  });

  const allAirlines = useMemo(
    () => [...new Set(offers?.map((o) => o.airline.name))],
    [offers]
  );

  const processed = useMemo(() => {
    let list = [...offers];

    list = list.filter((o) => {
      const sl = o.slices[0];
      const first = sl.segments[0];
      const last = sl.segments[sl.segments.length - 1];
      const depD = new Date(first.departureTime);
      const arrD = new Date(last.arrivalTime);
      const depMins = depD.getHours() * 60 + depD.getMinutes();
      const arrMins = arrD.getHours() * 60 + arrD.getMinutes();
      if (depMins > filters.maxDeparture) return false;
      if (arrMins > filters.maxArrival) return false;
      if (filters.directOnly && sl.segments.length > 1) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(o.airline.name)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === "cheapest") return a.totalAmount - b.totalAmount;
      if (sort === "departure")
        return new Date(a.slices[0].segments[0].departureTime).getTime() -
               new Date(b.slices[0].segments[0].departureTime).getTime();
      if (sort === "arrival") {
        const sa = a.slices[0].segments;
        const sb = b.slices[0].segments;
        return new Date(sa[sa.length - 1].arrivalTime).getTime() -
               new Date(sb[sb.length - 1].arrivalTime).getTime();
      }
      return 0;
    });

    return list;
  }, [offers, filters, sort]);

  // Build sort options only when offers exist
  const sortOptions: SortOption[] = useMemo(() => {
    if (offers.length === 0) return [];

    const cheapest = Math.min(...offers.map((o) => o.totalAmount));
    const earliestDep = [...offers].sort(
      (a, b) =>
        new Date(a.slices[0].segments[0].departureTime).getTime() -
        new Date(b.slices[0].segments[0].departureTime).getTime()
    )[0].slices[0].segments[0].departureTime;
    const earliestArr = (() => {
      const sorted = [...offers].sort((a, b) => {
        const sa = a.slices[0].segments;
        const sb = b.slices[0].segments;
        return new Date(sa[sa.length - 1].arrivalTime).getTime() -
               new Date(sb[sb.length - 1].arrivalTime).getTime();
      });
      const segs = sorted[0].slices[0].segments;
      return segs[segs.length - 1].arrivalTime;
    })();

    return [
      {
        key: "cheapest" as SortKey,
        label: "Cheapest",
        sub: `from $${cheapest.toFixed(0)}`,
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        ),
      },
      {
        key: "departure" as SortKey,
        label: "Earliest departure",
        sub: fmt(earliestDep),
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
          </svg>
        ),
      },
      {
        key: "arrival" as SortKey,
        label: "Earliest arrival",
        sub: fmt(earliestArr),
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l7-7 4 4 7-7M3 21h18" />
          </svg>
        ),
      },
    ];
  }, [offers]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100/70 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 animate-pulse">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <p className="text-neutral-600 font-semibold text-sm">Searching for flights…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-100/70 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-red-400">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-neutral-800 font-bold">Something went wrong</p>
          <p className="text-neutral-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/70">
      <SortBar
        sort={sort}
        setSort={setSort}
        sortOptions={sortOptions}
        resultCount={processed.length}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          allAirlines={allAirlines}
        />

        <div className="flex-1 min-w-0">
          <FlightResultsList
            offers={processed}
            onClearFilters={() =>
              setFilters({ maxDeparture: 1439, maxArrival: 1439, directOnly: false, airlines: [] })
            }
          />
        </div>
      </div>
    </div>
  );
}