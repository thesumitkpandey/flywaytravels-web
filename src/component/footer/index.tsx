"use client";

import Image from "next/image";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const LINKS = [
  {
    title: "Company",
    items: ["About Us", "Careers", "Press Room", "Partners", "Blog"],
  },
  {
    title: "Support",
    items: ["Help Center", "Contact Us", "Cancellations", "Refund Policy", "Accessibility"],
  },
  {
    title: "Explore",
    items: ["Flight Deals", "Popular Routes", "Travel Guides", "Visa Info", "Travel Insurance"],
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms of Use", "Cookie Policy", "Sitemap"],
  },
];

const SOCIALS = [
  { label: "X",         href: "#", icon: "𝕏" },
  { label: "LinkedIn",  href: "#", icon: "in" },
  { label: "Facebook",  href: "#", icon: "f" },
  { label: "Instagram", href: "#", icon: "◎" },
];

const STATS = [
  { n: "500+",  label: "Destinations" },
  { n: "150+",  label: "Airlines" },
  { n: "2M+",   label: "Travelers" },
  { n: "4.9★",  label: "App Rating" },
];

const PAYMENTS = ["VISA", "MC", "AMEX", "PayPal", "Apple Pay"];

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-white/[0.06]">

      {/* ── Top band: stats + tagline ── */}
      <div className="bg-[#111118] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Brand statement */}
{/* Brand statement */}
<div className="max-w-sm">
  <Link href="/" className="flex items-center mb-4">
    <Image
      src="/logo.png"
      alt="Flyway"
      width={160} // Slightly smaller than navbar for footer balance
      height={45}
      className="object-contain brightness-0 invert" // Optional: force logo to white if it's dark
    />
  </Link>
  <p className="text-white/40 text-sm leading-relaxed">
    Connecting people to the places they love — with the best prices, the fastest booking, and support that never sleeps.
  </p>
</div>

          {/* Divider (desktop) */}
          <div className="hidden md:block w-px h-16 bg-white/[0.08]" />

          {/* Stats row */}
          <div className="flex gap-10">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-amber-400 text-3xl font-bold leading-none">{s.n}</span>
                <span className="text-white/35 text-[10px] tracking-[0.2em] uppercase mt-1.5">{s.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {LINKS.map((col) => (
            <div key={col.title}>
              {/* Column heading */}
              <p className="text-amber-400 text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
                {col.title}
              </p>
              {/* Links */}
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-white/40 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-200 overflow-hidden" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter strip ── */}
      <div className="border-y border-white/[0.06] bg-[#111118]">
        <div className="max-w-7xl mx-auto px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-base mb-1">Get exclusive deals in your inbox</p>
            <p className="text-white/35 text-sm">No spam. Unsubscribe anytime.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 bg-[#16161f] border border-white/[0.08] rounded-xl px-5 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-amber-400/50 transition-colors"
            />
            <button className="bg-gradient-to-r from-amber-400 to-yellow-300 text-[#0a0a0f] px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:brightness-110 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-16 py-7 flex flex-col md:flex-row items-center justify-between gap-5">

        {/* Copyright */}
        <p className="text-white/25 text-xs tracking-wide">
          © 2025 FlyWay Inc. All rights reserved.
        </p>

        {/* Payment icons */}
        <div className="flex items-center gap-2">
          {PAYMENTS.map((p) => (
            <span
              key={p}
              className="border border-white/[0.08] text-white/30 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Socials */}
        <div className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-white/30 hover:text-amber-400 hover:border-amber-400/40 transition-all duration-200 text-sm"
            >
              {s.icon}
            </Link>
          ))}
        </div>

      </div>

    </footer>
  );
}