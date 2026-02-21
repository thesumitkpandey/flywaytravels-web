"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFlightSearchStore } from "@/store/search.store";
import { CabinClass } from "@/types/flight";

export default function Flights() {
  const searchParams = useSearchParams();

  const {
    setDepartureLocation,
    setDestinationLocation,
    setJourneyDate,
    setReturnDate,
    setAdultCount,
    setChildCount,
    setInfantCount,
    setCabinClass,
    setIsRoundTrip,
  } = useFlightSearchStore();

  useEffect(() => {
    const fromCity = searchParams.get("fromCity");
    const fromCode = searchParams.get("fromCode");
    const fromAirport = searchParams.get("fromAirport");

    const toCity = searchParams.get("toCity");
    const toCode = searchParams.get("toCode");
    const toAirport = searchParams.get("toAirport");

    const depart = searchParams.get("depart");
    const returnDate = searchParams.get("return");

    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const infants = searchParams.get("infants");

    const cabin = searchParams.get("cabin");
    const tripType = searchParams.get("tripType");

    if (fromCity && fromCode && fromAirport) {
      setDepartureLocation({
        cityName: fromCity,
        iataCode: fromCode,
        airportName: fromAirport,
      });
    }

    if (toCity && toCode && toAirport) {
      setDestinationLocation({
        cityName: toCity,
        iataCode: toCode,
        airportName: toAirport,
      });
    }

    if (depart) setJourneyDate(new Date(depart));
    if (returnDate) setReturnDate(new Date(returnDate));

    if (adults) setAdultCount(Number(adults));
    if (children) setChildCount(Number(children));
    if (infants) setInfantCount(Number(infants));

    if (cabin) setCabinClass(cabin as CabinClass);

    if (tripType) setIsRoundTrip(tripType === "ROUND_TRIP");

  }, [searchParams]);
  return <h1>Flights Page</h1>;
}