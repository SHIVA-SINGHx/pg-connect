"use client";

import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function ProfilePage() {
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 98765 43210",
    profession: "Senior Product Manager",
    company: "Google Gurgaon",
    targetArea: "Cyber City / Sector 22",
    budgetMin: "12000",
    budgetMax: "18000",
    diet: "Vegetarian",
    sleepSchedule: "Early Bird (11 PM - 7 AM)",
    workMode: "Hybrid (2 days WFH)",
    smoking: "Non-smoker",
    bio: "Chill professional working in Cyber City. Looking for a neat and peaceful co-living room or flatmate.",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Profile Header Card */}
      <div className="bg-pure-white rounded-2xl border border-border-subtle p-6 shadow-xs mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary font-black text-3xl border-2 border-primary">
            VM
          </div>
          <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-secondary text-on-secondary shadow-xs" title="Verified Profile">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-on-surface">{profile.name}</h1>
              <p className="text-xs text-primary font-semibold mt-0.5">
                {profile.profession} · {profile.company}
              </p>
            </div>
            <span className="self-center sm:self-auto px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-xs font-bold">
              ✓ Identity Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-on-surface-variant mt-3">
            <span>{profile.email}</span>
            <span>•</span>
            <span>{profile.phone}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Gurgaon, India
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Roommate Matching Preferences */}
        <div className="bg-pure-white rounded-2xl border border-border-subtle p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-on-surface">
                Roommate Matching &amp; Lifestyle Preferences
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Used by the deterministic matchmaker to find compatible roommates in Gurgaon.
              </p>
            </div>
            {/* Discoverable toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-on-surface">
                {isDiscoverable ? "Discoverable" : "Hidden"}
              </span>
              <button
                type="button"
                onClick={() => setIsDiscoverable(!isDiscoverable)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isDiscoverable ? "bg-secondary" : "bg-outline/30"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-pure-white shadow-xs absolute top-0.5 transition-transform ${
                    isDiscoverable ? "left-6.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Preferred Target Area
              </label>
              <input
                type="text"
                value={profile.targetArea}
                onChange={(e) => setProfile({ ...profile, targetArea: e.target.value })}
                className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>

            <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Max Monthly Budget (₹)
              </label>
              <input
                type="text"
                value={profile.budgetMax}
                onChange={(e) => setProfile({ ...profile, budgetMax: e.target.value })}
                className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>

            <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Dietary Preference
              </label>
              <select
                value={profile.diet}
                onChange={(e) => setProfile({ ...profile, diet: e.target.value })}
                className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
              >
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
              </select>
            </div>

            <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Sleep Schedule
              </label>
              <select
                value={profile.sleepSchedule}
                onChange={(e) => setProfile({ ...profile, sleepSchedule: e.target.value })}
                className="w-full bg-transparent text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
              >
                <option>Early Bird (11 PM - 7 AM)</option>
                <option>Night Owl (1 AM - 9 AM)</option>
                <option>Flexible / Rotational</option>
              </select>
            </div>
          </div>

          <div className="mt-4 bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Short Bio &amp; What You&apos;re Looking For
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-transparent text-xs font-medium text-on-surface focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs text-secondary font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
