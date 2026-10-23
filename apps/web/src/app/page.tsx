"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Search,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Zap,
  Utensils,
  Wind,
  Sparkles,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"pg" | "roommate">("pg");
  const [locality, setLocality] = useState("");
  const [budget, setBudget] = useState("₹8,000 - ₹12,000");
  const [moveDate, setMoveDate] = useState("Next 7 Days");

  // Roommate filter states
  const [roommateLocality, setRoommateLocality] = useState("");
  const [diet, setDiet] = useState("Any Diet");
  const [schedule, setSchedule] = useState("Any Schedule");

  const popularAreas = [
    { name: "Sector 22", count: "48 PGs", href: "/pgs?area=Sector%2022" },
    { name: "Cyber City", count: "64 PGs", href: "/pgs?area=Cyber%20City" },
    { name: "Udyog Vihar", count: "52 PGs", href: "/pgs?area=Udyog%20Vihar" },
    { name: "DLF Phase 3", count: "73 PGs", href: "/pgs?area=DLF%20Phase%203" },
    { name: "Golf Course Rd", count: "39 PGs", href: "/pgs?area=Golf%20Course%20Road" },
  ];

  const featuredPGs = [
    {
      id: "pg-1",
      name: "Stanza Living — Cyber Hub Haven",
      area: "Cyber City, DLF Phase 2",
      price: "₹11,500",
      sharing: "Twin Sharing",
      gender: "Unisex",
      verified: true,
      rating: 4.8,
      reviewsCount: 34,
      amenities: ["High-speed WiFi", "3 Meals/Day", "Power Backup", "AC"],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "pg-2",
      name: "Urban Nest Luxury Men's PG",
      area: "Sector 22 (Near Maruti Gate 2)",
      price: "₹8,500",
      sharing: "Triple / Twin Sharing",
      gender: "Male Only",
      verified: true,
      rating: 4.6,
      reviewsCount: 22,
      amenities: ["High-speed WiFi", "Attached Washroom", "Power Backup"],
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "pg-3",
      name: "Zolo Serene — Premium Co-Living",
      area: "Udyog Vihar Phase 4",
      price: "₹13,200",
      sharing: "Single / Twin Sharing",
      gender: "Female Only",
      verified: true,
      rating: 4.9,
      reviewsCount: 47,
      amenities: ["WiFi", "Cook + Maid", "24/7 Security", "Gym Access"],
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const roommateMatches = [
    {
      id: "rm-1",
      name: "Aman Sharma",
      age: 24,
      role: "Software Engineer @ Cyber City",
      matchScore: 95,
      budget: "₹10,000 - ₹14,000/mo",
      targetArea: "Cyber City / DLF Phase 3",
      habits: ["Non-smoker", "Vegetarian", "Early Bird (7 AM)"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "rm-2",
      name: "Pooja Verma",
      age: 25,
      role: "Product Designer @ Udyog Vihar",
      matchScore: 91,
      budget: "₹12,000 - ₹16,000/mo",
      targetArea: "Sector 22 / Cyber Hub",
      habits: ["Non-smoker", "Tea Enthusiast", "Quiet after 11 PM"],
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <main className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 bg-gradient-to-b from-primary-fixed/20 via-surface to-surface overflow-hidden">
        {/* Glow circles */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-80 h-80 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Gurgaon&apos;s Roommate &amp; PG Matchmaker
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-tight">
            Find your space.{" "}
            <span className="text-primary block sm:inline">Find your people.</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Discover verified PGs that fit your budget and connect with compatible roommates in Gurgaon without broker fees.
          </p>

          {/* Search Card Box */}
          <div className="w-full max-w-2xl bg-pure-white rounded-2xl shadow-xl border border-border-subtle p-4 sm:p-6 text-left">
            {/* Tab switchers */}
            <div className="grid grid-cols-2 p-1.5 bg-surface-muted rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("pg")}
                className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "pg"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Find PG</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("roommate")}
                className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === "roommate"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Find Roommates</span>
              </button>
            </div>

            {/* Form Find PG */}
            {activeTab === "pg" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/pgs?area=${encodeURIComponent(locality || "Sector 22")}`;
                }}
                className="flex flex-col gap-3"
              >
                <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Locality / Tech Park
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Sector 22, Cyber City, Udyog Vihar..."
                      className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Max Budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option>Up to ₹8,000</option>
                      <option>₹8,000 - ₹12,000</option>
                      <option>₹12,000 - ₹18,000</option>
                      <option>₹18,000+</option>
                    </select>
                  </div>
                  <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Move-in Date
                    </label>
                    <select
                      value={moveDate}
                      onChange={(e) => setMoveDate(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option>Immediately</option>
                      <option>Next 7 Days</option>
                      <option>This Month</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Verified PGs</span>
                </button>
              </form>
            ) : (
              /* Form Find Roommates */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/roommates?area=${encodeURIComponent(roommateLocality || "Cyber City")}`;
                }}
                className="flex flex-col gap-3"
              >
                <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Target Area
                    </label>
                    <input
                      type="text"
                      value={roommateLocality}
                      onChange={(e) => setRoommateLocality(e.target.value)}
                      placeholder="e.g. DLF Phase 3, Cyber City..."
                      className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Diet Preference
                    </label>
                    <select
                      value={diet}
                      onChange={(e) => setDiet(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option>Any Diet</option>
                      <option>Pure Vegetarian</option>
                      <option>Non-Vegetarian OK</option>
                    </select>
                  </div>
                  <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                      Daily Routine
                    </label>
                    <select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-on-surface focus:outline-none cursor-pointer mt-0.5"
                    >
                      <option>Any Schedule</option>
                      <option>Early Bird (Morning)</option>
                      <option>Night Owl (Evening shifts)</option>
                      <option>Regular 9-to-6</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Find Compatible Roommates</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Locality Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <span className="text-xs text-on-surface-variant font-medium">
              Popular areas:
            </span>
            {popularAreas.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                className="px-3 py-1 rounded-full bg-pure-white hover:bg-surface-muted text-xs font-medium text-on-surface border border-border-subtle shadow-2xs hover:border-primary transition-all flex items-center gap-1.5"
              >
                <span>{area.name}</span>
                <span className="text-[10px] text-on-surface-variant bg-surface-muted px-1.5 py-0.2 rounded-full">
                  {area.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Value Props / Trust Indicators */}
      <section className="border-y border-border-subtle bg-pure-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">100% Zero Brokerage</h4>
                <p className="text-xs text-on-surface-variant">Connect directly with owners &amp; verified flatmates</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">AI Roommate Scoring</h4>
                <p className="text-xs text-on-surface-variant">Deterministic match based on budget, routine, and lifestyle</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Physically Verified PGs</h4>
                <p className="text-xs text-on-surface-variant">Real photographs, transparent pricing, verified facilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Verified PGs */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              Gurgaon Hotspots
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-on-surface">
              Featured Verified PGs
            </h2>
          </div>
          <Link
            href="/pgs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container transition-colors"
          >
            <span>View All PGs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPGs.map((pg) => (
            <div
              key={pg.id}
              className="bg-pure-white rounded-2xl border border-border-subtle shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
                <img
                  src={pg.image}
                  alt={pg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold shadow-xs">
                    VERIFIED
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-pure-white/90 backdrop-blur-xs text-on-surface text-[10px] font-bold shadow-xs">
                    {pg.gender}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-pure-white/90 backdrop-blur-xs text-xs font-bold text-on-surface shadow-xs">
                  ⭐ {pg.rating} ({pg.reviewsCount})
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {pg.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-3">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    <span>{pg.area}</span>
                  </div>

                  {/* Amenities tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {pg.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-0.5 rounded-md bg-surface-subtle text-[11px] text-on-surface-variant font-medium border border-border-subtle"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-primary">{pg.price}</span>
                    <span className="text-xs text-on-surface-variant">/mo</span>
                    <p className="text-[11px] text-on-surface-variant">{pg.sharing}</p>
                  </div>
                  <Link
                    href={`/pgs/${pg.id}`}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs hover:shadow-sm transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Roommate Match Spotlight */}
      <section className="py-14 bg-surface-subtle border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                Compatibility Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-on-surface">
                Compatible Roommate Matches
              </h2>
            </div>
            <Link
              href="/roommates"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary/80 transition-colors"
            >
              <span>Explore All Roommates</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roommateMatches.map((match) => (
              <div
                key={match.id}
                className="bg-pure-white rounded-2xl border border-border-subtle p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
              >
                <div className="relative shrink-0">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-border-subtle"
                  />
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-black shadow-xs">
                    {match.matchScore}% Match
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">
                      {match.name}, <span className="text-sm font-medium text-on-surface-variant">{match.age}</span>
                    </h3>
                    <p className="text-xs text-primary font-semibold mb-2">
                      {match.role}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-2">
                      <MapPin className="w-3.5 h-3.5 text-outline" />
                      <span>{match.targetArea}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {match.habits.map((h) => (
                        <span
                          key={h}
                          className="px-2 py-0.5 rounded-md bg-surface-muted text-[11px] font-medium text-on-surface-variant"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                    <div>
                      <span className="text-xs text-on-surface-variant">Budget:</span>{" "}
                      <span className="text-xs font-bold text-on-surface">{match.budget}</span>
                    </div>
                    <Link
                      href={`/roommates/${match.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary text-xs font-bold transition-all"
                    >
                      Connect
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Owner Call To Action */}
      <section className="bg-primary text-on-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-extrabold tracking-widest text-primary-fixed uppercase">
              For Property Owners in Gurgaon
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              List Your PG &amp; Reach 10,000+ Verified Tenants
            </h3>
            <p className="text-sm text-primary-fixed leading-relaxed">
              Zero commission, verified student &amp; corporate tenant inquiries, complete control over your property listing.
            </p>
          </div>
          <Link
            href="/list-your-pg"
            className="px-6 py-3.5 rounded-full bg-pure-white text-primary hover:bg-primary-fixed font-bold text-sm shadow-lg hover:shadow-xl transition-all shrink-0"
          >
            List Property for Free
          </Link>
        </div>
      </section>
    </main>
  );
}
