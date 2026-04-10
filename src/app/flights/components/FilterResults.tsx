"use client";

import { useState } from "react";
import { FlightOffer } from "./type";

function fmt(dt: string) {
  return new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatDuration(iso: string) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return iso;
  return `${parseInt(m[1] ?? "0")}h ${parseInt(m[2] ?? "0")}m`;
}

function StopBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
        Non-stop
      </span>
    );
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
      {count} stop{count > 1 ? "s" : ""}
    </span>
  );
}

function FlightCard({ offer }: { offer: FlightOffer }) {
  const [expanded, setExpanded] = useState(false);
  const slice = offer.slices[0];
  const firstSeg = slice.segments[0];
  const lastSeg = slice.segments[slice.segments.length - 1];
  const stops = slice.segments.length - 1;

  return (
    <div className="group bg-white border border-black/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_6px_32px_rgba(251,191,36,0.12)] shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-5 p-5">

        {/* Airline logo + name */}
        <div className="shrink-0 flex flex-col items-center gap-2 w-[84px]">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-black/[0.08] overflow-hidden flex items-center justify-center shadow-sm">
            {offer.airline.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={offer.airline.logo}
                alt={offer.airline.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  if (el.parentElement)
                    el.parentElement.innerHTML = `<span style="font-size:16px;font-weight:800;color:#d97706">${offer.airline.iataCode}</span>`;
                }}
              />
            ) : (
              <span className="text-lg font-black text-amber-600">{offer.airline.iataCode}</span>
            )}
          </div>
          <p className="text-[11px] font-semibold text-neutral-500 text-center leading-tight line-clamp-2 w-full">
            {offer.airline.name}
          </p>
        </div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-4 min-w-0">

          {/* Depart */}
          <div className="min-w-[90px]">
            <p className="text-[26px] font-black text-neutral-900 tabular-nums leading-none">
              {fmt(firstSeg.departureTime)}
            </p>
            <p className="text-sm font-bold text-neutral-800 mt-1">{slice.originCity}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{firstSeg.origin}</p>
          </div>

          {/* Line */}
          <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0 px-1">
            <p className="text-xs font-medium text-neutral-400">{formatDuration(slice.duration)}</p>
            <div className="w-full flex items-center gap-1.5">
              <div className="h-px flex-1 bg-neutral-200" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400 shrink-0">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            <StopBadge count={stops} />
          </div>

          {/* Arrive */}
          <div className="min-w-[90px] text-right">
            <p className="text-[26px] font-black text-neutral-900 tabular-nums leading-none">
              {fmt(lastSeg.arrivalTime)}
            </p>
            <p className="text-sm font-bold text-neutral-800 mt-1">{slice.destinationCity}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{lastSeg.destination}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-black/[0.07] shrink-0" />

        {/* Price + CTA */}
        <div className="shrink-0 flex flex-col items-end gap-2.5 min-w-[130px]">
          <div>
            <p className="text-3xl font-black text-neutral-900 tabular-nums leading-none">
              ${offer.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5 text-right">per person · {offer.currency}</p>
          </div>
          <button className="w-full px-5 py-2.5 rounded-xl font-bold text-sm
            bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-900
            shadow-[0_4px_14px_rgba(251,191,36,0.35)]
            hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)]
            transition-all duration-200 hover:scale-[1.02] active:scale-95 whitespace-nowrap">
            Select flight
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors flex items-center gap-1"
          >
            {expanded ? "Hide details" : "View details"}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded segments */}
      {expanded && (
        <div className="border-t border-black/[0.06] px-6 pb-5 pt-4 bg-neutral-50/70">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Flight segments</p>
          {slice.segments.map((seg, i) => (
            <div key={i} className="relative flex gap-4">
              <div className="flex flex-col items-center shrink-0 w-5">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-amber-200 shadow-sm mt-0.5" />
                {i < slice.segments.length - 1 && (
                  <div className="w-0.5 flex-1 bg-amber-200 my-1 min-h-[44px]" />
                )}
                {i === slice.segments.length - 1 && (
                  <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 border-2 border-neutral-200 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-base font-bold text-neutral-900 tabular-nums">
                      {fmt(seg.departureTime)}
                      <span className="text-xs font-normal text-neutral-400 ml-1">{fmtDate(seg.departureTime)}</span>
                    </p>
                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">{seg.origin}</p>
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-white border border-black/[0.08] rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-700 shadow-sm">
                      {seg.flightNumber}
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-1 capitalize">{seg.cabinClass}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-neutral-900 tabular-nums">
                      {fmt(seg.arrivalTime)}
                      <span className="text-xs font-normal text-neutral-400 ml-1">{fmtDate(seg.arrivalTime)}</span>
                    </p>
                    <p className="text-xs font-semibold text-neutral-600 mt-0.5">{seg.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FlightResultsListProps {
  offers: FlightOffer[];
  onClearFilters: () => void;
}

export default function FlightResultsList({ offers, onClearFilters }: FlightResultsListProps) {
  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-black/[0.08] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <p className="text-neutral-800 font-bold text-base">No flights match your filters</p>
        <p className="text-neutral-400 text-sm mt-1 mb-5">Try adjusting your filters to see more results.</p>
        <button
          onClick={onClearFilters}
          className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-5 py-2.5 rounded-xl border border-amber-200 transition-colors shadow-sm"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <FlightCard key={offer.offerId} offer={offer} />
      ))}
    </div>
  );
}