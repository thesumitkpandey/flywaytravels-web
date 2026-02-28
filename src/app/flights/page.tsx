"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFlightSearchStore } from "@/store/search.store";
import { CabinClass, FlightSearchResponse, FlightOffer } from "@/types/flight";
import axiosInstance from "@/provider/axios";
import FlightResults from "./components/FlightResults";
import FlightSearchComponent from "@/component/search";
export default function Flights() {
  const searchParams = useSearchParams();

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    setJourneyDate,
    setReturnDate,
    setAdultCount,
    setChildCount,
    setInfantCount,
    setCabinClass,
    setIsRoundTrip,
  } = useFlightSearchStore();

  useEffect(() => {
    const fromAirport = searchParams.get("departure");
    const toAirport = searchParams.get("destination");

    const depart = searchParams.get("depart");
    const returnDate = searchParams.get("return");

    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const infants = searchParams.get("infants");

    const cabin = searchParams.get("cabin");
    const tripType = searchParams.get("tripType");

    if (!fromAirport || !toAirport || !depart) return;

    if (depart) setJourneyDate(new Date(depart));
    if (returnDate) setReturnDate(new Date(returnDate));

    if (adults) setAdultCount(Number(adults));
    if (children) setChildCount(Number(children));
    if (infants) setInfantCount(Number(infants));

    if (cabin) setCabinClass(cabin as CabinClass);
    if (tripType) setIsRoundTrip(tripType === "ROUND_TRIP");

    async function getFlights() {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          tripType: tripType || "ONE_WAY",
          cabinClass: cabin || "ECONOMY",
          segments:
            tripType === "ROUND_TRIP"
              ? [
                  {
                    origin: fromAirport,
                    destination: toAirport,
                    dateOfJourney: depart,
                  },
                  {
                    origin: toAirport,
                    destination: fromAirport,
                    dateOfJourney: returnDate,
                  },
                ]
              : [
                  {
                    origin: fromAirport,
                    destination: toAirport,
                    dateOfJourney: depart,
                  },
                ],
          passengers: [
            ...Array(Number(adults || 1)).fill({ passengerType: "ADULT" }),
            ...Array(Number(children || 0)).fill({ passengerType: "CHILD" }),
            ...Array(Number(infants || 0)).fill({ passengerType: "INFANT" }),
          ],
        };

        const res = await axiosInstance.post<FlightSearchResponse>(
          "/flights/search",
          payload
        );

        setFlights(res.data.data);
      } catch (err: any) {
        setError("Failed to fetch flights");
      } finally {
        setLoading(false);
      }
    }

    getFlights();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <FlightSearchComponent/>
      <FlightResults flights={flights} loading={loading} error={error} />
    </div>
  );
}