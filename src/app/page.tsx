"use client";

import FlightSearchComponent from "@/component/search";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">

      <Image
        src="/home/hero.jpg"
        alt="Hero Background"
        fill
        priority
        className="object-bottom"
      />

      {/* Dark Overlay (optional but recommended) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Search Box Centered */}
      <div className="relative z-10 w-full px-20 mb-50">
        <FlightSearchComponent />
      </div>
    </div>
  );
};

export default HeroSection;
