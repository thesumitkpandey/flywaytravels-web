"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";


export default function Navbar() {
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  // Track scroll only on homepage (to switch from transparent → solid)
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Whether the bar should appear solid/white right now
  const isSolid = !isHome || scrolled;

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isHome ? "fixed top-0 left-0" : "sticky top-0"
        } ${
          isSolid
            ? "bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-black/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-10 h-[72px] flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Flyway"
              width={190}
              height={55}
              priority
              className="object-contain"
            />
          </Link>

          {/* ── Right actions (same for mobile + desktop) ── */}
          <div className="flex items-center gap-3">

            {/* Sign In */}
            <Link
              href="/login"
              className={`text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-200 ${
                isSolid
                  ? "text-[#171717]/70 hover:text-[#171717]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Sign In
            </Link>

            {/* Sign Up */}
            <Link
              href="/register"
              className="text-sm font-bold px-6 py-2.5 rounded-xl 
              bg-gradient-to-r from-primary to-primary-light 
              text-[color:var(--background)]
              transition-all duration-200
              shadow-[0_4px_14px_rgba(251,191,36,0.35)]
              hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)]"
            >
              Sign Up
            </Link>

          </div>

        </div>
      </nav>
    </>
  );
}