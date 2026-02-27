import { create } from "zustand";
import { CabinClass } from "@/types/flight";

interface FlightSearchState {
  departureAirport?: string;
  destinationAirport?: string;
  journeyDate: Date | null;
  returnDate: Date | null;
  isRoundTrip: boolean;
  infantCount: number;
  childCount: number;
  adultCount: number;
  cabinClass: CabinClass;

  setDepartureAirport: (from: string) => void;
  setDestinationAirport: (to: string) => void;
  setJourneyDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setIsRoundTrip: (value: boolean) => void;
  setInfantCount: (count: number) => void;
  setChildCount: (count: number) => void;
  setAdultCount: (count: number) => void;
  setCabinClass: (cabinClass: CabinClass) => void;
}

export const useFlightSearchStore = create<FlightSearchState>((set) => ({
  // States
  departureAirport: "NYC",
  destinationAirport: "DXB",
  journeyDate: null,
  returnDate: null,
  isRoundTrip: false,
  infantCount: 0,
  childCount: 0,
  adultCount: 1, // usually default 1 adult
  cabinClass: CabinClass.ECONOMY,

  // Setters
  setDepartureAirport: (departureAirport) =>
    set({ departureAirport }),

  setDestinationAirport: (destinationAirport) =>
    set({ destinationAirport }),

  setJourneyDate: (journeyDate) =>
    set({ journeyDate }),

  setReturnDate: (returnDate) =>
    set({ returnDate }),

  setIsRoundTrip: (value) =>
    set({ isRoundTrip: value }),

  setInfantCount: (infantCount) =>
    set({ infantCount }),

  setChildCount: (childCount) =>
    set({ childCount }),

  setAdultCount: (adultCount) =>
    set({ adultCount }),

  setCabinClass: (cabinClass) =>
    set({ cabinClass }),
}));