"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Wifi,
  ShieldCheck,
  Star,
  Map as MapIcon,
  LayoutGrid,
  Check,
  Heart,
} from "lucide-react";

interface PGItem {
  id: string;
  name: string;
  area: string;
  price: number;
  gender: "Unisex" | "Male" | "Female";
  sharing: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  amenities: string[];
  image: string;
  distanceToMetro: string;
}

const ALL_PGS: PGItem[] = [
  {
    id: "pg-cyber-hub-1",
    name: "Stanza Living — Cyber Hub Haven",
    area: "Cyber City, DLF Phase 2",
    price: 11500,
    gender: "Unisex",
    sharing: ["Twin", "Single"],
    rating: 4.8,
    reviewsCount: 38,
    verified: true,
    amenities: ["WiFi", "Power Backup", "Food Included", "AC", "Laundry"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "350m from Sikanderpur Metro",
  },
  {
    id: "pg-sector-22-1",
    name: "Urban Nest Luxury Men's PG",
    area: "Sector 22 (Near Maruti Gate 2)",
    price: 8500,
    gender: "Male",
    sharing: ["Twin", "Triple"],
    rating: 4.6,
    reviewsCount: 22,
    verified: true,
    amenities: ["WiFi", "Power Backup", "Food Included", "Attached Washroom"],
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "1.2 km from IndusInd Metro",
  },
  {
    id: "pg-udyog-vihar-1",
    name: "Zolo Serene — Premium Co-Living",
    area: "Udyog Vihar Phase 4",
    price: 13200,
    gender: "Female",
    sharing: ["Single", "Twin"],
    rating: 4.9,
    reviewsCount: 47,
    verified: true,
    amenities: ["WiFi", "AC", "Food Included", "Gym", "24/7 Security"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "800m from Micromax Moulsari Ave",
  },
  {
    id: "pg-dlf-phase-3-1",
    name: "Housr Coliving DLF Phase 3",
    area: "DLF Phase 3, Pink Town House",
    price: 16000,
    gender: "Unisex",
    sharing: ["Single", "Twin Studio"],
    rating: 4.9,
    reviewsCount: 61,
    verified: true,
    amenities: ["WiFi", "Housekeeping", "AC", "Power Backup", "Gaming Zone"],
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "200m from Phase 3 Rapid Metro",
  },
  {
    id: "pg-sector-22-2",
    name: "Shree Krishna Boys Residency",
    area: "Sector 22B",
    price: 7500,
    gender: "Male",
    sharing: ["Twin", "Triple", "Four Sharing"],
    rating: 4.4,
    reviewsCount: 19,
    verified: true,
    amenities: ["WiFi", "North/South Indian Meals", "RO Water"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "Near Palam Vihar Rd",
  },
  {
    id: "pg-golf-course-1",
    name: "Olive Suites Golf Course Road",
    area: "Sector 42-43 Metro",
    price: 17500,
    gender: "Unisex",
    sharing: ["Single Private Room"],
    rating: 4.7,
    reviewsCount: 33,
    verified: true,
    amenities: ["WiFi", "AC", "Kitchenette", "Power Backup", "Balcony"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "100m from Sector 42-43 Metro",
  },
];

export default function PGsPage() {
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [maxBudget, setMaxBudget] = useState<number>(20000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pgconnect_saved_pgs");
        if (stored) {
          const list = JSON.parse(stored);
          return list.map((p: { id: string }) => p.id);
        }
      } catch {
        // fallback
      }
    }
    return ["pg-cyber-hub-1", "pg-udyog-vihar-1"];
  });

  const toggleSavePG = (pg: PGItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedIds.includes(pg.id);
    const nextSavedIds = isSaved ? savedIds.filter((id) => id !== pg.id) : [...savedIds, pg.id];
    setSavedIds(nextSavedIds);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pgconnect_saved_pgs");
        let list = stored ? JSON.parse(stored) : [];
        if (!isSaved) {
          if (!list.some((p: { id: string }) => p.id === pg.id)) {
            list.push({
              id: pg.id,
              name: pg.name,
              area: pg.area,
              price: pg.price,
              gender: pg.gender,
              sharing: pg.sharing,
              rating: pg.rating,
              image: pg.image,
              distanceToMetro: pg.distanceToMetro,
              phone: "+91 98112 23344",
            });
          }
        } else {
          list = list.filter((p: { id: string }) => p.id !== pg.id);
        }
        localStorage.setItem("pgconnect_saved_pgs", JSON.stringify(list));
      } catch {
        // fallback
      }
    }
  };

  const filteredPGs = ALL_PGS.filter((pg) => {
    if (selectedArea !== "All" && !pg.area.toLowerCase().includes(selectedArea.toLowerCase())) {
      return false;
    }
    if (selectedGender !== "All" && pg.gender !== selectedGender) {
      return false;
    }
    if (pg.price > maxBudget) {
      return false;
    }
    if (
      searchQuery &&
      !pg.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !pg.area.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Gurgaon PGs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">
            Explore PGs in Gurgaon
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Showing {filteredPGs.length} verified zero-brokerage properties
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-surface-muted p-1 rounded-xl border border-border-subtle">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-pure-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "map"
                ? "bg-pure-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-pure-white p-4 rounded-2xl border border-border-subtle shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search by PG name, landmark, or tech park..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Locality Dropdown */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Localities</option>
            <option value="Sector 22">Sector 22</option>
            <option value="Cyber City">Cyber City</option>
            <option value="Udyog Vihar">Udyog Vihar</option>
            <option value="DLF Phase 3">DLF Phase 3</option>
            <option value="Golf Course">Golf Course Rd</option>
          </select>

          {/* Gender Dropdown */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Unisex">Unisex / Co-ed</option>
            <option value="Male">Boys Only</option>
            <option value="Female">Girls Only</option>
          </select>

          {/* Budget Filter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle">
            <span className="text-xs font-semibold text-on-surface-variant">Max:</span>
            <input
              type="range"
              min="6000"
              max="20000"
              step="1000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-24 accent-primary cursor-pointer"
            />
            <span className="text-xs font-bold text-primary">₹{maxBudget.toLocaleString()}</span>
          </div>

          {(selectedArea !== "All" || selectedGender !== "All" || maxBudget < 20000 || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedArea("All");
                setSelectedGender("All");
                setMaxBudget(20000);
                setSearchQuery("");
              }}
              className="text-xs text-accent-rose font-bold px-2 py-1 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Grid vs Map */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPGs.map((pg) => (
            <div
              key={pg.id}
              className="bg-pure-white rounded-2xl border border-border-subtle shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
                <img
                  src={pg.image}
                  alt={pg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {pg.verified && (
                    <span className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold shadow-xs">
                      VERIFIED
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-pure-white/95 backdrop-blur-xs text-on-surface text-[10px] font-bold shadow-xs">
                    {pg.gender}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-pure-white/95 text-xs font-bold text-on-surface shadow-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{pg.rating}</span>
                  <span className="text-[10px] text-on-surface-variant">({pg.reviewsCount})</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {pg.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span className="truncate">{pg.area}</span>
                  </div>
                  <p className="text-[11px] text-secondary font-medium mb-3">
                    🚇 {pg.distanceToMetro}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {pg.amenities.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-md bg-surface-subtle text-[11px] text-on-surface-variant font-medium border border-border-subtle"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-primary">₹{pg.price.toLocaleString()}</span>
                    <span className="text-xs text-on-surface-variant">/mo</span>
                    <p className="text-[10px] text-on-surface-variant">{pg.sharing.join(" · ")}</p>
                  </div>
                  <Link
                    href={`/pgs/${pg.id}`}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {filteredPGs.length === 0 && (
            <div className="col-span-full py-16 text-center bg-pure-white rounded-2xl border border-border-subtle">
              <Building2 className="w-12 h-12 text-outline mx-auto mb-3" />
              <h3 className="text-base font-bold text-on-surface">No PGs found matching your filters</h3>
              <p className="text-xs text-on-surface-variant mt-1">Try expanding your max budget or resetting locality filters</p>
            </div>
          )}
        </div>
      ) : (
        /* Map View */
        <div className="bg-pure-white rounded-2xl border border-border-subtle p-4 shadow-xs">
          <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-surface-muted flex flex-col items-center justify-center border border-border-subtle">
            <div className="absolute inset-0 bg-[radial-gradient(#c2c1ff_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md bg-pure-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-border-subtle">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-on-surface">Interactive Gurgaon Map</h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-4 leading-relaxed">
                Pinpointing {filteredPGs.length} verified listings across Sector 22, Cyber City, Udyog Vihar, and DLF Phase 3.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {filteredPGs.slice(0, 4).map((p) => (
                  <span
                    key={p.id}
                    className="px-2.5 py-1 rounded-full bg-surface-container text-primary text-[11px] font-bold"
                  >
                    📍 {p.area.split(",")[0]}: ₹{p.price.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
