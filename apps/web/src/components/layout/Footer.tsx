import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-pure-white border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-black text-lg">
                P
              </div>
              <span className="font-extrabold text-lg text-on-surface tracking-tight">
                PGConnect
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Find your space. Find your people. Gurgaon&apos;s verified PG discovery and AI roommate matchmaking platform.
            </p>
            <div className="flex items-center gap-2 text-xs text-secondary font-semibold mt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Zero Brokerage</span>
            </div>
          </div>

          {/* Quick links: PGs */}
          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
              Explore PGs
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/pgs?area=Sector%2022" className="hover:text-primary transition-colors">
                  PG in Sector 22
                </Link>
              </li>
              <li>
                <Link href="/pgs?area=Cyber%20City" className="hover:text-primary transition-colors">
                  PG in Cyber City
                </Link>
              </li>
              <li>
                <Link href="/pgs?area=Udyog%20Vihar" className="hover:text-primary transition-colors">
                  PG in Udyog Vihar
                </Link>
              </li>
              <li>
                <Link href="/pgs?gender=FEMALE" className="hover:text-primary transition-colors">
                  Girls PGs in Gurgaon
                </Link>
              </li>
              <li>
                <Link href="/pgs?gender=MALE" className="hover:text-primary transition-colors">
                  Boys PGs in Gurgaon
                </Link>
              </li>
            </ul>
          </div>

          {/* Roommates */}
          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
              Find Roommates
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/roommates?area=DLF%20Phase%203" className="hover:text-primary transition-colors">
                  Roommates in DLF Phase 3
                </Link>
              </li>
              <li>
                <Link href="/roommates?diet=VEGETARIAN" className="hover:text-primary transition-colors">
                  Vegetarian Roommates
                </Link>
              </li>
              <li>
                <Link href="/roommates?schedule=EARLY_BIRD" className="hover:text-primary transition-colors">
                  Early Bird Roommates
                </Link>
              </li>
              <li>
                <Link href="/roommates" className="hover:text-primary transition-colors">
                  Compatibility Matching
                </Link>
              </li>
            </ul>
          </div>

          {/* For Owners & Trust */}
          <div>
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
              PG Owners & Safety
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/list-your-pg" className="hover:text-primary transition-colors font-semibold text-primary">
                  + List Your Property
                </Link>
              </li>
              <li>
                <Link href="/owner/dashboard" className="hover:text-primary transition-colors">
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-primary transition-colors">
                  Verification & Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© 2026 PGConnect NCR. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="flex items-center gap-1 text-on-surface-variant">
              Crafted for Gurgaon <Sparkles className="w-3.5 h-3.5 text-tertiary" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
