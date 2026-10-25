"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MapPin,
  Sparkles,
  CheckCircle,
  Heart,
  MessageSquare,
} from "lucide-react";

interface RoommateCandidate {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  profession: string;
  company: string;
  targetArea: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  matchScore: number;
  matchReasons: string[];
  diet: string;
  sleepSchedule: string;
  workMode: string;
  smoking: string;
  avatar: string;
  bio: string;
}

const ROOMMATES: RoommateCandidate[] = [
  {
    id: "rm-1",
    name: "Aman Sharma",
    age: 24,
    gender: "Male",
    profession: "Software Engineer",
    company: "Zomato @ Cyber City",
    targetArea: "Cyber City / DLF Phase 3",
    budgetMin: 10000,
    budgetMax: 14000,
    moveInDate: "Immediate",
    matchScore: 95,
    matchReasons: ["Same target area (Cyber City)", "Matching budget ₹10k-14k", "Non-smoker"],
    diet: "Vegetarian",
    sleepSchedule: "Early Bird (11 PM - 7 AM)",
    workMode: "Hybrid (3 days office)",
    smoking: "Non-Smoker",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Looking for a clean, chill flatmate to share a 2BHK or Twin PG near Cyber Hub. Love tech and badminton on weekends.",
  },
  {
    id: "rm-2",
    name: "Pooja Verma",
    age: 25,
    gender: "Female",
    profession: "Product Designer",
    company: "MakeMyTrip @ DLF Phase 2",
    targetArea: "Sector 22 / DLF Phase 2",
    budgetMin: 12000,
    budgetMax: 16000,
    moveInDate: "Next 15 Days",
    matchScore: 92,
    matchReasons: ["Compatible sleep schedule", "Quiet hours respect", "Vegetarian preference"],
    diet: "Vegetarian",
    sleepSchedule: "Night Owl (1 AM - 8:30 AM)",
    workMode: "WFH (Remote)",
    smoking: "Non-Smoker",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Seeking a calm, creative roomie. I keep common areas tidy and love cooking chai. Need high-speed WiFi for work.",
  },
  {
    id: "rm-3",
    name: "Rohan Kapoor",
    age: 26,
    gender: "Male",
    profession: "Financial Analyst",
    company: "Deloitte @ Cyber City",
    targetArea: "Udyog Vihar / Sector 22",
    budgetMin: 9000,
    budgetMax: 13000,
    moveInDate: "Immediate",
    matchScore: 88,
    matchReasons: ["Budget overlap", "Office-going schedule", "Shared interest in fitness"],
    diet: "Non-Vegetarian",
    sleepSchedule: "Early Bird (6:30 AM workout)",
    workMode: "Full Office (Mon-Fri)",
    smoking: "Non-Smoker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Corporate professional looking for an easygoing roommate in Udyog Vihar or Sector 22. Gym lover and neat freak.",
  },
  {
    id: "rm-4",
    name: "Sneha Nair",
    age: 23,
    gender: "Female",
    profession: "Frontend Developer",
    company: "Paytm @ Sector 22",
    targetArea: "Sector 22 / Palam Vihar",
    budgetMin: 8000,
    budgetMax: 11000,
    moveInDate: "1st of next month",
    matchScore: 89,
    matchReasons: ["Exact budget range match", "Proximity to Maruti Gate 2", "Non-smoker"],
    diet: "Vegetarian",
    sleepSchedule: "Regular (11:30 PM - 7:30 AM)",
    workMode: "Hybrid (2 days WFH)",
    smoking: "Non-Smoker",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Software engineer moving from Bangalore. Looking for a friendly flatmate for a girl's PG or shared 2BHK in Sector 22.",
  },
];

export default function RoommatesPage() {
  const [selectedDiet, setSelectedDiet] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});
  const [savedRoommateIds, setSavedRoommateIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pgconnect_saved_roommates");
        if (stored) {
          const list = JSON.parse(stored);
          return list.map((r: { id: string }) => r.id);
        }
      } catch {
        // fallback
      }
    }
    return ["rm-1", "rm-2"];
  });

  const toggleConnect = (id: string) => {
    setConnectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSaveRoommate = (r: RoommateCandidate, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = savedRoommateIds.includes(r.id);
    const nextSavedIds = isSaved
      ? savedRoommateIds.filter((id) => id !== r.id)
      : [...savedRoommateIds, r.id];
    setSavedRoommateIds(nextSavedIds);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pgconnect_saved_roommates");
        let list = stored ? JSON.parse(stored) : [];
        if (!isSaved) {
          if (!list.some((item: { id: string }) => item.id === r.id)) {
            list.push({
              id: r.id,
              name: r.name,
              age: r.age,
              gender: r.gender,
              occupation: r.profession,
              company: r.company,
              budget: r.budgetMax,
              preferredAreas: [r.targetArea],
              lifestyle: [r.diet, r.sleepSchedule.split(" ")[0], r.smoking],
              image: r.avatar,
            });
          }
        } else {
          list = list.filter((item: { id: string }) => item.id !== r.id);
        }
        localStorage.setItem("pgconnect_saved_roommates", JSON.stringify(list));
      } catch {
        // fallback
      }
    }
  };

  const filteredRoommates = ROOMMATES.filter((r) => {
    if (selectedDiet !== "All" && r.diet !== selectedDiet) return false;
    if (selectedGender !== "All" && r.gender !== selectedGender) return false;
    if (selectedArea !== "All" && !r.targetArea.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    if (
      searchQuery &&
      !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.profession.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.company.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-1">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Roommate Matching</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic Lifestyle Matcher
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">
            Find Compatible Roommates in Gurgaon
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Matched based on target area, budget overlap, routine, and living habits.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-pure-white p-4 rounded-2xl border border-border-subtle shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search by name, role, company, or tech park..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Target Area */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Localities</option>
            <option value="Cyber City">Cyber City</option>
            <option value="Sector 22">Sector 22</option>
            <option value="Udyog Vihar">Udyog Vihar</option>
            <option value="DLF Phase 3">DLF Phase 3</option>
          </select>

          {/* Gender */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Diet */}
          <select
            value={selectedDiet}
            onChange={(e) => setSelectedDiet(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
          >
            <option value="All">All Diets</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>

          {(selectedArea !== "All" || selectedGender !== "All" || selectedDiet !== "All" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedArea("All");
                setSelectedGender("All");
                setSelectedDiet("All");
                setSearchQuery("");
              }}
              className="text-xs text-accent-rose font-bold px-2 py-1 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Roommates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoommates.map((r) => {
          const isConnected = !!connectedIds[r.id];
          return (
            <div
              key={r.id}
              className="bg-pure-white rounded-2xl border border-border-subtle p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar with match badge */}
                <div className="relative shrink-0 self-start">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-border-subtle group-hover:ring-secondary transition-all"
                  />
                  <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-xs font-black shadow-xs">
                    {r.matchScore}%
                  </div>
                </div>

                {/* Candidate bio */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-lg text-on-surface">
                      {r.name}, <span className="text-sm font-medium text-on-surface-variant">{r.age}</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                        {r.gender}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleSaveRoommate(r, e)}
                        title={savedRoommateIds.includes(r.id) ? "Remove from saved" : "Save roommate"}
                        className={`p-1.5 rounded-full hover:bg-surface-muted transition-colors ${
                          savedRoommateIds.includes(r.id) ? "text-accent-rose" : "text-slate-400 hover:text-accent-rose"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${savedRoommateIds.includes(r.id) ? "fill-accent-rose text-accent-rose" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-primary mt-0.5">
                    {r.profession} · <span className="text-on-surface-variant font-normal">{r.company}</span>
                  </p>

                  <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-outline shrink-0" />
                    <span>Target: {r.targetArea}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-2.5 line-clamp-2 leading-relaxed">
                    &ldquo;{r.bio}&rdquo;
                  </p>
                </div>
              </div>

              {/* Match Factors & Habits */}
              <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle flex flex-col gap-2">
                <div className="text-[11px] font-bold text-secondary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why you match:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.matchReasons.map((reason) => (
                    <span
                      key={reason}
                      className="px-2 py-0.5 rounded-md bg-pure-white text-[11px] font-medium text-on-surface-variant border border-border-subtle"
                    >
                      ✓ {reason}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border-subtle mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-semibold text-on-surface-variant">
                    🥗 {r.diet}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-semibold text-on-surface-variant">
                    ⏰ {r.sleepSchedule}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-semibold text-on-surface-variant">
                    💼 {r.workMode}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-muted text-[10px] font-semibold text-on-surface-variant">
                    🚭 {r.smoking}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Budget & Connect CTA */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-on-surface-variant block font-medium">Budget Range</span>
                  <span className="text-sm font-black text-on-surface">
                    ₹{r.budgetMin.toLocaleString()} - ₹{r.budgetMax.toLocaleString()}/mo
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleConnect(r.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isConnected
                        ? "bg-secondary-fixed text-on-secondary-fixed ring-1 ring-secondary"
                        : "bg-secondary hover:bg-secondary/90 text-on-secondary shadow-xs hover:shadow-md"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Request Sent</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                  {isConnected && (
                    <Link
                      href="/messages"
                      className="px-3 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
