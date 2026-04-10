export const MOCK_OFFERS = [
  {
    offerId: "o1",
    totalAmount: 412.5,
    currency: "USD",
    airline: {
      name: "British Airways",
      iataCode: "BA",
      logo: "https://logo.clearbit.com/britishairways.com",
    },
    slices: [
      {
        origin: "JFK",
        destination: "LHR",
        originCity: "New York",
        destinationCity: "London",
        duration: "PT7H10M",
        segments: [
          {
            origin: "JFK",
            destination: "LHR",
            departureTime: "2025-09-12T22:10:00",
            arrivalTime: "2025-09-13T10:20:00",
            flightNumber: "BA 178",
            cabinClass: "economy",
            airlineName: "British Airways",
          },
        ],
      },
    ],
  },

  {
    offerId: "o2",
    totalAmount: 289.0,
    currency: "USD",
    airline: {
      name: "Norwegian Air",
      iataCode: "DY",
      logo: "https://logo.clearbit.com/norwegian.com",
    },
    slices: [
      {
        origin: "JFK",
        destination: "LGW",
        originCity: "New York",
        destinationCity: "London",
        duration: "PT7H45M",
        segments: [
          {
            origin: "JFK",
            destination: "LGW",
            departureTime: "2025-09-12T18:05:00",
            arrivalTime: "2025-09-13T06:50:00",
            flightNumber: "DY 7002",
            cabinClass: "economy",
            airlineName: "Norwegian Air",
          },
        ],
      },
    ],
  },

  {
    offerId: "o3",
    totalAmount: 874.0,
    currency: "USD",
    airline: {
      name: "Delta Air Lines",
      iataCode: "DL",
      logo: "https://logo.clearbit.com/delta.com",
    },
    slices: [
      {
        origin: "JFK",
        destination: "LHR",
        originCity: "New York",
        destinationCity: "London",
        duration: "PT9H30M",
        segments: [
          {
            origin: "JFK",
            destination: "ATL",
            departureTime: "2025-09-12T07:00:00",
            arrivalTime: "2025-09-12T09:30:00",
            flightNumber: "DL 402",
            cabinClass: "business",
            airlineName: "Delta Air Lines",
          },
          {
            origin: "ATL",
            destination: "LHR",
            departureTime: "2025-09-12T11:00:00",
            arrivalTime: "2025-09-13T01:30:00",
            flightNumber: "DL 30",
            cabinClass: "business",
            airlineName: "Delta Air Lines",
          },
        ],
      },
    ],
  },

  {
    offerId: "o4",
    totalAmount: 341.0,
    currency: "USD",
    airline: {
      name: "Aer Lingus",
      iataCode: "EI",
      logo: "https://logo.clearbit.com/aerlingus.com",
    },
    slices: [
      {
        origin: "JFK",
        destination: "LHR",
        originCity: "New York",
        destinationCity: "London",
        duration: "PT8H55M",
        segments: [
          {
            origin: "JFK",
            destination: "DUB",
            departureTime: "2025-09-12T21:30:00",
            arrivalTime: "2025-09-13T09:00:00",
            flightNumber: "EI 105",
            cabinClass: "economy",
            airlineName: "Aer Lingus",
          },
          {
            origin: "DUB",
            destination: "LHR",
            departureTime: "2025-09-13T10:30:00",
            arrivalTime: "2025-09-13T11:25:00",
            flightNumber: "EI 154",
            cabinClass: "economy",
            airlineName: "Aer Lingus",
          },
        ],
      },
    ],
  },

  {
    offerId: "o5",
    totalAmount: 519.0,
    currency: "USD",
    airline: {
      name: "Virgin Atlantic",
      iataCode: "VS",
      logo: "https://logo.clearbit.com/virginatlantic.com",
    },
    slices: [
      {
        origin: "JFK",
        destination: "LHR",
        originCity: "New York",
        destinationCity: "London",
        duration: "PT6H55M",
        segments: [
          {
            origin: "JFK",
            destination: "LHR",
            departureTime: "2025-09-12T09:15:00",
            arrivalTime: "2025-09-12T21:10:00",
            flightNumber: "VS 025",
            cabinClass: "economy",
            airlineName: "Virgin Atlantic",
          },
        ],
      },
    ],
  },
];