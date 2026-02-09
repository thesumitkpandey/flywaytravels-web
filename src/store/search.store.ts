import { create } from "zustand";
import { CabinClass, Location } from "@/types/flight";

interface FlightSearchState {
    departureLocation?: Location;
    destinationLocation?: Location;
    journeyDate: Date | null;
    returnDate: Date | null;
    isRoundTrip: boolean;
    infantCount : number;
    childCount : number;
    adultCount : number;
    cabinClass : CabinClass;

    setDepartureLocation: (from: Location) => void;
    setDestinationLocation: (to: Location) => void;
    setJourneyDate: (date: Date | null) => void;
    setReturnDate: (date: Date | null) => void;
    setIsRoundTrip: (value: boolean) => void;
    setInfantCount : (count : number) => void;
    setChildCount : (count : number) => void;
    setAdultCount : (count : number) => void;
    setCabinClass : (cabinClass : CabinClass) => void;
}

export const useFlightSearchStore = create<FlightSearchState>((set) => ({
    //States
    departureLocation: {iataCode: "DEL", cityName: "Delhi", airportName: "Indira Gandhi International Airport"},
    destinationLocation: {iataCode: "BOM", cityName: "Mumbai", airportName: "Chhatrapati Shivaji Maharaj International Airport"},
    journeyDate: null,
    returnDate: null,
    isRoundTrip: false,
    infantCount : 0,
    childCount : 0,
    adultCount : 0,
    cabinClass : CabinClass.ECONOMY,
    //SetStates
    setDepartureLocation: (departureLocation) => set({ departureLocation }),
    setDestinationLocation: (destinationLocation) => set({ destinationLocation }),
    setJourneyDate: (journeyDate) => set({ journeyDate }),
    setReturnDate: (returnDate) => set({ returnDate }),
    setIsRoundTrip: (value) => set({ isRoundTrip: value }),
    setInfantCount : (infantCount) => set({ infantCount }),
    setChildCount : (childCount) => set({ childCount }),
    setAdultCount : (adultCount) => set({ adultCount }),
    setCabinClass : (cabinClass) => set({ cabinClass }),
}));
