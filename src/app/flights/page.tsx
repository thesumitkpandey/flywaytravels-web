"use client";
import { useEffect } from "react";
import axiosInstance from "@/provider/axios";
import { useState, useMemo } from "react";
import { useFlightStore } from "@/store/flight.store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Segment {
  airlineName: string;
  arrivalTime: string;
  cabinClass: string;
  departureTime: string;
  destination: string;
  flightNumber: string;
  origin: string;
}

export interface Slice {
  destination: string;
  duration: string;
  origin: string;
  segments: Segment[];
}

export interface Airline {
  iataCode: string;
  logo: string;
  name: string;
}

export interface FlightOffer {
  airline: Airline;
  currency: string;
  offerId: string;
  slices: Slice[];
  totalAmount: number;
}

interface Filters {
  airlines: string[];
  cabins: string[];
  stops: number[];
  maxPrice: number;
}

type SortKey = "price_asc" | "price_desc" | "duration_asc" | "stops_asc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const parseDuration = (d: string) => {
  const parts = d.replace("h", "h ").replace("m", "").trim().split(/\s+/);
  let mins = 0;
  parts.forEach((p) => {
    if (p.endsWith("h")) mins += parseInt(p) * 60;
    else mins += parseInt(p) || 0;
  });
  return mins;
};

const cabinColor = (cabin: string) => {
  switch (cabin) {
    case "first":
      return "bg-amber-400/20 text-amber-600 border border-amber-400/30";
    case "business":
      return "bg-sky-400/15 text-sky-600 border border-sky-300/30";
    default:
      return "bg-slate-100 text-slate-500 border border-slate-200";
  }
};

const cabinLabel = (cabin: string) =>
  cabin.charAt(0).toUpperCase() + cabin.slice(1);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-slate-100 rounded-full" />
            <div className="h-4 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="flex items-center gap-6 py-2">
            <div className="space-y-1.5">
              <div className="h-6 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-8 bg-slate-100 rounded" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full" />
              <div className="h-3 w-12 bg-slate-100 rounded mx-auto" />
            </div>
            <div className="space-y-1.5">
              <div className="h-6 w-16 bg-slate-100 rounded" />
              <div className="h-3 w-8 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-3 min-w-[120px]">
          <div className="h-8 w-24 bg-slate-100 rounded ml-auto" />
          <div className="h-9 w-full bg-amber-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── StopBadge ────────────────────────────────────────────────────────────────

function StopBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="text-xs font-semibold text-emerald-500">Nonstop</span>
    );
  return (
    <span className="text-xs font-semibold text-orange-400">
      {count} Stop{count > 1 ? "s" : ""}
    </span>
  );
}

// ─── SliceRow ─────────────────────────────────────────────────────────────────

function SliceRow({ slice }: { slice: Slice }) {
  const first = slice.segments[0];
  const last = slice.segments[slice.segments.length - 1];
  const stops = slice.segments.length - 1;
  const viaAirports = slice.segments.slice(0, -1).map((s) => s.destination);

  return (
    <div className="flex items-center gap-5 py-3">
      {/* Departure */}
      <div className="text-center w-[68px]">
        <div className="text-[17px] font-bold text-slate-800 tracking-tight leading-none">
          {fmtTime(first.departureTime)}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">
          {first.origin}
        </div>
        <div className="text-[10px] text-slate-300">
          {fmtDate(first.departureTime)}
        </div>
      </div>

      {/* Route line */}
      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        <div className="text-[11px] text-slate-400 font-medium">
          {slice.duration}
        </div>
        <div className="relative w-full h-3 flex items-center">
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-slate-200 via-amber-300 to-slate-200 rounded-full" />
          {/* departure dot */}
          <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
          {/* stop dots */}
          {viaAirports.map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400 border-2 border-white shadow-sm"
              style={{
                left: `${((i + 1) / (stops + 1)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            />
          ))}
          {/* arrival dot */}
          <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-center gap-1.5">
          <StopBadge count={stops} />
          {stops > 0 && (
            <span className="text-[10px] text-slate-300">
              · via {viaAirports.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Arrival */}
      <div className="text-center w-[68px]">
        <div className="text-[17px] font-bold text-slate-800 tracking-tight leading-none">
          {fmtTime(last.arrivalTime)}
        </div>
        <div className="text-xs text-slate-400 mt-0.5 font-medium">
          {last.destination}
        </div>
        <div className="text-[10px] text-slate-300">
          {fmtDate(last.arrivalTime)}
        </div>
      </div>

      {/* Cabin badge */}
      <div className="hidden sm:block shrink-0">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${cabinColor(first.cabinClass)}`}
        >
          {cabinLabel(first.cabinClass)}
        </span>
      </div>
    </div>
  );
}

// ─── FlightCard ───────────────────────────────────────────────────────────────

function FlightCard({ offer }: { offer: FlightOffer }) {
  const [expanded, setExpanded] = useState(false);
  const isRoundTrip = offer.slices.length > 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-300/60 transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Left: airline + flight rows */}
          <div className="flex-1 min-w-0">
            {/* Airline header */}
            <div className="flex items-center gap-2 mb-1">
              <img
                src={offer.airline.logo}
                alt={offer.airline.name}
                className="h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-sm font-semibold text-slate-500">
                {offer.airline.name}
              </span>
              {isRoundTrip && (
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  Round Trip
                </span>
              )}
            </div>

            {/* Outbound */}
            {isRoundTrip && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-0.5">
                Outbound
              </div>
            )}
            <SliceRow slice={offer.slices[0]} />

            {/* Return */}
            {isRoundTrip && offer.slices[1] && (
              <>
                <div className="border-t border-dashed border-slate-100" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-0.5">
                  Return
                </div>
                <SliceRow slice={offer.slices[1]} />
              </>
            )}
          </div>

          {/* Right: price + CTA */}
          <div className="flex flex-col items-end gap-2.5 shrink-0 pt-0.5">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                $
                {offer.totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                per person · {offer.currency}
              </div>
            </div>

            <button className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200/60 group-hover:shadow-amber-300/60 whitespace-nowrap">
              Select
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1 font-medium"
            >
              {expanded ? "Hide details" : "Show details"}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded segment detail */}
      {expanded && (
        <div className="border-t border-slate-50 bg-slate-50/70 px-5 py-4 space-y-3">
          {offer.slices.map((slice, si) => (
            <div key={si}>
              {isRoundTrip && (
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5">
                  {si === 0 ? "Outbound" : "Return"}
                </div>
              )}
              <div className="space-y-1">
                {slice.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-bold text-slate-700 w-20 shrink-0">
                      {seg.origin} → {seg.destination}
                    </span>
                    <span>
                      {fmtTime(seg.departureTime)} – {fmtTime(seg.arrivalTime)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">
                      Flight {seg.airlineName} {seg.flightNumber}
                    </span>
                    <span
                      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${cabinColor(seg.cabinClass)}`}
                    >
                      {cabinLabel(seg.cabinClass)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CheckboxItem ─────────────────────────────────────────────────────────────

function CheckboxItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
          checked
            ? "bg-amber-400 border-amber-400"
            : "border-slate-200 group-hover:border-amber-300"
        }`}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-tight capitalize">
        {label}
      </span>
    </label>
  );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

function FilterPanel({
  filters,
  setFilters,
  flights,
  defaultMaxPrice,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  flights: FlightOffer[];
  defaultMaxPrice: number;
}) {
  const allAirlines = [...new Set(flights.map((f) => f.airline.name))].sort();
  const allCabins = [
    ...new Set(
      flights.flatMap((f) =>
        f.slices.flatMap((s) => s.segments.map((seg) => seg.cabinClass)),
      ),
    ),
  ].sort();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-800 tracking-tight">
          Filters
        </h2>
        <button
          onClick={() =>
            setFilters({
              airlines: [],
              cabins: [],
              stops: [],
              maxPrice: defaultMaxPrice,
            })
          }
          className="text-xs text-amber-500 font-semibold hover:text-amber-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          Max Price
        </div>
        <input
          type="range"
          min={0}
          max={defaultMaxPrice}
          step={10}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-amber-400 h-1 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>$0</span>
          <span className="font-bold text-amber-500">
            ${filters.maxPrice.toFixed(0)}
          </span>
          <span>${defaultMaxPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Stops */}
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          Stops
        </div>
        <div className="space-y-2">
          {[
            { val: 0, label: "Nonstop" },
            { val: 1, label: "1 Stop" },
            { val: 2, label: "2+ Stops" },
          ].map(({ val, label }) => (
            <CheckboxItem
              key={val}
              checked={filters.stops.includes(val)}
              onChange={() => {
                const next = filters.stops.includes(val)
                  ? filters.stops.filter((x) => x !== val)
                  : [...filters.stops, val];
                setFilters({ ...filters, stops: next });
              }}
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Airlines */}
      {allAirlines.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Airlines
          </div>
          <div className="space-y-2">
            {allAirlines.map((name) => (
              <CheckboxItem
                key={name}
                checked={filters.airlines.includes(name)}
                onChange={() => {
                  const next = filters.airlines.includes(name)
                    ? filters.airlines.filter((a) => a !== name)
                    : [...filters.airlines, name];
                  setFilters({ ...filters, airlines: next });
                }}
                label={name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cabin Class */}
      {allCabins.length > 0 && (
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Cabin Class
          </div>
          <div className="space-y-2">
            {allCabins.map((c) => (
              <CheckboxItem
                key={c}
                checked={filters.cabins.includes(c)}
                onChange={() => {
                  const next = filters.cabins.includes(c)
                    ? filters.cabins.filter((x) => x !== c)
                    : [...filters.cabins, c];
                  setFilters({ ...filters, cabins: next });
                }}
                label={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SortBar ──────────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: "price_asc", label: "Cheapest", icon: "↓$" },
  { key: "price_desc", label: "Most Expensive", icon: "↑$" },
  { key: "duration_asc", label: "Shortest", icon: "⏱" },
  { key: "stops_asc", label: "Fewest Stops", icon: "✦" },
];

function SortBar({
  sort,
  setSort,
  count,
}: {
  sort: SortKey;
  setSort: (s: SortKey) => void;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-slate-500 shrink-0">
        <span className="font-bold text-slate-800">{count}</span> result
        {count !== 1 ? "s" : ""} found
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 font-medium mr-0.5">
          Sort by:
        </span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all duration-150 ${
              sort === opt.key
                ? "bg-amber-400 border-amber-400 text-slate-900 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-slate-700"
            }`}
          >
            <span className="text-[10px] opacity-70">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main FlightResults Component ────────────────────────────────────────────

interface FlightResultsProps {
  offers: FlightOffer[];
  isLoading: boolean;
  error: string | null;
}

export default function FlightResults() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { slices, passengers, cabinClass, tripType } = useFlightStore();
  const defaultMaxPrice = 5000;

  const [filters, setFilters] = useState<Filters>({
    airlines: [],
    cabins: [],
    stops: [],
    maxPrice: defaultMaxPrice,
  });

  const [sort, setSort] = useState<SortKey>("price_asc");

useEffect(() => {
  const fetchFlights = async () => {
    try {
      setIsLoading(true);

      const finalSlices =
        tripType === "oneWay" ? [slices[0]] : slices.slice(0, 2);

      const res = await axiosInstance.post("/v1/flights/search", {
        cabinClass,
        slices: finalSlices,
        passengers: passengers,
      });

      setOffers(res || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch flights");
    } finally {
      setIsLoading(false);
    }
  };

  fetchFlights();
}, []);

  const effectiveMaxPrice =
    filters.maxPrice === defaultMaxPrice ? defaultMaxPrice : filters.maxPrice;

  const filtered = useMemo(() => {
    return offers.filter((f) => {
      if (f.totalAmount > effectiveMaxPrice) return false;

      if (filters.airlines.length && !filters.airlines.includes(f.airline.name))
        return false;

      const flightCabins = f.slices.flatMap((s) =>
        s.segments.map((seg) => seg.cabinClass),
      );

      if (
        filters.cabins.length &&
        !filters.cabins.some((c) => flightCabins.includes(c))
      )
        return false;

      if (filters.stops.length) {
        const flightStops = f.slices.map((s) => s.segments.length - 1);
        const normalize = (n: number) => (n >= 2 ? 2 : n);

        if (!flightStops.some((s) => filters.stops.includes(normalize(s))))
          return false;
      }

      return true;
    });
  }, [offers, filters, effectiveMaxPrice]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.totalAmount - b.totalAmount;

        case "price_desc":
          return b.totalAmount - a.totalAmount;

        case "duration_asc":
          return (
            parseDuration(a.slices[0].duration) -
            parseDuration(b.slices[0].duration)
          );

        case "stops_asc":
          return a.slices[0].segments.length - b.slices[0].segments.length;

        default:
          return 0;
      }
    });
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-sky-50/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 hidden md:block">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            flights={offers}
            defaultMaxPrice={defaultMaxPrice}
          />
        </aside>

        {/* Results */}
        <div className="flex-1">
          <SortBar sort={sort} setSort={setSort} count={sorted.length} />

          {isLoading && (
            <div className="space-y-3 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && <div className="text-red-500 mt-4">{error}</div>}

          {!isLoading && sorted.length === 0 && (
            <div className="text-center mt-10">No flights found</div>
          )}

          {!isLoading && sorted.length > 0 && (
            <div className="space-y-3 mt-4">
              {sorted.map((offer) => (
                <FlightCard key={offer.offerId} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
