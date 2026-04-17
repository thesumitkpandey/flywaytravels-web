import { create } from "zustand";
import { passenger, cabinClass, slice, TripType } from "@/types/flight";

type FlightState = {
    // States
    passengers: passenger[];
    cabinClass: cabinClass;
    slices: slice[];
    tripType: TripType;

    // Passenger Actions
    addPassenger: (p?: Partial<passenger>) => void;
    updatePassenger: (index: number, data: Partial<passenger>) => void;
    removePassenger: (index: number) => void;
    setPassengers: (list: passenger[]) => void;

    // Slice Actions
    addSlice: (s?: Partial<slice>) => void;
    updateSlice: (index: number, data: Partial<slice>) => void;
    removeSlice: (index: number) => void;
    setSlices: (list: slice[]) => void;
    setTripType: (type: TripType) => void;
    // Cabin
    setCabinClass: (cabin: cabinClass) => void;

    clear: () => void;
};

export const useFlightStore = create<FlightState>((set) => ({
    passengers: [],
    cabinClass: "economy",
    tripType: "oneWay",
    slices: [
        {
            origin: "NYC",
            destination: "LHR",
            originAirportName: "John F. Kennedy International Airport",
            destinationAirportName: "London Heathrow Airport",
            originAirportCity: "New York",
            destinationAirportCity: "London",
            departureDate: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
        },
    ],

    addPassenger: (p = {}) =>
        set((state) => ({
            passengers: [...state.passengers, { ...p }],
        })),

    updatePassenger: (index, data) =>
        set((state) => ({
            passengers: state.passengers.map((p, i) =>
                i === index ? { ...p, ...data } : p
            ),
        })),

    removePassenger: (index) =>
        set((state) => ({
            passengers: state.passengers.filter((_, i) => i !== index),
        })),

    setPassengers: (list) => set({ passengers: list }),

    addSlice: (s = {}) =>
        set((state) => ({
            slices: [...state.slices, { ...s }],
        })),

    updateSlice: (index, data) =>
        set((state) => ({
            slices: state.slices.map((s, i) =>
                i === index ? { ...s, ...data } : s
            ),
        })),
setTripType: (type) => set({ tripType: type }),
    removeSlice: (index) =>
        set((state) => ({
            slices: state.slices.filter((_, i) => i !== index),
        })),

    setSlices: (list) => set({ slices: list }),

    setCabinClass: (cabin) => set({ cabinClass: cabin }),

    clear: () =>
        set({
            passengers: [],
            cabinClass: "economy",
            slices: [],
        }),
}));