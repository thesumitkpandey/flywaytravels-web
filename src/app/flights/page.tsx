"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/provider/axios";
import { FlightOffer, SearchRequestPayload } from "./components/type";
import FlightResults from "./components/FlightResults";
import { GlobalApiResponse } from "@/types/ApiResponse";

// ── Hardcoded search payload ───────────────────────────────────────────
const SEARCH_PAYLOAD: SearchRequestPayload = {
  cabinClass: "economy",
  slices: [
    {
      origin: "JFK",
      destination: "LHR",
      departureDate: "2026-09-12",
    },
  ],
  passengers: [
    { bornOn: "1990-01-15" },
    { bornOn: "1992-06-22" },
  ],
};

// ── API CALL ───────────────────────────────────────────────────────────
async function fetchFlights(): Promise<FlightOffer[]> {
  try {
    const {data} = await axiosInstance.post<
      GlobalApiResponse<{ offers: FlightOffer[] }>
    >("/v1/flights/search", SEARCH_PAYLOAD);

    return data.data.offers ?? [];
  } catch (err) {
    console.error("Failed to fetch flights:", err);
    throw err;
  }
}

// ── CLIENT COMPONENT ───────────────────────────────────────────────────
export default function ResultsPage() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        const data = await fetchFlights();
        setOffers(data);
      } catch (err) {
        setError("We couldn't load flights right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);
  console.log(offers, "these are offers")
  return (
    <FlightResults
      offers={offers}      // ✅ FIXED
      isLoading={loading}  // ✅ dynamic
      error={error}
    />
  );
}