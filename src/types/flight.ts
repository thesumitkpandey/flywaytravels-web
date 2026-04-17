export type cabinClass =
  | "economy"
  | "premiumEconomy"
  | "business"
  | "first";

export type passenger = {
  id?: string;
  title?: string;
  bornOn?: string;
  email?: string;
  gender?: string;
  phone?: string;
};

export type slice = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  originAirportName?: string;
  destinationAirportName?: string;
  originAirportCity?: string;
  destinationAirportCity?: string;
};

export type Airport = {
  iataCode: string;
  airportName: string;
  cityName: string;
}

export type TripType = "oneWay" | "roundTrip";
  