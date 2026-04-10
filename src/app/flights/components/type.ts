import { ReactNode } from "react";

export type SortKey = "cheapest" | "departure" | "arrival";

export interface Filters {
  maxDeparture: number;
  maxArrival: number;
  directOnly: boolean;
  airlines: string[];
}

export interface SortOption {
  key: SortKey;
  label: string;
  sub: string;
  icon: ReactNode;
}


export interface FlightOffer {
  offerId: string;
  totalAmount: number;
  currency: string;
  slices: FlightSlice[];
  airline: AirlineDetail;
}

export interface FlightSlice {
  origin: string;
  destination: string;
  originCity: string;      
  destinationCity: string;  
  duration: string;
  segments: FlightSegment[];
}

export interface FlightSegment {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
  cabinClass: string;
  airlineName: string;
}

export interface AirlineDetail {
  name: string;
  iataCode: string;
  logo: string;
}


export interface SearchRequestPayload {
  cabinClass: string;
  slices: {
    origin: string;
    destination: string;
    departureDate: string; // "YYYY-MM-DD"
  }[];
  passengers: {
    bornOn: string; // "YYYY-MM-DD"
  }[];
}