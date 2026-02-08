import { create } from "zustand";
import { CabinClass, Location } from "@/types/flight";

interface FlightSearchState {
    from?: Location;
    to?: Location;
    journeyDate: Date | null;
    returnDate: Date | null;
    isRoundTrip: boolean;
    infantCount : number;
    childCount : number;
    adultCount : number;
    cabinClass : CabinClass;

    setFrom: (from: Location) => void;
    setTo: (to: Location) => void;
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
    from: undefined,
    to: undefined,
    journeyDate: null,
    returnDate: null,
    isRoundTrip: false,
    infantCount : 0,
    childCount : 0,
    adultCount : 0,
    cabinClass : CabinClass.ECONOMY,
    //SetStates
    setFrom: (from) => set({ from }),
    setTo: (to) => set({ to }),
    setJourneyDate: (journeyDate) => set({ journeyDate }),
    setReturnDate: (returnDate) => set({ returnDate }),
    setIsRoundTrip: (value) => set({ isRoundTrip: value }),
    setInfantCount : (infantCount) => set({ infantCount }),
    setChildCount : (childCount) => set({ childCount }),
    setAdultCount : (adultCount) => set({ adultCount }),
    setCabinClass : (cabinClass) => set({ cabinClass }),
}));
