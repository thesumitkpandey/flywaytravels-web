"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/provider/axios";
import { FlightOffer, SearchRequestPayload } from "./components/type";
import FlightResults from "./components/FlightResults";
import { useFlightStore } from "@/store/flight.store";

export default function ResultsPage() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // get persisted search state
  const { slices, passengers, cabinClass } = useFlightStore();

  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload: SearchRequestPayload = {
        slices: slices
          .filter((s) => s.origin && s.destination && s.departureDate)
          .map((s) => ({
            origin: s.origin!,
            destination: s.destination!,
            departureDate: s.departureDate!,
          })),
        passengers: passengers
          .filter((p) => p.bornOn)
          .map((p) => ({
            bornOn: p.bornOn!,
          })),
        cabinClass,
      };

      const res = await axiosInstance.post<FlightOffer[]>(
        "/v1/flights/search",
        payload,
      );

      setOffers(res ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  // fetch after store hydration (refresh-safe)
  useEffect(() => {
    if (!slices?.length) return;

    fetchFlights();
  }, [slices, passengers, cabinClass]);

  return <FlightResults offers={offers} isLoading={loading} error={error} />;
}
