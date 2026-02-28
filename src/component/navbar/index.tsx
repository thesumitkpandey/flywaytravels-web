"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Flyway Logo"
            width={150}
            height={45}
            priority
            className="object-contain"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          
          <Link
            href="/login"
            className="text-white text-sm font-medium hover:opacity-80 transition-opacity duration-200"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="text-sm font-semibold px-8 py-2.5 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-200"
          >
            Sign Up
          </Link>

        </div>
      </div>
    </nav>
  );
}