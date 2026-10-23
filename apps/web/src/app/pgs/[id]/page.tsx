"use client";

import { Suspense, use, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Zap,
  Utensils,
  Wind,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  Share2,
  Heart,
  ChevronLeft,
  Building2,
  ArrowRight,
} from "lucide-react";

export default function PGDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-on-surface-variant">
          Loading PG details...
        </div>
      }
    >
      <PGDetailContent params={params} />
    </Suspense>
  );
}

function PGDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [saved, setSaved] = useState(false);
  const [visitBooked, setVisitBooked] = useState(false);
  const [selectedSharing, setSelectedSharing] = useState<"twin" | "single" | "triple">("twin");

  // PG Details
  const pg = {
    id: id || "pg-cyber-hub-1",
    name: "Stanza Living — Cyber Hub Haven",
    area: "Cyber City, DLF Phase 2, Gurgaon",
    fullAddress: "Plot No. 42, Block C, DLF Phase 2, Near Cyber Hub, Gurgaon 122002",
    verified: true,
    rating: 4.8,
    reviewsCount: 38,
    gender: "Unisex Co-Living",
    deposit: "1 Month Security Deposit",
    noticePeriod: "30 Days Notice",
    gateTiming: "No Curfew (Biometric Access 24/7)",
    metroDistance: "350m from Sikanderpur Metro Station (Yellow Line & Rapid Metro)",
    pricing: {
      single: { rent: 18500, label: "Single Private Room" },
      twin: { rent: 11500, label: "Twin Sharing (Popular)" },
      triple: { rent: 8500, label: "Triple Sharing" },
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: [
      { name: "3 Home-Style Meals/Day", icon: Utensils, desc: "Breakfast, Lunch, Dinner included (North & South Indian menu)" },
      { name: "High-Speed WiFi (300 Mbps)", icon: Wifi, desc: "Dedicated router per floor with power backup" },
      { name: "100% Power Backup", icon: Zap, desc: "Silent automatic DG set covering AC & appliances" },
      { name: "Split Air Conditioning", icon: Wind, desc: "In all bedrooms and common study lounge" },
      { name: "Daily Professional Housekeeping", icon: CheckCircle, desc: "Room cleaning and daily trash collection" },
      { name: "Biometric & 24/7 CCTV", icon: ShieldCheck, desc: "Multi-tier security with verified security guard" },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/pgs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Gurgaon PGs</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl border border-border-subtle hover:bg-surface-muted transition-colors ${
              saved ? "text-accent-rose" : "text-on-surface-variant"
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-accent-rose" : ""}`} />
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden mb-8">
        <div className="md:col-span-2 h-72 sm:h-96 bg-surface-muted overflow-hidden">
          <img
            src={pg.images[0]}
            alt={pg.name}
            className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
          />
        </div>
        <div className="hidden md:flex flex-col gap-3 h-96">
          <div className="h-1/2 bg-surface-muted overflow-hidden rounded-xl">
            <img src={pg.images[1]} alt="Interior" className="w-full h-full object-cover" />
          </div>
          <div className="h-1/2 bg-surface-muted overflow-hidden rounded-xl">
            <img src={pg.images[2]} alt="Lounge" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Main Grid: Info + Sticky Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-bold">
                VERIFIED PROPERTY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-bold">
                {pg.gender}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-on-surface ml-auto">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{pg.rating}</span>
                <span className="text-on-surface-variant font-normal">({pg.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-on-surface mb-2">
              {pg.name}
            </h1>

            <div className="flex items-start gap-2 text-xs sm:text-sm text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{pg.fullAddress}</span>
            </div>
            <p className="text-xs text-secondary font-semibold mt-1.5">
              🚇 {pg.metroDistance}
            </p>
          </div>

          {/* Sharing Options */}
          <div className="bg-pure-white p-5 rounded-2xl border border-border-subtle shadow-xs">
            <h3 className="text-sm font-bold text-on-surface mb-3">Choose Sharing Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["twin", "single", "triple"] as const).map((key) => {
                const opt = pg.pricing[key];
                const isSelected = selectedSharing === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedSharing(key)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-fixed/20 ring-1 ring-primary"
                        : "border-border-subtle hover:bg-surface-subtle"
                    }`}
                  >
                    <span className="block text-xs font-medium text-on-surface-variant">{opt.label}</span>
                    <span className="text-base font-black text-primary mt-1 block">
                      ₹{opt.rent.toLocaleString()}<span className="text-xs text-on-surface-variant font-normal">/mo</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Amenities */}
          <div className="bg-pure-white p-6 rounded-2xl border border-border-subtle shadow-xs">
            <h3 className="text-base font-black text-on-surface mb-4">
              Included Amenities &amp; Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pg.amenities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{item.name}</h4>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* House Rules & Terms */}
          <div className="bg-pure-white p-6 rounded-2xl border border-border-subtle shadow-xs">
            <h3 className="text-base font-black text-on-surface mb-4">
              House Rules &amp; Move-in Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-on-surface-variant font-medium block">Security Deposit</span>
                <span className="font-bold text-on-surface mt-0.5 block">{pg.deposit}</span>
              </div>
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-on-surface-variant font-medium block">Notice Period</span>
                <span className="font-bold text-on-surface mt-0.5 block">{pg.noticePeriod}</span>
              </div>
              <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle">
                <span className="text-on-surface-variant font-medium block">Gate Timing</span>
                <span className="font-bold text-on-surface mt-0.5 block">{pg.gateTiming}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking / Owner Contact */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-pure-white p-6 rounded-2xl border border-border-subtle shadow-lg flex flex-col gap-5">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">Starting from</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-primary">
                  ₹{pg.pricing[selectedSharing].rent.toLocaleString()}
                </span>
                <span className="text-xs text-on-surface-variant">/ month</span>
              </div>
              <p className="text-[11px] text-secondary font-semibold mt-1">
                ✓ Zero Brokerage · No Hidden Maintenance
              </p>
            </div>

            {/* Visit Booking Flow */}
            {visitBooked ? (
              <div className="p-4 rounded-xl bg-secondary-container/30 border border-secondary text-secondary flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>Visit Scheduled!</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  The property manager will contact you via WhatsApp / call to coordinate your visit to Cyber City.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setVisitBooked(true)}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Free Visit</span>
                </button>

                <Link
                  href="/messages"
                  className="w-full py-3 rounded-xl bg-surface-muted hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-border-subtle"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Chat with Property Manager</span>
                </Link>
              </div>
            )}

            <div className="text-[11px] text-on-surface-variant border-t border-border-subtle pt-4 space-y-1.5">
              <p>• Verified contact of on-site manager provided immediately</p>
              <p>• You can cancel or reschedule the visit anytime for free</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
