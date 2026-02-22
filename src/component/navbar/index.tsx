"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Plane } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="w-full bg-white/10 backdrop-blur-md sticky top-0 z-50">      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold text-gray-900 tracking-wide">
            Flyway
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/flights"
            className="text-gray-700 font-medium hover:text-primary transition"
          >
            Flights
          </Link>
          <Link
            href="/deals"
            className="text-gray-700 font-medium hover:text-primary transition"
          >
            Deals
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 font-medium hover:text-primary transition"
          >
            Contact
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-800" />
          ) : (
            <Menu className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4">
          <Link
            href="/"
            className="block text-gray-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/flights"
            className="block text-gray-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Flights
          </Link>
          <Link
            href="/deals"
            className="block text-gray-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Deals
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <Link
            href="/login"
            className="block text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}