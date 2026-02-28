"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${
        isHome
          ? "absolute top-0 left-0 bg-transparent"
          : "sticky top-0 bg-white shadow-md"
      }`}
    >
      <div className="max-w-360 mx-auto px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Flyway Logo"
            width={190}
            height={55}
            priority
            className="object-contain"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center">
          <Link
            href="/login"
            className="text-primary text-lg font-semibold px-10 py-2 rounded-xl border border-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}