"use client";

import { useState } from "react";

/* ---------- Types ---------- */
export interface Location {
  iataCode: string;
  cityName: string;
  airportName: string;
}

/* ---------- Mock Data (replace with API later) ---------- */
const AIRPORTS: Location[] = [
  {
    iataCode: "DEL",
    cityName: "New Delhi",
    airportName: "Indira Gandhi International Airport",
  },
  {
    iataCode: "BOM",
    cityName: "Mumbai",
    airportName: "Chhatrapati Shivaji Maharaj International Airport",
  },
  {
    iataCode: "BLR",
    cityName: "Bengaluru",
    airportName: "Kempegowda International Airport",
  },
  {
    iataCode: "HYD",
    cityName: "Hyderabad",
    airportName: "Rajiv Gandhi International Airport",
  },
];

/* ---------- Location Search Box ---------- */
export function LocationBox({
  value,
  onSelect,
  colSpan,
  placeholder = "Enter city or airport",
}: {
  value?: Location;
  onSelect: (loc: Location) => void;
  colSpan: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = AIRPORTS.filter(
    (a) =>
      a.cityName.toLowerCase().includes(query.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(query.toLowerCase()) ||
      a.airportName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`${colSpan} relative`}>
      {/* Input Box */}
      <div className="bg-white rounded-lg h-20 px-3 flex flex-col justify-center">
        <input
          value={
            open
              ? query
              : value
              ? `${value.cityName} (${value.iataCode})`
              : ""
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="text-lg font-bold outline-none bg-transparent"
        />

        {value && !open && (
          <p className="text-sm text-gray-500 truncate">
            {value.airportName}
          </p>
        )}
      </div>

      {/* Suggestions */}
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.map((airport) => (
            <div
              key={airport.iataCode}
              onClick={() => {
                onSelect(airport);
                setQuery("");
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-red-50"
            >
              <p className="font-semibold">
                {airport.cityName} ({airport.iataCode})
              </p>
              <p className="text-xs text-gray-500 truncate">
                {airport.airportName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
