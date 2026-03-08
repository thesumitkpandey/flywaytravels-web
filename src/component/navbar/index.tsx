"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Flights",     href: "/flights" },
  { label: "Deals",       href: "/deals" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Help",        href: "/help" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);

  // Track scroll only on homepage (to switch from transparent → solid)
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

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

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "text-[#DA3A24]"                                    // primary — active page
                      : isSolid
                        ? "text-[#171717]/70 hover:text-[#171717]"          // foreground — on white bg
                        : "text-white/70 hover:text-white"                  // foreground — on hero bg
                  }`}
                >
                  {link.label}

                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#DA3A24]" />
                  )}

                  {/* Hover underline (non-active) */}
                  {!isActive && (
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ${
                      isSolid ? "bg-[#171717]/20" : "bg-white/30"
                    }`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop right actions ── */}
          <div className="hidden md:flex items-center gap-3">

            {/* Sign in — ghost */}
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

            {/* Register — primary filled */}
            <Link
              href="/register"
              className="text-sm font-bold px-6 py-2.5 rounded-xl bg-[#DA3A24] text-white hover:bg-[#c23420] transition-all duration-200 shadow-[0_4px_14px_rgba(218,58,36,0.35)] hover:shadow-[0_4px_20px_rgba(218,58,36,0.5)]"
            >
              Get Started
            </Link>

          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className={`md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors ${
              isSolid ? "hover:bg-black/5" : "hover:bg-white/10"
            }`}
          >
            <span className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
              menuOpen
                ? "rotate-45 translate-y-2 bg-[#171717]"
                : isSolid ? "bg-[#171717]" : "bg-white"
            }`} />
            <span className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
              menuOpen
                ? "opacity-0"
                : isSolid ? "bg-[#171717]" : "bg-white"
            }`} />
            <span className={`w-5 h-0.5 rounded-full transition-all duration-300 ${
              menuOpen
                ? "-rotate-45 -translate-y-2 bg-[#171717]"
                : isSolid ? "bg-[#171717]" : "bg-white"
            }`} />
          </button>

        </div>
      </nav>

      {/* ── Mobile menu drawer ── */}
      <div
        className={`md:hidden fixed inset-x-0 top-[72px] z-40 bg-white border-b border-black/[0.06] shadow-xl transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pt-4 pb-6 flex flex-col gap-1">

          {/* Mobile nav links */}
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#DA3A24]/8 text-[#DA3A24] font-semibold"
                    : "text-[#171717]/70 hover:text-[#171717] hover:bg-black/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-black/[0.06] my-2" />

          {/* Mobile actions */}
          <Link
            href="/login"
            className="px-4 py-3 rounded-xl text-sm font-semibold text-[#171717]/70 hover:text-[#171717] hover:bg-black/[0.04] transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="mt-1 px-4 py-3 rounded-xl text-sm font-bold text-center bg-[#DA3A24] text-white hover:bg-[#c23420] transition-colors shadow-[0_4px_14px_rgba(218,58,36,0.25)]"
          >
            Get Started
          </Link>

        </div>
      </div>
    </>
  );
}