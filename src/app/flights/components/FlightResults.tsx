"use client";

import { FlightOffer } from "@/types/flight";
import FlightCard from "./FlightCard";

interface Props {
  flights: FlightOffer[];
  loading: boolean;
  error: string | null;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="space-y-2">
          <div className="h-7 w-36 bg-gray-200 rounded-xl" />
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-100 rounded-full" />
            <div className="h-4 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {/* Matches red button shape */}
          <div className="h-9 w-24 bg-red-100 rounded-xl" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      {/* slice */}
      <div className="px-6 py-5 flex items-center gap-4">
        <div className="w-36 shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
            <div className="space-y-1">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-2.5 w-10 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-1 shrink-0">
          <div className="h-7 w-14 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
          <div className="h-2.5 w-14 bg-gray-100 rounded" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="w-full h-px bg-red-100" />
          <div className="h-2.5 w-10 bg-gray-100 rounded" />
        </div>
        <div className="space-y-1 shrink-0">
          <div className="h-7 w-14 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
          <div className="h-2.5 w-14 bg-gray-100 rounded" />
        </div>
        <div className="w-24 shrink-0 flex flex-col items-end gap-1.5">
          <div className="h-5 w-16 bg-red-100 rounded-full" />
          <div className="h-2.5 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      {/* footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-100 rounded-full" />
        <div className="h-3 w-14 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

export default function FlightResults({ flights, loading, error }: Props) {
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">
          <p className="text-5xl mb-4 opacity-20">✈</p>
          <h3 className="text-base font-bold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 border border-red-200 bg-red-50 px-5 py-2 rounded-xl hover:bg-red-100 transition-all duration-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!flights.length) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-14 text-center shadow-sm">
          <p className="text-5xl mb-4 opacity-20">✈</p>
          <h3 className="text-base font-bold text-gray-900 mb-1">No flights found</h3>
          <p className="text-sm text-gray-400">Try adjusting your search dates or airports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-bold text-gray-900">
          {flights.length} flight{flights.length !== 1 ? "s" : ""} found
        </p>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Sorted by price
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.offerId} flight={flight} />
        ))}
      </div>
    </div>
  );
}