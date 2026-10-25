"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  MapPin,
  ArrowRight,
  Trash2,
  Calendar,
  MessageSquare,
  Users,
  CheckCircle2,
  X,
  Phone,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface SavedPGItem {
  id: string;
  name: string;
  area: string;
  price: number;
  gender: string;
  sharing: string[];
  rating: number;
  image: string;
  distanceToMetro: string;
  phone: string;
}

interface SavedRoommateItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  company: string;
  budget: number;
  preferredAreas: string[];
  lifestyle: string[];
  image: string;
}

const DEFAULT_SAVED_PGS: SavedPGItem[] = [
  {
    id: "pg-cyber-hub-1",
    name: "Stanza Living — Cyber Hub Haven",
    area: "Cyber City, DLF Phase 2",
    price: 11500,
    gender: "Unisex",
    sharing: ["Twin", "Single"],
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "350m from Sikanderpur Metro",
    phone: "+91 98112 23344",
  },
  {
    id: "pg-udyog-vihar-1",
    name: "Zolo Serene — Premium Co-Living",
    area: "Udyog Vihar Phase 4",
    price: 13200,
    gender: "Female",
    sharing: ["Single", "Twin"],
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    distanceToMetro: "800m from Micromax Moulsari Ave",
    phone: "+91 98776 65544",
  },
];

const DEFAULT_SAVED_ROOMMATES: SavedRoommateItem[] = [
  {
    id: "rm-1",
    name: "Rohan Varma",
    age: 24,
    gender: "Male",
    occupation: "Software Engineer",
    company: "Google (Cyber City)",
    budget: 14000,
    preferredAreas: ["Cyber City", "DLF Phase 2"],
    lifestyle: ["Non-Smoker", "Night Owl", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "rm-2",
    name: "Ananya Iyer",
    age: 23,
    gender: "Female",
    occupation: "Consultant",
    company: "Deloitte (Golf Course Rd)",
    budget: 16000,
    preferredAreas: ["Golf Course Road", "Sector 54"],
    lifestyle: ["Non-Smoker", "Early Bird", "Pet Friendly"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
];

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<"pgs" | "roommates">("pgs");
  const [savedPGs, setSavedPGs] = useState<SavedPGItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pgconnect_saved_pgs");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SAVED_PGS;
  });

  const [savedRoommates, setSavedRoommates] = useState<SavedRoommateItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pgconnect_saved_roommates");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SAVED_ROOMMATES;
  });

  const [bookingPG, setBookingPG] = useState<SavedPGItem | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:00 AM");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pgconnect_saved_pgs", JSON.stringify(savedPGs));
    }
  }, [savedPGs]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pgconnect_saved_roommates", JSON.stringify(savedRoommates));
    }
  }, [savedRoommates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const removePG = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedPGs((prev) => prev.filter((p) => p.id !== id));
    showToast("Removed property from saved favorites.");
  };

  const removeRoommate = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedRoommates((prev) => prev.filter((r) => r.id !== id));
    showToast("Removed roommate profile from saved favorites.");
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingPG(null);
      showToast(`Visit scheduled for ${bookingPG?.name} on ${visitDate || "tomorrow"}!`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-primary" />
            <span>Personal Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Saved &amp; Favorites</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Compare saved verified PGs and shortlisted roommate profiles across Gurgaon.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-surface-muted rounded-xl border border-border-subtle self-start md:self-auto">
          <button
            onClick={() => setActiveTab("pgs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pgs"
                ? "bg-pure-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Saved PGs ({savedPGs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("roommates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "roommates"
                ? "bg-pure-white text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Saved Roommates ({savedRoommates.length})</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "pgs" && (
        <div>
          {savedPGs.length === 0 ? (
            <div className="bg-pure-white rounded-2xl border border-border-subtle p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-primary mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">No Saved Properties</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                You haven&apos;t bookmarked any PGs yet. Explore top verified stays in Cyber City, Udyog Vihar, and Golf Course Road.
              </p>
              <Link
                href="/pgs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
              >
                <span>Browse Gurgaon PGs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPGs.map((pg) => (
                <div
                  key={pg.id}
                  className="bg-pure-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={pg.image}
                      alt={pg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{pg.gender}</span>
                    </div>
                    <button
                      onClick={(e) => removePG(pg.id, e)}
                      title="Remove from saved"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium bg-gradient-to-t from-black/70 to-transparent p-2 rounded-lg">
                      <span>{pg.distanceToMetro}</span>
                      <span className="font-bold text-amber-300">★ {pg.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-on-surface text-sm line-clamp-1">{pg.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="line-clamp-1">{pg.area}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {pg.sharing.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-surface-muted text-on-surface-variant text-[10px] font-medium"
                          >
                            {s} Sharing
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-[11px] text-on-surface-variant">Starts at</span>
                        <div className="text-right">
                          <span className="text-lg font-black text-primary">₹{pg.price.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-on-surface-variant"> / mo</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setBookingPG(pg)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Visit</span>
                        </button>
                        <Link
                          href={`/pgs/${pg.id}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border-subtle hover:bg-surface-muted text-on-surface text-xs font-semibold transition-colors"
                        >
                          <span>Details</span>
                          <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Roommates Tab */}
      {activeTab === "roommates" && (
        <div>
          {savedRoommates.length === 0 ? (
            <div className="bg-pure-white rounded-2xl border border-border-subtle p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-primary mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">No Saved Roommates</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                You haven&apos;t shortlisted any potential roommates yet. Find people matching your budget and lifestyle preferences.
              </p>
              <Link
                href="/roommates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
              >
                <span>Find Roommates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRoommates.map((rm) => (
                <div
                  key={rm.id}
                  className="bg-pure-white rounded-2xl border border-border-subtle p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rm.image}
                          alt={rm.name}
                          className="w-12 h-12 rounded-full object-cover border border-border-subtle"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-on-surface">{rm.name}, {rm.age}</h3>
                          <p className="text-[11px] text-on-surface-variant">{rm.occupation}</p>
                          <p className="text-[10px] text-primary font-semibold">{rm.company}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeRoommate(rm.id, e)}
                        title="Remove from saved"
                        className="w-8 h-8 rounded-full bg-surface-muted hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                        Target Areas
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rm.preferredAreas.map((area) => (
                          <span
                            key={area}
                            className="px-2 py-0.5 rounded-md bg-surface-muted text-on-surface text-[10px] font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                        Lifestyle &amp; Habits
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rm.lifestyle.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Max Budget</span>
                      <span className="text-base font-black text-primary">₹{rm.budget.toLocaleString("en-IN")}/mo</span>
                    </div>

                    <Link
                      href="/messages"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat / Connect</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Visit Modal */}
      {bookingPG && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-pure-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border-subtle animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-black text-base text-on-surface">Schedule Property Visit</h3>
              </div>
              <button
                onClick={() => setBookingPG(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-slate-800">Visit Scheduled!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  The property manager at {bookingPG.name} has been notified and will call you to confirm.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmVisit} className="space-y-4">
                <div className="p-3 bg-surface-muted rounded-xl">
                  <div className="font-bold text-xs text-on-surface">{bookingPG.name}</div>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{bookingPG.area}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Select Preferred Time</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option>10:00 AM - 12:00 PM (Morning)</option>
                    <option>12:00 PM - 03:00 PM (Afternoon)</option>
                    <option>03:00 PM - 06:00 PM (Evening)</option>
                    <option>06:00 PM - 08:00 PM (Post-Office)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Your Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      defaultValue="+91 98223 34455"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-subtle bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Visit Appointment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
