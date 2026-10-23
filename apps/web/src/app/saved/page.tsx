"use client";

import Link from "next/link";
import { Bookmark, Building2, MapPin, ArrowRight } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">Saved PGs &amp; Favorites</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Keep track of properties you want to revisit or schedule visits for.
        </p>
      </div>

      <div className="bg-pure-white rounded-2xl border border-border-subtle p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-primary mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-2">No Saved Properties Yet</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
          When exploring Gurgaon PGs in Cyber City or Sector 22, click the heart or bookmark icon to save properties here for easy comparison.
        </p>
        <Link
          href="/pgs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors"
        >
          <span>Browse Gurgaon PGs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
