"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFlightStore } from "@/store/flight.store";
import { Airport, cabinClass as CabinClassType } from "@/types/flight";
import { ArrowLeftRight, ChevronDown, Trash2, Plane } from "lucide-react";
import { DatePicker, Input, Button, message } from "antd";
import dayjs from "dayjs";
import { createPortal } from "react-dom";
import axiosInstance from "@/provider/axios";
import { useRouter } from "next/navigation";

const FlightSearchComponent = () => {
  const {
    slices,
    setSlices,
    updateSlice,
    cabinClass,
    setCabinClass,
    passengers,
    addPassenger,
    removePassenger,
    updatePassenger,
    tripType,
    setTripType,
  } = useFlightStore();

const isRoundTrip = tripType === "roundTrip";
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"from" | "to" | null>(
    null,
  );
  const [passengerDropdownPos, setPassengerDropdownPos] = useState<{ top: number; right: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const passengerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const filteredAirports = airports;
  const router = useRouter();
  useEffect(() => {
    if (!searchQuery) {
      setAirports([]);
      return;
    }

    const fetchAirports = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/v1/airports/search", {
          params: { keyword: searchQuery }, // ✅ cleaner than string concat
        });

        setAirports(res || []);
      } catch (err) {
        console.error("Airport fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchAirports, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);
const handleTripTypeChange = (type: "oneWay" | "roundTrip") => {
  setTripType(type);

  const firstSlice = slices[0];

  if (type === "oneWay") {
    setSlices([firstSlice]);
  } else {
    setSlices([
      firstSlice,
      {
        origin: firstSlice.destination || "",
        destination: firstSlice.origin || "",
        originAirportName: firstSlice.destinationAirportName || "",
        destinationAirportName: firstSlice.originAirportName || "",
        originAirportCity: firstSlice.destinationAirportCity || "",
        destinationAirportCity: firstSlice.originAirportCity || "",
        departureDate: "",
      },
    ]);
  }
};

  const handleStartSearch = (type: "from" | "to") => {
    setActiveDropdown(type);
    setSearchQuery("");
    if (type === "from") {
      updateSlice(0, {
        origin: "",
        originAirportCity: "",
        originAirportName: "",
      });
    } else {
      updateSlice(0, {
        destination: "",
        destinationAirportCity: "",
        destinationAirportName: "",
      });
    }
  };

  const handleSelectAirport = (airport: Airport, type: "from" | "to") => {
    const updateData =
      type === "from"
        ? {
            origin: airport.iataCode,
            originAirportCity: airport.cityName,
            originAirportName: airport.airportName,
          }
        : {
            destination: airport.iataCode,
            destinationAirportCity: airport.cityName,
            destinationAirportName: airport.airportName,
          };

    updateSlice(0, updateData);
    setActiveDropdown(null);
    setSearchQuery("");
  };

  const handleSwapLocations = () => {
    const s1 = slices[0];
    updateSlice(0, {
      origin: s1.destination,
      destination: s1.origin,
      originAirportName: s1.destinationAirportName,
      destinationAirportName: s1.originAirportName,
      originAirportCity: s1.destinationAirportCity,
      destinationAirportCity: s1.originAirportCity,
    });
  };
const handleSearchFlights = () => {
  const finalSlices =
    tripType === "oneWay" ? [slices[0]] : slices.slice(0, 2);

  // ✅ 1. Passenger validation
  if (!passengers || passengers.length === 0) {
    message.error("Please add at least one passenger");
    return;
  }

  // ✅ 2. Slice validation
  if (!finalSlices || finalSlices.length === 0) {
    message.error("Please add at least one trip");
    return;
  }

  // ✅ 3. Slice fields validation
  const invalidSlice = finalSlices.find(
    (s) => !s.origin || !s.destination || !s.departureDate
  );

  if (invalidSlice) {
    message.error("Please fill origin, destination and departure date");
    return;
  }

  // ✅ 4. Round trip return date validation
  if (tripType === "roundTrip" && !finalSlices[1]?.departureDate) {
    message.error("Please select return date");
    return;
  }

  // ✅ Passed → proceed
  setSlices(finalSlices);

  router.push("/flights");
};
  const formatLabel = (text: string) =>
    text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const fieldBoxBase =
    "bg-white border border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 hover:border-amber-400 relative min-w-0";
  const fieldLabel =
    "text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5";
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 font-sans">
      {/* ── Header: Trip Type (Left) and Cabin Class (Right) ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 rounded-full p-1">
          {["oneWay", "roundTrip"].map((t) => (
            <button
              key={t}
              onClick={() => handleTripTypeChange(t as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                (t === "oneWay" ? !isRoundTrip : isRoundTrip)
                  ? "bg-amber-400 text-black shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "oneWay" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {["economy", "premiumEconomy", "business", "first"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCabinClass(cat as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all border ${
                cabinClass === cat
                  ? "bg-amber-400 border-amber-400 text-black shadow-sm"
                  : "bg-white border-gray-200 text-gray-400 hover:border-amber-200"
              }`}
            >
              {formatLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Search Row ── */}
      <div className="flex items-stretch gap-2 flex-wrap lg:flex-nowrap">
        {/* FROM */}
        <div
          className={`${fieldBoxBase} flex-1 min-w-[240px] ${activeDropdown === "from" ? "border-amber-400" : ""}`}
          ref={fromRef}
        >
          <div className={fieldLabel}>From</div>
          <div
            onClick={() => handleStartSearch("from")}
            className="min-h-[44px] flex flex-col justify-center"
          >
            {activeDropdown === "from" ? (
              <Input
                variant="borderless"
                autoFocus
                className="!p-0 !text-2xl !font-bold !text-black placeholder:text-gray-300"
                placeholder="Where from?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#171717] tracking-tight">
                  {slices[0]?.origin || "Select"}
                </div>
                <div className="text-[11px] text-gray-400 truncate font-medium">
                  {slices[0]?.originAirportCity
                    ? `${slices[0].originAirportCity}, `
                    : ""}
                  <span className="font-normal">
                    {slices[0]?.originAirportName || "Search City/Airport"}
                  </span>
                </div>
              </>
            )}
          </div>

          {activeDropdown === "from" && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] bg-white border border-gray-100 rounded-xl shadow-2xl z-[60] py-2">
              {filteredAirports.map((a) => (
                <div
                  key={a.iataCode}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer flex items-center justify-between group"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectAirport(a, "from");
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Plane
                      size={14}
                      className="text-gray-300 group-hover:text-amber-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {a.cityName}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                        {a.airportName}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-gray-200 group-hover:text-amber-500">
                    {a.iataCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSwapLocations}
          className="self-center w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-400 transition-all bg-white shadow-sm z-10 -mx-3"
        >
          <ArrowLeftRight size={16} className="text-amber-500" />
        </button>

        {/* TO */}
        <div
          className={`${fieldBoxBase} flex-1 min-w-[240px] ${activeDropdown === "to" ? "border-amber-400" : ""}`}
          ref={toRef}
        >
          <div className={fieldLabel}>To</div>
          <div
            onClick={() => handleStartSearch("to")}
            className="min-h-[44px] flex flex-col justify-center"
          >
            {activeDropdown === "to" ? (
              <Input
                variant="borderless"
                autoFocus
                className="!p-0 !text-2xl !font-bold !text-black placeholder:text-gray-300"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#171717] tracking-tight">
                  {slices[0]?.destination || "Select"}
                </div>
                <div className="text-[11px] text-gray-400 truncate font-medium">
                  {slices[0]?.destinationAirportCity
                    ? `${slices[0].destinationAirportCity}, `
                    : ""}
                  <span className="font-normal">
                    {slices[0]?.destinationAirportName || "Search City/Airport"}
                  </span>
                </div>
              </>
            )}
          </div>

          {activeDropdown === "to" && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[320px] bg-white border border-gray-100 rounded-xl shadow-2xl z-[60] py-2">
              {filteredAirports.map((a) => (
                <div
                  key={a.iataCode}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer flex items-center justify-between group"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectAirport(a, "to");
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Plane
                      size={14}
                      className="text-gray-300 group-hover:text-amber-500"
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {a.cityName}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                        {a.airportName}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-gray-200 group-hover:text-amber-500">
                    {a.iataCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATES */}
        <div className={`${fieldBoxBase} min-w-[160px]`}>
          <div className={fieldLabel}>Depart</div>
          <DatePicker
            value={
              slices[0]?.departureDate ? dayjs(slices[0].departureDate) : null
            }
            onChange={(date) =>
              updateSlice(0, { departureDate: date?.format("YYYY-MM-DD") })
            }
            format="DD MMM 'YY"
            variant="borderless"
            className="!p-0 w-full [&_input]:!text-lg [&_input]:!font-bold [&_input]:!text-black"
            allowClear={false}
          />
        </div>

        {isRoundTrip ? (
          <div className={`${fieldBoxBase} min-w-[160px]`}>
            <div className={fieldLabel}>Return</div>
            <DatePicker
              value={
                slices[1]?.departureDate ? dayjs(slices[1].departureDate) : null
              }
              onChange={(date) =>
                updateSlice(1, { departureDate: date?.format("YYYY-MM-DD") })
              }
              format="DD MMM 'YY"
              variant="borderless"
              className="!p-0 w-full [&_input]:!text-lg [&_input]:!font-bold [&_input]:!text-black"
            />
          </div>
        ) : (
          <div
            onClick={() => handleTripTypeChange("roundTrip")}
            className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl px-6 py-2 bg-gray-50 cursor-pointer hover:bg-amber-50 min-w-[160px] transition-all"
          >
            <div className={fieldLabel}>Return</div>
            <div className="text-sm font-bold text-amber-500">+ Add Return</div>
          </div>
        )}

        {/* TRAVELLERS */}
        {/* TRAVELLERS */}
        <div className={`${fieldBoxBase} min-w-[180px]`} ref={passengerRef}>
          <div className={fieldLabel}>Travellers</div>

          <div
            className="flex items-center justify-between"
onClick={() => {
  if (!showPassengerDropdown && passengerRef.current) {
    const rect = passengerRef.current.getBoundingClientRect();
    setPassengerDropdownPos({
      top: rect.bottom + window.scrollY + 8,
      right: window.innerWidth - rect.right,
    });
  }
  setShowPassengerDropdown((s) => !s);
}}          >
            <div className="text-lg font-bold">
              {passengers.length || 1}{" "}
              <span className="text-sm text-gray-400 font-medium">Pax</span>
            </div>

            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                showPassengerDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

{showPassengerDropdown && passengerDropdownPos &&
  createPortal(
    <div
      style={{ top: passengerDropdownPos.top, right: passengerDropdownPos.right, position: "absolute" }}
      className="w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Passengers
        </span>
        <button
          onClick={() => addPassenger({ bornOn: "" })}
          className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold text-sm flex items-center justify-center hover:bg-amber-500 transition-all"
        >
          +
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto px-4 py-3 space-y-2">
        {passengers.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400 font-semibold w-4">{idx + 1}</span>
<DatePicker
  variant="borderless"
  placeholder="Date of Birth"
  size="small"
  className="flex-1 !p-0 !text-xs font-bold"
  value={p.bornOn ? dayjs(p.bornOn) : null}
  getPopupContainer={() => document.body}
  popupStyle={{ zIndex: 99999 }}
  onChange={(date) => updatePassenger(idx, { bornOn: date?.format("YYYY-MM-DD") })}
/>
            <Trash2
              size={13}
              className="text-gray-300 hover:text-red-400 cursor-pointer flex-shrink-0 transition-colors"
              onClick={() => removePassenger(idx)}
            />
          </div>
        ))}
      </div>

      <div className="flex border-t border-gray-100">
        <button
          onClick={() => setShowPassengerDropdown(false)}
          className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => setShowPassengerDropdown(false)}
          className="flex-1 py-3 text-sm font-bold text-black bg-amber-400 hover:bg-amber-500 transition-colors"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  )
}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSearchFlights}
          className="!bg-amber-400 !text-black !font-bold !h-auto !px-16 !py-4 !rounded-xl !border-none shadow-lg shadow-amber-200 hover:!bg-amber-500 hover:!-translate-y-0.5 transition-all"
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
};

export default FlightSearchComponent;
