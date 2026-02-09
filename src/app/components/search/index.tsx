import React, { useState } from 'react';
import { ArrowLeftRight, MapPin, Plus, Minus, X } from 'lucide-react';

// MUI Imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useFlightSearchStore } from '@/store/search.store';

const AIRPORTS = [
    { city: 'New Delhi', code: 'DEL', name: 'Indira Gandhi International Airport' },
    { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji International Airport' },
    { city: 'Bangalore', code: 'BLR', name: 'Kempegowda International Airport' },
];

const TravelSearch = () => {
    const isRoundTrip = useFlightSearchStore(state => state.isRoundTrip);
    const setIsRoundTrip = useFlightSearchStore(state => state.setIsRoundTrip);
    
    const [fromSearch, setFromSearch] = useState(AIRPORTS[0]);
    const [toSearch, setToSearch] = useState(AIRPORTS[1]);

    const [depDate, setDepDate] = useState<Dayjs | null>(dayjs('2026-02-09'));
    const [retDate, setRetDate] = useState<Dayjs | null>(dayjs('2026-02-12'));

    const [depOpen, setDepOpen] = useState(false);
    const [retOpen, setRetOpen] = useState(false);
    const [paxOpen, setPaxOpen] = useState(false);
    
    // Dropdown toggle states instead of activeField input logic
    const [showFromList, setShowFromList] = useState(false);
    const [showToList, setShowToList] = useState(false);

    // Traveller States
    const [pax, setPax] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabinClass, setCabinClass] = useState('Economy');

    const totalPax = pax.adults + pax.children + pax.infants;

    const updatePax = (type: keyof typeof pax, increment: boolean) => {
        setPax(prev => ({
            ...prev,
            [type]: increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
        }));
    };

    const DateDisplay = ({ date, label }: { date: Dayjs | null, label: string }) => (
        <div>
            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-bold text-gray-800">
                {date?.format('DD')} <span className="text-lg font-medium text-gray-600">{date?.format("MMM' YY")}</span>
            </h3>
            <p className="text-xs text-gray-500">{date?.format('dddd')}</p>
        </div>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="w-full max-w-6xl mx-auto p-4 font-sans select-none">
                <div className="bg-[#FFF1F1] rounded-2xl p-6 shadow-sm border border-red-50">

                    {/* Trip Type */}
                    <div className="flex gap-6 mb-6">
                        <label  className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={!isRoundTrip}
                                onChange={() => setIsRoundTrip(false)}
                                className="w-4 h-4 accent-red-600"
                            />
                            <span className={`text-sm font-medium ${!isRoundTrip ? 'text-red-600' : 'text-gray-700'}`}>
                                One Way
                            </span>
                        </label>
                        <label  className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={isRoundTrip}
                                onChange={() => setIsRoundTrip(true)}
                                className="w-4 h-4 accent-red-600"
                            />
                            <span className={`text-sm font-medium ${isRoundTrip ? 'text-red-600' : 'text-gray-700'}`}>
                                Round Trip
                            </span>
                        </label>
                    </div>

                    {/* Main Input Row */}
                    <div className="flex items-stretch bg-white rounded-xl border border-gray-200 shadow-sm mb-6 relative">

                        {/* From */}
                        <div className="flex-[1.2] relative border-r border-gray-100 p-4 hover:bg-blue-50 cursor-pointer" 
                             onClick={() => { setShowFromList(!showFromList); setShowToList(false); }}>
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">From</p>
                            <h3 className="text-2xl font-bold text-gray-800">{fromSearch.city}</h3>
                            <p className="text-xs text-gray-400 truncate">{fromSearch.code}, {fromSearch.name}</p>
                            {showFromList && <SuggestionList list={AIRPORTS} onSelect={(ap) => { setFromSearch(ap); setShowFromList(false); }} />}
                        </div>

                        {/* Swap */}
                        <div className="absolute left-[24%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                            <button onClick={(e) => { e.stopPropagation(); const t = fromSearch; setFromSearch(toSearch); setToSearch(t); }} className="bg-white border border-gray-200 p-2 rounded-full text-red-500 shadow-md hover:scale-110"><ArrowLeftRight size={14} /></button>
                        </div>

                        {/* To */}
                        <div className="flex-[1.2] relative border-r border-gray-100 p-4 hover:bg-blue-50 cursor-pointer" 
                             onClick={() => { setShowToList(!showToList); setShowFromList(false); }}>
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">To</p>
                            <h3 className="text-2xl font-bold text-gray-800">{toSearch.city}</h3>
                            <p className="text-xs text-gray-400 truncate">{toSearch.code}, {toSearch.name}</p>
                            {showToList && <SuggestionList list={AIRPORTS} onSelect={(ap) => { setToSearch(ap); setShowToList(false); }} />}
                        </div>

                        {/* Departure Date */}
                        <div className="flex-1 relative border-r border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setDepOpen(true)}>
                            <div className="p-4">
                                <DateDisplay date={depDate} label="Departure" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-0 h-0 overflow-hidden">
                                <DesktopDatePicker
                                    open={depOpen}
                                    onOpen={() => setDepOpen(true)}
                                    onClose={() => setDepOpen(false)}
                                    value={depDate}
                                    onChange={(newValue) => setDepDate(newValue)}
                                    slotProps={{ textField: { variant: 'standard' } }}
                                />
                            </div>
                        </div>

                        {/* Conditional Return Date */}
                        {isRoundTrip && (
                            <div className="flex-1 relative border-r border-gray-100 hover:bg-blue-50 transition-all cursor-pointer" onClick={() => setRetOpen(true)}>
                                <div className="p-4">
                                    <DateDisplay date={retDate} label="Return" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-0 h-0 overflow-hidden">
                                    <DesktopDatePicker
                                        open={retOpen}
                                        onOpen={() => setRetOpen(true)}
                                        onClose={() => setRetOpen(false)}
                                        value={retDate}
                                        onChange={(newValue) => setRetDate(newValue)}
                                        minDate={depDate || undefined}
                                        slotProps={{ textField: { variant: 'standard' } }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Travellers */}
                        <div className="flex-1 relative p-4 hover:bg-blue-50 cursor-pointer" onClick={() => setPaxOpen(!paxOpen)}>
                            <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Travellers</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalPax} <span className="text-lg font-medium text-gray-600">Pax</span></h3>
                            <p className="text-xs text-gray-500 truncate">{cabinClass}</p>

                            {paxOpen && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 shadow-2xl rounded-xl z-[60] p-5 cursor-default" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <span className="font-bold text-gray-800">Select Travellers</span>
                                        <X size={18} className="text-gray-400 cursor-pointer" onClick={() => setPaxOpen(false)} />
                                    </div>

                                    {[
                                        { key: 'adults', label: 'Adults', sub: '12+ yrs' },
                                        { key: 'children', label: 'Children', sub: '2-12 yrs' },
                                        { key: 'infants', label: 'Infants', sub: 'Below 2 yrs' }
                                    ].map((type) => (
                                        <div key={type.key} className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{type.label}</p>
                                                <p className="text-[10px] text-gray-400">{type.sub}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updatePax(type.key as any, false)} className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><Minus size={14} /></button>
                                                <span className="w-4 text-center font-bold">{(pax as any)[type.key]}</span>
                                                <button onClick={() => updatePax(type.key as any, true)} className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Class</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Economy', 'Premium', 'Business', 'First'].map(cls => (
                                                <button
                                                    key={cls}
                                                    onClick={() => setCabinClass(cls)}
                                                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all ${cabinClass === cls ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    {cls}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={() => setPaxOpen(false)} className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg font-bold text-sm">Apply</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {['Regular'].map(f => (
                                <button key={f} className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-bold bg-white text-gray-600 hover:border-red-400">{f}</button>
                            ))}
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-16 py-3 rounded-full text-xl font-black shadow-lg uppercase tracking-widest transition-transform active:scale-95">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

const SuggestionList = ({ list, onSelect }: { list: any[], onSelect: (ap: any) => void }) => (
    <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
        {list.map((ap) => (
            <div key={ap.code} className="p-3 hover:bg-red-50 cursor-pointer flex items-center gap-3 border-b border-gray-50" 
                 onMouseDown={(e) => { e.preventDefault(); onSelect(ap); }}>
                <MapPin size={16} className="text-gray-400" />
                <div className="flex-1">
                    <div className="flex justify-between font-bold text-gray-800"><span>{ap.city}</span><span className="text-xs text-gray-400">{ap.code}</span></div>
                    <p className="text-[10px] text-gray-500 truncate">{ap.name}</p>
                </div>
            </div>
        ))}
    </div>
);

export default TravelSearch;