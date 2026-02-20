"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFlightSearchStore } from "@/store/search.store";
import { Location, CabinClass } from "@/types/flight";
import { format } from "date-fns";
import axiosInstance from "@/provider/axios";
import { ArrowLeftRight, Minus, Plus } from "lucide-react";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";


const FlightSearchComponent = () => {
  const {
    departureLocation,
    destinationLocation,
    journeyDate,
    returnDate,
    isRoundTrip,
    infantCount,
    childCount,
    adultCount,
    cabinClass,
    setDepartureLocation,
    setDestinationLocation,
    setJourneyDate,
    setReturnDate,
    setIsRoundTrip,
    setInfantCount,
    setChildCount,
    setAdultCount,
    setCabinClass,
  } = useFlightSearchStore();

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

      const res = await axiosInstance.get("/airports/search", {
        params: { keyword },
      });

      if (type === "departure") {
        setDepartureAirports(res.data);
      } else {
        setDestinationAirports(res.data);
      }
    } catch (error) {
      console.error("Airport fetch error:", error);
    } finally {
      setLoadingAirports(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departureRef.current && !departureRef.current.contains(event.target as Node)) {
        setShowDepartureDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAirports(departureSearch, "departure");
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [departureSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAirports(destinationSearch, "destination");
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [destinationSearch]);


  const handleSwapLocations = () => {
    const temp = departureLocation;
    setDepartureLocation(destinationLocation!);
    setDestinationLocation(temp!);
  };

  const getTotalPassengers = () => {
    return adultCount + childCount + infantCount;
  };

  const getCabinClassLabel = (cabin: CabinClass) => {
    switch (cabin) {
      case CabinClass.ECONOMY:
        return "Economy";
      case CabinClass.PREMIUM_ECONOMY:
        return "Premium Economy";
      case CabinClass.BUSINESS:
        return "Business";
      default:
        return "Economy";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Trip Type Selection */}
      <div className="mb-6">
        <Radio.Group
          className="trip-type-radio"
          value={isRoundTrip ? "ROUND_TRIP" : "ONE_WAY"}
          onChange={(e: RadioChangeEvent) => {
            setIsRoundTrip(e.target.value === "ROUND_TRIP");
          }}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="ONE_WAY">One Way</Radio.Button>
          <Radio.Button value="ROUND_TRIP">Round Trip</Radio.Button>
        </Radio.Group>

      </div>


      {/* Main Search Form */}
      <div className="grid grid-cols-14 gap-4 mb-4">
        {/* From - Departure Location */}
        <div className="col-span-12 md:col-span-3 relative" ref={departureRef}>
          <label className="block text-sm text-gray-600 mb-1">From</label>
          <input
            type="text"
            value={showDepartureDropdown ? departureSearch : `${departureLocation?.cityName} (${departureLocation?.iataCode})`}
            onChange={(e) => setDepartureSearch(e.target.value)}
            onFocus={() => {
              setShowDepartureDropdown(true);
              setDepartureSearch("");
            }}
            placeholder="Enter city or airport"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
          />
          {showDepartureDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {departureAirports.map((airport) => (
                <div
                  key={airport.iataCode}
                  onClick={() => {
                    setDepartureLocation(airport);
                    setShowDepartureDropdown(false);
                    setDepartureSearch("");
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {airport.cityName} ({airport.iataCode})
                  </div>
                  <div className="text-sm text-gray-600">{airport.airportName}</div>
                </div>
              ))}
              {!loadingAirports && departureAirports.length === 0 && (
                <div className="px-4 py-3 text-gray-500">No airports found</div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="col-span-12 md:col-span-1 flex items-center justify-center mt-6">
          <button
            onClick={handleSwapLocations}
            // className="p-3  bg-white hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Swap locations"
          >
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </button>
        </div>



        {/* To - Destination Location */}
        <div className="col-span-12 md:col-span-3 relative" ref={destinationRef}>
          <label className="block text-sm text-gray-600 mb-1">To</label>
          <input
            type="text"
            value={showDestinationDropdown ? destinationSearch : `${destinationLocation?.cityName} (${destinationLocation?.iataCode})`}
            onChange={(e) => setDestinationSearch(e.target.value)}
            onFocus={() => {
              setShowDestinationDropdown(true);
              setDestinationSearch("");
            }}
            placeholder="Enter city or airport"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
          />
          {showDestinationDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destinationAirports.map((airport) => (
                <div
                  key={airport.iataCode}
                  onClick={() => {
                    setDestinationLocation(airport);
                    setShowDestinationDropdown(false);
                    setDestinationSearch("");
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {airport.cityName} ({airport.iataCode})
                  </div>
                  <div className="text-sm text-gray-600">{airport.airportName}</div>
                </div>
              ))}
              {!loadingAirports && destinationAirports.length === 0 && (
                <div className="px-4 py-3 text-gray-500">No airports found</div>
              )}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="col-span-12 md:col-span-2">
          <label className="block text-sm text-black mb-1">Depart</label>
          <input
            type="date"
            value={journeyDate ? format(journeyDate, "yyyy-MM-dd") : ""}
            onChange={(e) => setJourneyDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:black focus:border-transparent text-black"
          />
        </div>

        {/* Return Date (conditionally rendered) */}
        {isRoundTrip && (
          <div className="col-span-12 md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Return</label>
            <input
              type="date"
              value={returnDate ? format(returnDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setReturnDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        )}

        {/* Add Return button for one way */}
        {!isRoundTrip && (
          <div className="col-span-12 md:col-span-2 flex items-end">
            <button
              onClick={() => setIsRoundTrip(true)}
              className="w-full px-4 py-3 text-black hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Add Return
            </button>
          </div>
        )}

        {/* Passenger & Class */}
        <div className="col-span-12 md:col-span-3 relative" ref={passengerRef}>
          <label className="block text-sm text-gray-600 mb-1">Passenger & Class</label>
          <button
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between overflow-hidden"
          >
            <span className="text-black truncate whitespace-nowrap">
              {getTotalPassengers()} Traveller{getTotalPassengers() !== 1 ? "s" : ""}, {getCabinClassLabel(cabinClass)}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-400 transition-transform ${showPassengerDropdown ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showPassengerDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              {/* Adults */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Adults</div>
                  <div className="text-sm text-gray-500">12+ years</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adultCount > 0 && setAdultCount(adultCount - 1)}
                    disabled={adultCount === 0}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4 text-black" />
                  </button>

                  <span className="w-8 text-center font-medium text-black">{adultCount}</span>
                  <button
                    onClick={() => setAdultCount(adultCount + 1)}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 flex items-center justify-center text-black"
                  >
                    <Plus className="h-4 w-4 text-black" />

                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Children</div>
                  <div className="text-sm text-gray-500">2-12 years</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => childCount > 0 && setChildCount(childCount - 1)}
                    disabled={childCount === 0}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4 text-black" />

                  </button>
                  <span className="w-8 text-center font-medium text-black">{childCount}</span>
                  <button
                    onClick={() => setChildCount(childCount + 1)}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 text-black" />

                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Infants</div>
                  <div className="text-sm text-gray-500">Under 2 years</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => infantCount > 0 && setInfantCount(infantCount - 1)}
                    disabled={infantCount === 0}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4 text-black" />

                  </button>
                  <span className="w-8 text-center font-medium text-black">{infantCount}</span>
                  <button
                    onClick={() => setInfantCount(infantCount + 1)}
                    className="w-8 h-8 rounded-full border border-black hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 text-black" />

                  </button>
                </div>
              </div>

              {/* Cabin Class */}
              <div className="mb-2">
                <div className="font-medium text-gray-900 mb-2">Cabin Class</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={cabinClass === CabinClass.ECONOMY}
                      onChange={() => setCabinClass(CabinClass.ECONOMY)}
                      className="w-4 h-4 text-black accent-black"
                    />
                    <span className="text-gray-700">Economy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={cabinClass === CabinClass.PREMIUM_ECONOMY}
                      onChange={() => setCabinClass(CabinClass.PREMIUM_ECONOMY)}
                      className="w-4 h-4 text-black accent-black"
                    />
                    <span className="text-gray-700">Premium Economy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={cabinClass === CabinClass.BUSINESS}
                      onChange={() => setCabinClass(CabinClass.BUSINESS)}
                      className="w-4 h-4 text-black accent-black"
                    />
                    <span className="text-gray-700">Business</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
      {/* Search Button */}
      <div className=" w-full justify-end mt-4  flex">
        <button className="w-40 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">
          Search
        </button>
      </div>
    </div>
  );
};

export default FlightSearchComponent;