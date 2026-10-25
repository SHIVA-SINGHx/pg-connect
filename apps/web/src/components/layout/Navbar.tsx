"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  Users,
  MapPin,
  MessageSquare,
  Bookmark,
  Menu,
  X,
  PlusCircle,
  Bell,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, unreadCount } = useAuth();

  const navLinks = [
    { href: "/pgs", label: "Explore PGs", icon: Building2 },
    { href: "/roommates", label: "Find Roommates", icon: Users },
    { href: "/pgs?view=map", label: "Map View", icon: MapPin },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-pure-white/95 backdrop-blur-md border-b border-border-subtle shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Locality */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                  P
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-xl text-on-surface tracking-tight">
                      PGConnect
                    </span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-primary-fixed text-primary">
                      NCR
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant hidden sm:block">
                    Find your space. Find your people.
                  </span>
                </div>
              </Link>

              {/* City badge */}
              <div className="hidden md:flex items-center gap-1.5 bg-surface-muted hover:bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface cursor-pointer transition-colors border border-border-subtle">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Gurgaon</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary-fixed/40 font-semibold"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {(role === "PG_OWNER" || role === "ADMIN") && (
                <Link
                  href="/owner/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/owner/dashboard"
                      ? "text-primary bg-primary-fixed/40 font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-muted"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Owner Portal</span>
                </Link>
              )}

              {role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/admin"
                      ? "text-primary bg-primary-fixed/40 font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-muted"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Actions: Notifications + List PG + Profile / Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-full hover:bg-surface-muted text-on-surface-variant hover:text-on-surface transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-[10px] font-bold text-pure-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/list-your-pg"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your PG</span>
              </Link>

              {/* Profile or Auth Button */}
              {user ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary-fixed transition-all"
                    title={`${user.name} (${user.role})`}
                  >
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm text-primary border border-primary/20">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-[11px] font-semibold text-primary hover:underline px-1 hidden sm:block"
                  >
                    Role: {user.role === "PG_OWNER" ? "Owner" : user.role === "ADMIN" ? "Admin" : "Seeker"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-surface-muted hover:bg-surface-container text-on-surface text-xs sm:text-sm font-semibold border border-border-subtle"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-muted transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-40 bg-inverse-surface/40 backdrop-blur-xs flex flex-col">
            <div className="bg-pure-white p-4 border-b border-border-subtle shadow-xl flex flex-col gap-2 animate-in slide-in-from-top-2 duration-150">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-muted text-on-surface font-medium text-sm transition-colors"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-muted text-on-surface font-medium text-sm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-error text-pure-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {(role === "PG_OWNER" || role === "ADMIN") && (
                <Link
                  href="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-muted text-on-surface font-medium text-sm transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  <span>Owner Dashboard</span>
                </Link>
              )}

              {role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-muted text-on-surface font-medium text-sm transition-colors"
                >
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Admin Moderation</span>
                </Link>
              )}

              <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
                <Link
                  href="/list-your-pg"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-xs hover:bg-primary-container transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Your PG</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-border-subtle text-on-surface font-semibold text-xs text-center"
                >
                  Switch Demo Account / Sign In
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
