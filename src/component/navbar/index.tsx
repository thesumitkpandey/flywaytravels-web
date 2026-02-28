"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
<div className="max-w-360 mx-auto px-10 py-6 flex items-center justify-between">        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Flyway Logo"
            width={190}   // bigger logo
            height={55}
            priority
            className="object-contain"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center">
          {/* <Link
            href="/login"
            className="text-primary text-lg font-semibold px-10 py-2 rounded-xl border border-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            Login
          </Link> */}
        </div>

      </div>
    </nav>
  );
}