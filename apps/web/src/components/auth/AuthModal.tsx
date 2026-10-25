"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { X, ShieldCheck, UserCheck, Home } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginAsDemo, user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-pure-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-subtle relative flex flex-col gap-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-primary">PGConnect</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-bold">Gurgaon</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mt-1">
            {user ? "Manage Account & Switch Role" : "Sign in to PGConnect"}
          </h2>
          <p className="text-xs text-on-surface-variant">
            Connect with verified roommates, chat with property owners, and save your favorites.
          </p>
        </div>

        {/* Demo role switchers */}
        <div className="flex flex-col gap-2.5 p-3.5 bg-surface-muted rounded-xl border border-border-subtle">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            ⚡ Quick Demo Accounts (Instant Access)
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsDemo("user");
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-pure-white border border-border-subtle hover:border-primary hover:bg-primary-fixed/20 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-secondary/10 text-secondary">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Aarav Mehta (Roommate Seeker)</div>
                  <div className="text-[11px] text-on-surface-variant">Looking in Cyber City & Sec 22</div>
                </div>
              </div>
              <span className="text-xs text-primary font-semibold group-hover:translate-x-0.5 transition-transform">Select →</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo("owner");
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-pure-white border border-border-subtle hover:border-primary hover:bg-primary-fixed/20 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Rajesh Sharma (PG Owner)</div>
                  <div className="text-[11px] text-on-surface-variant">Owner of 3 PG properties in Gurgaon</div>
                </div>
              </div>
              <span className="text-xs text-primary font-semibold group-hover:translate-x-0.5 transition-transform">Select →</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemo("admin");
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-pure-white border border-border-subtle hover:border-primary hover:bg-primary-fixed/20 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-tertiary/10 text-tertiary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Platform Admin</div>
                  <div className="text-[11px] text-on-surface-variant">Moderation & listing approvals</div>
                </div>
              </div>
              <span className="text-xs text-primary font-semibold group-hover:translate-x-0.5 transition-transform">Select →</span>
            </button>
          </div>
        </div>

        {user && (
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <span className="text-xs text-on-surface-variant">
              Logged in as <strong className="text-on-surface">{user.name}</strong> ({user.role})
            </span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-xs font-bold text-error hover:underline"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
