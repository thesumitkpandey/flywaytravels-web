"use client";

interface Location {
    iataCode: string;
    cityName: string;
    airportName: string;
}

interface SearchComponentProps {
    isRoundTrip?: boolean;
    originLocation?: Location;
    destinationLocation?: Location;
    setIsRoundTrip?: (value: boolean) => void;
}

export default function SearchComponent({
    isRoundTrip,
    originLocation,
    setIsRoundTrip = () => { },
    destinationLocation,
}: SearchComponentProps) {
    return (
        <div className="max-w-7xl mx-auto bg-[#fdeeee] rounded-2xl shadow-xl p-6">

            {/* Top Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="relative">
                    <span className="absolute -top-2 left-3 text-[10px] bg-red-600 text-white px-2 py-[1px] rounded-full">
                        Upto 19% Off
                    </span>
                    <button className="px-5 py-2 rounded-full border border-red-500 bg-white text-red-600 text-sm font-semibold">
                        ✈ Flights
                    </button>
                </div>

                <div className="flex gap-6 text-sm font-medium">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={!isRoundTrip}
                            onClick={() => setIsRoundTrip(false)}
                            className="accent-red-500"
                        />
                        One Way
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={isRoundTrip}
                            onClick={() => setIsRoundTrip(true)}
                            className="accent-red-500"
                        />
                        Round Trip
                    </label>
                </div>
            </div>

            {/* Main Row */}
            <div className="grid grid-cols-12 gap-4 items-center">

                {/* From */}
                <LocationBox
                    title="Departure"
                    city={originLocation?.cityName}
                    sub={`${originLocation?.iataCode}, ${originLocation?.airportName}`}
                    colSpan={isRoundTrip ? "col-span-2" : "col-span-3"}

                />

                {/* Swap */}
                <div className="col-span-1 flex justify-center">
                    <div className="w-9 h-9 rounded-full border bg-white flex items-center justify-center text-red-500">
                        ⇄
                    </div>
                </div>

                {/* To */}
                <LocationBox
                    title="Destination"
                    city={destinationLocation?.cityName ?? "Mumbai"}
                    sub={`${destinationLocation?.iataCode ?? "BOM"}, ${destinationLocation?.airportName 
                        }`}
                    colSpan={isRoundTrip ? "col-span-2" : "col-span-3"}
                />

                {/* Departure */}
                <DateBox
                    title="Departure Date"
                    main="09 Feb'26"
                    sub="Monday"
                />

                {/* Return */}
                {isRoundTrip && <DateBox
                    title="Return Date"
                    helper={
                        isRoundTrip
                            ? "Select return date"
                            : "Book Round Trip to save extra"
                    }
                />}

                {/* Travellers */}
                <div className="col-span-2 bg-white rounded-lg h-20 px-3 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 mb-1">Travellers & Class</p>
                    <p className="text-lg font-bold">1 Traveller</p>
                    <p className="text-sm text-gray-500">Economy</p>
                </div>

                {/* Search (UNCHANGED) */}
                <div className="col-span-1">
                    <button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg">
                        Search
                    </button>
                </div>
            </div>

            {/* Bottom Options */}
            <div className="flex gap-4 mt-5">
                <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500 bg-white text-red-600 text-sm cursor-pointer">
                    <input type="radio" checked readOnly className="accent-red-500" />
                    Regular
                </label>
            </div>
        </div>
    );
}

/* ---------- Helpers ---------- */

function LocationBox({
    title,
    city,
    sub,
    colSpan,
}: {
    title?: string;
    city?: string;
    sub?: string;
    colSpan: string;
}) {
    return (
        <div className={`${colSpan} bg-white rounded-lg h-20 px-3 flex flex-col justify-center`}>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className="text-xl font-bold leading-tight">{city}</p>
            <p className="text-sm text-gray-500 truncate">{sub}</p>
        </div>
    );
}


function DateBox({
    title,
    main,
    sub,
    helper,
}: {
    title: string;
    main?: string;
    sub?: string;
    helper?: string;
}) {
    return (
        <div className="col-span-2 bg-white rounded-lg h-20 px-3 flex flex-col justify-center">
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            {main ? (
                <>
                    <p className="text-xl font-bold leading-tight">{main}</p>
                    <p className="text-sm text-gray-500">{sub}</p>
                </>
            ) : (
                <p className="text-sm text-blue-600 font-medium">
                    {helper}
                </p>
            )}
        </div>
    );
}
