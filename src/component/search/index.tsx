"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFlightSearchStore } from "@/store/search.store";
import { Location, CabinClass } from "@/types/flight";
import axiosInstance from "@/provider/axios";
import { ArrowLeftRight, Minus, Plus, ChevronDown, GraduationCap, User } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const FlightSearchComponent = () => {
  const {
    departureAirport,
    destinationAirport,
    journeyDate,
    returnDate,
    isRoundTrip,
    infantCount,
    childCount,
    adultCount,
    cabinClass,
    setJourneyDate,
    setDepartureAirport,
    setDestinationAirport,
    setReturnDate,
    setIsRoundTrip,
    setInfantCount,
    setChildCount,
    setAdultCount,
    setCabinClass,
  } = useFlightSearchStore();

const [departureLocation, setDepartureLocation] = useState<Location | null>(null);
const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);

  const [fareType, setFareType] = useState<"regular" | "student">("regular");

  const router = useRouter();
  const [departureAirports, setDepartureAirports] = useState<Location[]>([]);
  const [destinationAirports, setDestinationAirports] = useState<Location[]>([]);
  const [loadingAirports, setLoadingAirports] = useState(false);

  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  const [departureSearch, setDepartureSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");

  const departureRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  const fetchAirports = async (keyword: string, type: "departure" | "destination") => {
    if (!keyword) return;
    try {
      setLoadingAirports(true);
      const res = await axiosInstance.get("/airports/search", { params: { keyword } });
      if (type === "departure") {
        setDepartureAirports(res.data.data);
      } else {
        setDestinationAirports(res.data.data);
      }
    } catch (error) {
      console.error("Airport fetch error:", error);
    } finally {
      setLoadingAirports(false);
    }
  };

  useEffect(() => {
  const fetchAirportByCode = async (
    code: string,
    type: "departure" | "destination"
  ) => {
    try {
      const res = await axiosInstance.get("/airports/search", {
        params: { keyword: code },
      });

      const airport = res.data.data?.find(
        (a: Location) => a.iataCode === code
      );

      if (!airport) return;

      if (type === "departure") {
        setDepartureLocation(airport);
      } else {
        setDestinationLocation(airport);
      }
    } catch (err) {
      console.error("Airport fetch failed", err);
    }
  };

  if (departureAirport) {
    fetchAirportByCode(departureAirport, "departure");
  }

  if (destinationAirport) {
    fetchAirportByCode(destinationAirport, "destination");
  }
}, [departureAirport, destinationAirport]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (departureRef.current && !departureRef.current.contains(e.target as Node))
        setShowDepartureDropdown(false);
      if (destinationRef.current && !destinationRef.current.contains(e.target as Node))
        setShowDestinationDropdown(false);
      if (passengerRef.current && !passengerRef.current.contains(e.target as Node))
        setShowPassengerDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchAirports(departureSearch, "departure"), 400);
    return () => clearTimeout(t);
  }, [departureSearch]);

  useEffect(() => {
    const t = setTimeout(() => fetchAirports(destinationSearch, "destination"), 400);
    return () => clearTimeout(t);
  }, [destinationSearch]);

const handleSwapLocations = () => {
  if (!departureLocation || !destinationLocation) return;

  const temp = departureLocation;

  setDepartureLocation(destinationLocation);
  setDestinationLocation(temp);

  setDepartureAirport(destinationLocation.iataCode);
  setDestinationAirport(temp.iataCode);
};

  const getTotalPassengers = () => adultCount + childCount + infantCount;

  const getCabinClassLabel = (cabin: CabinClass) => {
    switch (cabin) {
      case CabinClass.ECONOMY: return "Economy";
      case CabinClass.PREMIUM_ECONOMY: return "Premium Economy";
      case CabinClass.BUSINESS: return "Business";
      default: return "Economy";
    }
  };

  const handleSearch = () => {
    if (!departureLocation || !destinationLocation || !journeyDate) return;
    const params = new URLSearchParams({
      departure: departureLocation.iataCode,
      destination: destinationLocation.iataCode,
      depart: dayjs(journeyDate).format("YYYY-MM-DD"),
      return: returnDate ? dayjs(returnDate).format("YYYY-MM-DD") : "",
      adults: adultCount.toString(),
      children: childCount.toString(),
      infants: infantCount.toString(),
      cabin: cabinClass,
      tripType: isRoundTrip ? "ROUND_TRIP" : "ONE_WAY",
    });
    router.push(`/flights?${params.toString()}`);
  };

  // Shared field box classes
  const fieldBoxBase =
    "bg-white border border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 hover:border-red-500 hover:shadow-[0_0_0_3px_rgba(227,24,55,0.08)] focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(227,24,55,0.08)] relative min-w-0";

  const fieldLabel = "text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5";

  const dropdownItem =
    "px-4 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 hover:bg-red-50 transition-colors duration-150";

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 font-sans">

      {/* ── Trip Type Pills ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex bg-gray-100 rounded-full p-1 gap-0.5">
          <button
            onClick={() => setIsRoundTrip(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              !isRoundTrip
                ? "bg-red-600 text-white shadow-[0_2px_8px_rgba(227,24,55,0.3)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            One Way
          </button>
          <button
            onClick={() => setIsRoundTrip(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              isRoundTrip
                ? "bg-red-600 text-white shadow-[0_2px_8px_rgba(227,24,55,0.3)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Round Trip
          </button>
        </div>
      </div>

      {/* ── Main Search Row ── */}
      <div className="flex items-stretch gap-2 flex-nowrap">

        {/* Departure */}
        <div className={`${fieldBoxBase} flex-1`} ref={departureRef}>
          <div className={fieldLabel}>From</div>
          {showDepartureDropdown ? (
            <input
              autoFocus
              type="text"
              value={departureSearch}
              onChange={(e) => setDepartureSearch(e.target.value)}
              placeholder="City or airport"
              className="border-none outline-none bg-transparent text-2xl font-bold text-gray-900 w-full tracking-tight placeholder:text-base placeholder:font-normal placeholder:text-gray-300 p-0"
            />
          ) : (
            <div
              onClick={() => {
                setShowDepartureDropdown(true);
                setDepartureSearch("");
              }}
            >
              <div className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {departureLocation?.iataCode}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">
                {departureLocation?.cityName}, {departureLocation?.airportName}
              </div>
            </div>
          )}

          {showDepartureDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto z-50">
              {departureAirports.map((airport) => (
                <div
                  key={airport.iataCode}
                  className={dropdownItem}
                  onClick={() => {
                    setDepartureLocation(airport);
                    setDepartureAirport(airport.iataCode);
                    setShowDepartureDropdown(false);
                    setDepartureSearch("");
                  }}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {airport.cityName}{" "}
                    <span className="text-red-600">({airport.iataCode})</span>
                  </div>
                  <div className="text-xs text-gray-400">{airport.airportName}</div>
                </div>
              ))}
              {!loadingAirports && departureAirports.length === 0 && (
                <div className={`${dropdownItem} text-gray-400 text-sm`}>No airports found</div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={handleSwapLocations}
            aria-label="Swap locations"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-red-500 hover:bg-red-50 hover:rotate-180"
          >
            <ArrowLeftRight size={16} className="text-red-600" />
          </button>
        </div>

        {/* Destination */}
        <div className={`${fieldBoxBase} flex-1`} ref={destinationRef}>
          <div className={fieldLabel}>To</div>
          {showDestinationDropdown ? (
            <input
              autoFocus
              type="text"
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              placeholder="City or airport"
              className="border-none outline-none bg-transparent text-2xl font-bold text-gray-900 w-full tracking-tight placeholder:text-base placeholder:font-normal placeholder:text-gray-300 p-0"
            />
          ) : (
            <div
              onClick={() => {
                setShowDestinationDropdown(true);
                setDestinationSearch("");
              }}
            >
              <div className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {destinationLocation?.iataCode}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">
                {destinationLocation?.cityName}, {destinationLocation?.airportName}
              </div>
            </div>
          )}

          {showDestinationDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto z-50">
              {destinationAirports.map((airport) => (
                <div
                  key={airport.iataCode}
                  className={dropdownItem}
                  onClick={() => {
                    setDestinationLocation(airport);
                    setDestinationAirport(airport.iataCode);
                    setShowDestinationDropdown(false);
                    setDestinationSearch("");
                  }}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {airport.cityName}{" "}
                    <span className="text-red-600">({airport.iataCode})</span>
                  </div>
                  <div className="text-xs text-gray-400">{airport.airportName}</div>
                </div>
              ))}
              {!loadingAirports && destinationAirports.length === 0 && (
                <div className={`${dropdownItem} text-gray-400 text-sm`}>No airports found</div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200 flex-shrink-0 self-center" />

        {/* Depart Date */}
        <div className={`${fieldBoxBase}`} style={{ minWidth: 140 }}>
          <div className={fieldLabel}>Depart</div>
          <DatePicker
            value={journeyDate ? dayjs(journeyDate) : null}
            onChange={(date) => setJourneyDate(date ? date.toDate() : null)}
            format="DD MMM 'YY"
            placeholder="Select date"
            variant="borderless"
            className="!p-0 !border-none !shadow-none !bg-transparent w-full [&_.ant-picker-input_input]:!text-lg [&_.ant-picker-input_input]:!font-bold [&_.ant-picker-input_input]:!text-gray-900 [&_.ant-picker-input_input]:!tracking-tight [&_.ant-picker-suffix]:!hidden"
            popupClassName="[&_.ant-picker-panel]:!rounded-2xl [&_.ant-picker-panel]:!shadow-2xl [&_.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-red-600 [&_.ant-picker-cell-today_.ant-picker-cell-inner]:!border-red-600 [&_.ant-picker-cell-today_.ant-picker-cell-inner]:!text-red-600 [&_.ant-picker-header-view_button:hover]:!text-red-600 [&_.ant-picker-today-btn]:!text-red-600"
          />
          {journeyDate && (
            <div className="text-xs text-gray-400 mt-0.5">{dayjs(journeyDate).format("dddd")}</div>
          )}
        </div>

        {/* Return Date or Add Return */}
        {isRoundTrip ? (
          <>
            <div className="w-px h-12 bg-gray-200 flex-shrink-0 self-center" />
            <div className={`${fieldBoxBase}`} style={{ minWidth: 140 }}>
              <div className={fieldLabel}>Return</div>
              <DatePicker
                value={returnDate ? dayjs(returnDate) : null}
                onChange={(date) => setReturnDate(date ? date.toDate() : null)}
                format="DD MMM 'YY"
                placeholder="Select date"
                variant="borderless"
                className="!p-0 !border-none !shadow-none !bg-transparent w-full [&_.ant-picker-input_input]:!text-lg [&_.ant-picker-input_input]:!font-bold [&_.ant-picker-input_input]:!text-gray-900 [&_.ant-picker-input_input]:!tracking-tight [&_.ant-picker-suffix]:!hidden"
                popupClassName="[&_.ant-picker-panel]:!rounded-2xl [&_.ant-picker-panel]:!shadow-2xl [&_.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-red-600 [&_.ant-picker-cell-today_.ant-picker-cell-inner]:!border-red-600 [&_.ant-picker-cell-today_.ant-picker-cell-inner]:!text-red-600 [&_.ant-picker-header-view_button:hover]:!text-red-600 [&_.ant-picker-today-btn]:!text-red-600"
              />
              {returnDate && (
                <div className="text-xs text-gray-400 mt-0.5">{dayjs(returnDate).format("dddd")}</div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-px h-12 bg-gray-200 flex-shrink-0 self-center" />
            <div
              className="flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200"
              style={{ minWidth: 140 }}
              onClick={() => setIsRoundTrip(true)}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 mb-1">
                Return
              </div>
              <div className="text-sm font-semibold text-red-600">+ Add Return</div>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="w-px h-12 bg-gray-200 flex-shrink-0 self-center" />

        {/* Passengers & Class */}
        <div className={`${fieldBoxBase}`} style={{ minWidth: 160 }} ref={passengerRef}>
          <div className={fieldLabel}>Travellers & Class</div>
          <button
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="border-none bg-transparent p-0 cursor-pointer text-left w-full"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                {getTotalPassengers()}{" "}
                <span className="text-sm font-medium text-gray-500">
                  Traveller{getTotalPassengers() !== 1 ? "s" : ""}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${showPassengerDropdown ? "rotate-180" : ""}`}
              />
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{getCabinClassLabel(cabinClass)}</div>
          </button>

          {showPassengerDropdown && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-72 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 z-50">
              {[
                { label: "Adults", sub: "12+ years", count: adultCount, set: setAdultCount },
                { label: "Children", sub: "2–12 years", count: childCount, set: setChildCount },
                { label: "Infants", sub: "Under 2 years", count: infantCount, set: setInfantCount },
              ].map(({ label, sub, count, set }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{label}</div>
                    <div className="text-xs text-gray-400">{sub}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={count === 0}
                      onClick={() => count > 0 && set(count - 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all duration-150 hover:border-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center font-bold text-base text-gray-900">{count}</span>
                    <button
                      onClick={() => set(count + 1)}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all duration-150 hover:border-red-500 hover:text-red-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-widest">
                  Cabin Class
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { val: CabinClass.ECONOMY, label: "Economy" },
                    { val: CabinClass.PREMIUM_ECONOMY, label: "Prem. Economy" },
                    { val: CabinClass.BUSINESS, label: "Business" },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setCabinClass(val)}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ${
                        cabinClass === val
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row: Fare Type + Search Button ── */}
      <div className="flex items-center justify-between mt-5">
        {/* Fare Type Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFareType("regular")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
              fareType === "regular"
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-red-300"
            }`}
          >
            <User size={13} />
            Regular Fare
          </button>
          <button
            onClick={() => setFareType("student")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
              fareType === "student"
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-red-300"
            }`}
          >
            <GraduationCap size={13} />
            Student Fare
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-red-600 text-white border-none rounded-xl px-10 py-3.5 text-[15px] font-bold cursor-pointer tracking-wide shadow-[0_4px_16px_rgba(227,24,55,0.35)] transition-all duration-200 hover:bg-red-700 hover:shadow-[0_6px_20px_rgba(227,24,55,0.45)] hover:-translate-y-px active:translate-y-0"
        >
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default FlightSearchComponent;