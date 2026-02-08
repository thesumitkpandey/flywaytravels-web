"use client";

import { useState } from "react";
import SearchComponent from "./components/SearchFlights";

export default function Home() {
  return (
    <main className="relative min-h-screen">

      {/* Hero background */}
      <section
        className="h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: "url('/home/hero-bg.webp')",
        }}
      />

      {/* Search component overlay */}
      <div className="absolute top-[45vh] left-1/2 -translate-x-1/2 w-full px-4">
        <SearchComponent  />
      </div>

    </main>
  );
}
