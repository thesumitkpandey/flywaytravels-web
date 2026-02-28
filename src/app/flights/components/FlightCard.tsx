"use client";

import { FlightOffer } from "@/types/flight";

interface Props {
  flight: FlightOffer;
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}

export default function FlightCard({ flight }: Props) {
  const isRoundTrip = flight.slices.length > 1;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* ── Top bar: price + badges + book ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div>
          <span className="text-2xl font-extrabold text-black tracking-tight">
            {flight.currency}{" "}
            {Number(flight.totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                flight.refundable
                  ? "border-green-200 text-green-700 bg-green-50"
                  : "border-gray-200 text-gray-500 bg-white"
              }`}
            >
              {flight.refundable ? "✓ Refundable" : "Non-refundable"}
            </span>
            {flight.changeAllowed && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-gray-300 text-gray-600 bg-white">
                Changes allowed
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button className="bg-black text-white text-sm font-bold px-7 py-2.5 rounded-xl hover:bg-gray-900 active:scale-95 transition-all duration-150">
            Book Now
          </button>
          <span className="text-[10px] text-gray-400">
            Expires{" "}
            {new Date(flight.expiresAt).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* ── Slices ── */}
      <div className="divide-y divide-gray-100">
        {flight.slices.map((slice, sliceIndex) => {
          const firstSeg = slice.segments[0];
          const lastSeg = slice.segments[slice.segments.length - 1];
          const stops = slice.segments.length - 1;
          const layoverAirports = slice.segments.slice(0, -1).map((s) => s.destination);

          // Deduplicate airlines within this slice
          const uniqueAirlines = Array.from(
            new Map(slice.segments.map((s) => [s.airlineDetail.iataCode, s.airlineDetail])).values()
          );

          return (
            <div key={sliceIndex} className="px-6 py-5">
              {/* Round-trip slice label */}
              {isRoundTrip && (
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 shrink-0">
                    {sliceIndex === 0 ? "↗  Outbound" : "↙  Return"}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">
                    {slice.origin} → {slice.destination}
                  </span>
                </div>
              )}

              {/* Main row */}
              <div className="flex items-center gap-4">

                {/* Airline logos + names */}
                <div className="w-36 shrink-0 space-y-2">
                  {uniqueAirlines.map((airline) => (
                    <div key={airline.iataCode} className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={airline.logo}
                          alt={airline.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-gray-800 leading-tight truncate">
                          {airline.name}
                        </p>
                        <p className="text-[10px] text-gray-400">{airline.iataCode}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Departure */}
                <div className="text-center shrink-0">
                  <p className="text-2xl font-extrabold text-black tabular-nums leading-none">
                    {formatTime(firstSeg.departureTime)}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">{firstSeg.origin}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(firstSeg.departureTime)}</p>
                </div>

                {/* Route line */}
                <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <span className="text-xs text-gray-500 font-semibold">{slice.duration}</span>
                  <div className="w-full flex items-center">
                    <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                    <div className="flex-1 relative h-[1.5px] bg-gray-300">
                      {/* Layover dots */}
                      {layoverAirports.map((airport, idx) => (
                        <div
                          key={idx}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                          style={{ left: `${((idx + 1) / slice.segments.length) * 100}%` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white border-2 border-gray-400" />
                        </div>
                      ))}
                      {/* Plane icon */}
                      <span className="absolute left-1/2 -translate-x-1/2 -top-3.5 text-[13px] leading-none">
                        ✈
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full border-[2.5px] border-black shrink-0" />
                  </div>
                  {stops === 0 ? (
                    <span className="text-[10px] text-gray-400">Direct</span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-semibold text-center">
                      {stops} stop{stops > 1 ? "s" : ""} · via {layoverAirports.join(", ")}
                    </span>
                  )}
                </div>

                {/* Arrival */}
                <div className="text-center shrink-0">
                  <p className="text-2xl font-extrabold text-black tabular-nums leading-none">
                    {formatTime(lastSeg.arrivalTime)}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">{lastSeg.destination}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(lastSeg.arrivalTime)}</p>
                </div>

                {/* Cabin badge + flight numbers */}
                <div className="w-24 shrink-0 text-right space-y-1">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-black text-white">
                    {firstSeg.cabinClass}
                  </span>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {slice.segments.map((s) => `${s.airlineDetail.iataCode}${s.flightNumber}`).join(" · ")}
                  </p>
                </div>
              </div>

              {/* Expandable segment breakdown (for multi-segment slices) */}
              {slice.segments.length > 1 && (
                <details className="mt-4 group/det">
                  <summary className="text-[11px] text-gray-400 cursor-pointer select-none hover:text-black transition-colors list-none flex items-center gap-1.5 w-fit">
                    <span className="group-open/det:hidden">▸</span>
                    <span className="hidden group-open/det:inline">▾</span>
                    View {slice.segments.length} segments
                  </summary>

                  <div className="mt-3 ml-1 border-l-2 border-gray-100 pl-3 space-y-0">
                    {slice.segments.map((seg, i) => (
                      <div key={i}>
                        {/* Layover gap */}
                        {i > 0 && (
                          <div className="flex items-center gap-2 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            <span className="text-[10px] text-gray-400 italic">
                              Layover at {seg.origin}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 py-2.5 rounded-lg px-2 hover:bg-gray-50 transition-colors">
                          <img
                            src={seg.airlineDetail.logo}
                            alt={seg.airlineDetail.name}
                            className="w-6 h-6 object-contain shrink-0"
                          />
                          <div className="flex-1 grid grid-cols-4 gap-2 text-xs items-center">
                            <div>
                              <p className="font-bold text-black tabular-nums">{formatTime(seg.departureTime)}</p>
                              <p className="text-gray-500">{seg.origin} · {formatDate(seg.departureTime)}</p>
                            </div>
                            <div className="text-gray-300 text-center">—</div>
                            <div>
                              <p className="font-bold text-black tabular-nums">{formatTime(seg.arrivalTime)}</p>
                              <p className="text-gray-500">{seg.destination} · {formatDate(seg.arrivalTime)}</p>
                            </div>
                            <div className="text-right text-gray-400">
                              <p className="font-semibold text-gray-600">
                                {seg.airlineDetail.iataCode}{seg.flightNumber}
                              </p>
                              <p className="capitalize">{seg.cabinClass}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer: passenger summary ── */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-3 flex-wrap">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
          Passengers
        </span>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
          {flight.passengerSummary.adults > 0 && (
            <span>
              {flight.passengerSummary.adults} Adult{flight.passengerSummary.adults > 1 ? "s" : ""}
            </span>
          )}
          {flight.passengerSummary.children > 0 && (
            <span>
              {flight.passengerSummary.children} Child{flight.passengerSummary.children > 1 ? "ren" : ""}
            </span>
          )}
          {flight.passengerSummary.infants > 0 && (
            <span>
              {flight.passengerSummary.infants} Infant{flight.passengerSummary.infants > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}