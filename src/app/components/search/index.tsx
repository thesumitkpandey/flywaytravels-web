import React, { useState } from 'react';
import { Plane, Hotel, Palmtree, Bus, Train, Car, Sparkles, ArrowLeftRight } from 'lucide-react';

export default function FlightBooking() {
    const [tripType, setTripType] = useState('oneWay');
    const [fareType, setFareType] = useState('regular');
    const [nonStop, setNonStop] = useState(false);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Navigation */}
            <div className="flex items-center gap-3 mb-8">
                <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-red-700 transition-colors">
                    <Plane className="w-5 h-5" />
                    Flights
                    <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs px-2 py-0.5 rounded-full">
                        Upto 19% Off
                    </span>
                </button>
            </div>

            {/* Main Booking Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                {/* Trip Type Selection */}
                <div className="flex gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tripType"
                            value="oneWay"
                            checked={tripType === 'oneWay'}
                            onChange={(e) => setTripType(e.target.value)}
                            className="w-4 h-4 text-red-600"
                        />
                        <span className="font-medium text-gray-700">One Way</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tripType"
                            value="roundTrip"
                            checked={tripType === 'roundTrip'}
                            onChange={(e) => setTripType(e.target.value)}
                            className="w-4 h-4 text-red-600"
                        />
                        <span className="font-medium text-gray-700">Round Trip</span>
                    </label>
                </div>

                {/* Search Fields */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    {/* Departure From */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 mb-1 block">Departure From</label>
                        <div className="text-2xl font-bold text-gray-900">New Delhi</div>
                        <div className="text-sm text-gray-500">DEL, Indira Gandhi Internati...</div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors mt-6">
                            <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Going To */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 mb-1 block">Going To</label>
                        <div className="text-2xl font-bold text-gray-900">Mumbai</div>
                        <div className="text-sm text-gray-500">BOM, Chhatrapati Shivaji Int...</div>
                    </div>

                    {/* Departure Date */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 mb-1 block">Departure Date</label>
                        <div className="text-2xl font-bold text-gray-900">09 Feb'26</div>
                        <div className="text-sm text-gray-500">Monday</div>
                    </div>

                    {/* Travellers & Class */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 mb-1 block">Travellers & Class</label>
                        <div className="text-2xl font-bold text-gray-900">1 Traveller</div>
                        <div className="text-sm text-gray-500">Economy</div>
                        {tripType === 'oneWay' && (
                            <button className="text-sm text-blue-600 hover:underline mt-1">
                                Book Round Trip<br />to save extra
                            </button>
                        )}
                    </div>
                </div>

                {/* Fare Type and Options */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-300">
                            <input
                                type="radio"
                                name="fareType"
                                value="regular"
                                checked={fareType === 'regular'}
                                onChange={(e) => setFareType(e.target.value)}
                                className="w-4 h-4 text-red-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">Regular</div>
                                <div className="text-xs text-gray-600">Regular Fares</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full hover:bg-gray-50">
                            <input
                                type="radio"
                                name="fareType"
                                value="student"
                                checked={fareType === 'student'}
                                onChange={(e) => setFareType(e.target.value)}
                                className="w-4 h-4 text-red-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">Student</div>
                                <div className="text-xs text-gray-600">Extra Baggage</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full hover:bg-gray-50">
                            <input
                                type="radio"
                                name="fareType"
                                value="armedForces"
                                checked={fareType === 'armedForces'}
                                onChange={(e) => setFareType(e.target.value)}
                                className="w-4 h-4 text-red-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">Armed Forces</div>
                                <div className="text-xs text-gray-600">Extra Discount</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full hover:bg-gray-50">
                            <input
                                type="radio"
                                name="fareType"
                                value="seniorCitizen"
                                checked={fareType === 'seniorCitizen'}
                                onChange={(e) => setFareType(e.target.value)}
                                className="w-4 h-4 text-red-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">Senior Citizen</div>
                                <div className="text-xs text-gray-600">Extra Discount</div>
                            </div>
                        </label>

                        {/* <label className="flex items-center gap-2 cursor-pointer px-4 py-2">
                <input
                  type="checkbox"
                  checked={nonStop}
                  onChange={(e) => setNonStop(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="font-medium text-gray-900">Non-Stop Flights</span>
              </label> */}
                    </div>

                    <div className="flex gap-4 items-center">

                        <button className="px-12 py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}