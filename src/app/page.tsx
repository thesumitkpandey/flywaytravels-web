"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FlightSearchComponent from "@/component/search";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    src: "/home/bali.jpg",
    city: "Bali",
    country: "Indonesia",
    tag: "Top Destination",
    tagline: "Island of temples, sunsets, and endless paradise"
  }, { src: "/home/japan.jpg", city: "Kyoto", country: "Japan", tag: "Seasonal Pick", tagline: "Cherry blossoms await" },
{ 
  src: "/home/dubai.jpg",
  city: "Dubai",
  country: "United Arab Emirates",
  tag: "Luxury City",
  tagline: "Where futuristic skylines meet desert adventures"
}];

const DESTINATIONS = [
  { city: "Paris", country: "France", price: "$320", img: "/home/paris.jpg", temp: "18°C", tag: "Romance", color: "from-rose-100 to-pink-50" },
  { city: "Moscow", country: "Russia", price: "$540", img: "/home/russia.jpg", temp: "29°C", tag: "Beach", color: "from-cyan-100 to-sky-50" },
  { city: "New York", country: "USA", price: "$410", img: "/home/new-york.jpg", temp: "15°C", tag: "City Break", color: "from-slate-100 to-gray-50" },
  { city: "Dubai", country: "UAE", price: "$480", img: "/home/dubai.jpg", temp: "34°C", tag: "Luxury", color: "from-amber-100 to-yellow-50" },
  { city: "Uttar Pradesh", country: "India", price: "$620", img: "/home/india.jpg", temp: "22°C", tag: "Culture", color: "from-purple-100 to-violet-50" },
  { city: "Cape Town", country: "S. Africa", price: "$580", img: "/home/cape-town.jpg", temp: "20°C", tag: "Adventure", color: "from-orange-100 to-amber-50" },
];

const DEALS = [
  { from: "JFK", fromCity: "New York", to: "LHR", toCity: "London", airline: "British Airways", price: "$299", oldPrice: "$520", date: "Dec 15 – Dec 22", seats: 4, duration: "7h 10m" },
  { from: "LAX", fromCity: "Los Angeles", to: "NRT", toCity: "Tokyo", airline: "ANA", price: "$480", oldPrice: "$760", date: "Jan 5 – Jan 14", seats: 9, duration: "11h 45m" },
  { from: "ORD", fromCity: "Chicago", to: "CDG", toCity: "Paris", airline: "Air France", price: "$340", oldPrice: "$590", date: "Feb 1 – Feb 8", seats: 2, duration: "9h 05m" },
];

const FEATURES = [
  { icon: "💸", title: "Best Price Guarantee", desc: "We match any lower fare you find within 24 hours of booking.", accent: "bg-amber-50 border-amber-100" },
  { icon: "⚡", title: "Instant Booking", desc: "Confirm your seat in under 60 seconds with our streamlined checkout.", accent: "bg-sky-50 border-sky-100" },
  { icon: "🔄", title: "Free Rebooking", desc: "Modify your flight up to 48 hours before departure at no cost.", accent: "bg-emerald-50 border-emerald-100" },
  { icon: "🛡️", title: "Travel Protection", desc: "Built-in cancellation cover and 24/7 emergency assistance.", accent: "bg-purple-50 border-purple-100" },
];

const TESTIMONIALS = [
  { name: "Sophia Larkin", role: "Travel Blogger", text: "Found a deal 40% cheaper than anywhere else. I was on my flight to Rome within minutes of deciding!", initials: "SL", color: "bg-rose-500" },
  { name: "Marcus Tan", role: "Business Traveler", text: "The interface is lightning-fast and the filters actually work. My go-to for every business trip.", initials: "MT", color: "bg-sky-500" },
  { name: "Priya Nair", role: "Frequent Flyer", text: "Customer support responded in under 2 minutes when I needed to reschedule. Absolutely world class.", initials: "PN", color: "bg-violet-500" },
];

const AIRLINES = ["Emirates", "Singapore Air", "Qatar Airways", "Lufthansa", "ANA", "Cathay Pacific", "Delta", "Air France"];

const STATS = [
  { n: "500+", label: "Destinations" },
  { n: "2M+", label: "Happy Travelers" },
  { n: "150+", label: "Partner Airlines" },
  { n: "4.9★", label: "App Rating" },
];

// ─── DestinationCard ──────────────────────────────────────────────────────────

function DestinationCard({ d }: { d: typeof DESTINATIONS[0] }) {
  return (
    <div className="group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-500">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={d.img}
          alt={d.city}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
          {d.tag}
        </span>
        <span className="absolute top-3 right-3 bg-amber-400 text-[#0a0a0f] text-xs font-black px-3 py-1.5 rounded-full">
          {d.temp}
        </span>
        <div className="absolute bottom-4 left-5">
          <p className="text-white font-black text-xl leading-none">{d.city}</p>
          <p className="text-white/70 text-xs mt-0.5 tracking-wide">{d.country}</p>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span>✈</span>
          <span>Round trips available</span>
        </div>
        <div className="text-right">
          <span className="block text-[10px] text-gray-400 uppercase tracking-widest">from</span>
          <span className="text-gray-900 font-black text-xl">{d.price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── DealCard ─────────────────────────────────────────────────────────────────

function DealCard({ d }: { d: typeof DEALS[0] }) {
  const savings = Math.round(
    (1 - parseInt(d.price.replace("$", "")) / parseInt(d.oldPrice.replace("$", ""))) * 100
  );
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-400 cursor-pointer">
      {/* Route visual */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center">
          <p className="text-3xl font-black text-gray-900 leading-none">{d.from}</p>
          <p className="text-gray-400 text-[10px] mt-1 tracking-wide">{d.fromCity}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5 px-2">
          <div className="flex items-center w-full gap-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-amber-400 text-base group-hover:translate-x-1 transition-transform duration-300">✈</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <span className="text-gray-400 text-[10px] tracking-widest">{d.duration}</span>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-gray-900 leading-none">{d.to}</p>
          <p className="text-gray-400 text-[10px] mt-1 tracking-wide">{d.toCity}</p>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">{d.airline}</span>
        <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">{d.date}</span>
        {d.seats <= 4 && (
          <span className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full font-semibold">
            🔥 {d.seats} seats left
          </span>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{d.price}</span>
            <span className="text-gray-300 text-sm line-through">{d.oldPrice}</span>
          </div>
          <span className="inline-block mt-1 bg-amber-400 text-[#0a0a0f] text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">
            SAVE {savings}%
          </span>
        </div>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-amber-200">
          Book Now →
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % SLIDES.length);
        setFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function goToSlide(i: number) {
    if (i === slide) return;
    setFading(true);
    setTimeout(() => { setSlide(i); setFading(false); }, 400);
  }

  const current = SLIDES[slide];

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 26s linear infinite; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.5s ease-out forwards; }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">

        {/* Slide background */}
        <div className={`absolute inset-0 transition-opacity duration-[400ms] ${fading ? "opacity-0" : "opacity-100"}`}>
          <Image src={current.src} alt={current.city} fill priority className="object-cover object-center" />
        </div>

        {/* Warm gradient overlay — not too dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Slide content */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 px-6 md:px-16 pb-10 transition-all duration-[400ms] ${fading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

          {/* Tag */}
          <span className="inline-block bg-amber-400 text-[#0a0a0f] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-4">
            {current.tag}
          </span>

          {/* City name — editorial large */}
          <h1 className="font-display text-[clamp(56px,10vw,130px)] font-black leading-none tracking-tight text-white mb-1">
            {current.city}
          </h1>
          <p className="text-white/60 text-sm tracking-[0.35em] uppercase mb-8">{current.country} — {current.tagline}</p>

          {/* Slide dots */}
          <div className="flex gap-2 mb-8">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${i === slide ? "w-10 bg-amber-400" : "w-5 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>

          {/* Search component */}
          <FlightSearchComponent />
        </div>

        {/* Scroll hint */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-2 hidden lg:flex">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <span className="text-white/30 text-[9px] tracking-[0.25em] uppercase [writing-mode:vertical-rl]">scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center divide-x divide-white/[0.08]">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-10 md:px-16 py-7">
              <span className="font-display text-3xl font-black text-amber-400 leading-none">{s.n}</span>
              <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Popular Destinations ── */}
      <section className="bg-gray-50 py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase mb-3">Explore the World</p>
              <h2 className="font-display text-5xl md:text-6xl font-black text-gray-900 leading-none">
                Popular<br />Destinations
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-gray-400 text-sm max-w-xs text-right">Hand-picked by our travel experts — curated for every kind of traveler</p>
              <button className="border border-gray-900 text-gray-900 px-7 py-2.5 rounded-full text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-300">
                View All →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((d) => <DestinationCard key={d.city} d={d} />)}
          </div>
        </div>
      </section>

      {/* ── Hot Deals ── */}
      <section className="py-20 md:py-28 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase mb-3">Limited Time Offers</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-gray-900 leading-none mb-3">
              Hot Flight Deals
            </h2>
            <p className="text-gray-400 text-base">Prices drop fast — grab yours before they&apos;re gone</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEALS.map((d) => <DealCard key={d.to} d={d} />)}
          </div>
        </div>
      </section>

      {/* ── Why Flyway ── */}
      <section className="bg-gray-50 py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <p className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase mb-4">Why Flyway</p>
              <h2 className="font-display text-5xl md:text-6xl font-black text-gray-900 leading-none mb-6">
                Travel Smarter,<br />Every Time
              </h2>
              <p className="text-gray-500 text-base leading-relaxed max-w-md">
                From booking to boarding, Flyway is designed around one thing — making your travel experience effortless and affordable.
              </p>
            </div>
            {/* Right: feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className={`${f.accent} border rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300`}>
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-gray-900 font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Airline Marquee ── */}
      <div className="border-y border-gray-100 bg-white py-7 overflow-hidden">
        <p className="text-center text-gray-300 text-[10px] tracking-[0.35em] uppercase mb-5 font-bold">
          Partnered with the world&apos;s finest airlines
        </p>
        <div className="flex animate-marquee w-max">
          {[...AIRLINES, ...AIRLINES].map((airline, i) => (
            <span key={i} className="px-12 text-gray-200 text-base font-black tracking-[0.2em] uppercase whitespace-nowrap">
              {airline}
            </span>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <section className="bg-white py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase mb-3">Real People, Real Reviews</p>
            <h2 className="font-display text-5xl md:text-6xl font-black text-gray-900 leading-none">
              Travelers Love Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300">
                <div className="text-amber-400 text-base tracking-[0.2em] mb-5">★★★★★</div>
                <p className="text-gray-600 text-base leading-relaxed mb-7 font-display italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Banner ── */}
      <section className="bg-gray-50 px-6 md:px-16 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-3xl overflow-hidden relative">
            {/* Decorative amber glow */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-8 md:px-16 py-14 md:py-20">
              <div className="flex-1">
                <span className="inline-block bg-amber-400 text-[#0a0a0f] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-6">
                  Mobile App
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                  Your Journey,<br />In Your Pocket
                </h2>
                <p className="text-white/50 text-base leading-relaxed max-w-sm mb-9">
                  Manage bookings, get live gate alerts, and check in — all from the Flyway app.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button className="flex items-center gap-2.5 bg-white text-gray-900 px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-black/20">
                    <span className="text-base">🍎</span> App Store
                  </button>
                  <button className="flex items-center gap-2.5 bg-white/[0.07] border border-white/10 text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-white/15 transition-all duration-300">
                    <span className="text-base">▶</span> Google Play
                  </button>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="flex-shrink-0">
                <div className="w-52 h-[360px] bg-[#0d0d18] border border-white/[0.08] rounded-[40px] p-5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-400/10 to-transparent" />
                  <div className="h-full flex flex-col justify-between py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white/40 text-[9px] tracking-widest uppercase">My Trips</div>
                      <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[#0a0a0f] text-[8px] font-black">2</div>
                    </div>

                    <div className="bg-white/[0.05] border border-white/[0.07] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-black text-white">JFK</span>
                        <span className="text-amber-400 text-xs">✈</span>
                        <span className="text-xl font-black text-white">CDG</span>
                      </div>
                      <p className="text-white/30 text-[9px] tracking-wide mb-3">Dec 15 · 2 PAX · Business</p>
                      <div className="h-px bg-white/[0.06] mb-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-amber-400">$1,240</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400 text-[9px] font-bold">Confirmed</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
                      <span className="text-amber-400 text-sm">🔔</span>
                      <div>
                        <p className="text-white text-[9px] font-bold">Gate B14 Open</p>
                        <p className="text-white/30 text-[8px]">Boarding in 35 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}