export interface Location {
    iataCode: string;
    cityName: string;
    airportName: string;
}

export enum CabinClass {
  ECONOMY = "ECONOMY",
  PREMIUM_ECONOMY = "PREMIUM_ECONOMY",
  BUSINESS = "BUSINESS",
}
// flight.types.ts

export type TripType = "ONE_WAY" | "ROUND_TRIP";

export type PassengerType = "ADULT" | "CHILD" | "INFANT";


export interface AirlineDetail {
  iataCode: string;
  logo: string;
  name: string;
}

export interface FlightSegment {
  airlineDetail: AirlineDetail;
  arrivalTime: string; // ISO Date string
  departureTime: string; // ISO Date string
  origin: string;
  destination: string;
  flightNumber: string;
  cabinClass: string; // lowercase from API (business, economy etc.)
}

export interface FlightSlice {
  origin: string;
  destination: string;
  duration: string; // e.g., "28h 10m"
  segments: FlightSegment[];
}

export interface PassengerSummary {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightOffer {
  offerId: string;
  changeAllowed: boolean;
  refundable: boolean;
  currency: string;
  totalAmount: number;
  expiresAt: string; // ISO date string
  passengerSummary: PassengerSummary;
  slices: FlightSlice[];
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  message?: string;
  success?: boolean;
}