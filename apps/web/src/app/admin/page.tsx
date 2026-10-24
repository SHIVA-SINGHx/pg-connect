"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Users,
  MapPin,
  ExternalLink,
  Check,
  X,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface PendingListing {
  id: string;
  name: string;
  owner_name: string;
  owner_email: string;
  area: string;
  address: string;
  price_from: number;
  submitted_at: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ModerationReport {
  id: string;
  reporter: string;
  target_type: "USER" | "LISTING";
  target_name: string;
  reason: string;
  details: string;
  created_at: string;
  resolved: boolean;
}

const INITIAL_PENDING_LISTINGS: PendingListing[] = [
  {
    id: "pend-1",
    name: "Sector 22 Scholar Residency",
    owner_name: "Rajesh Sharma",
    owner_email: "rajesh.sharma@pgconnect.local",
    area: "Sector 22",
    address: "H.No 412, Sector 22A, Gurgaon",
    price_from: 8500,
    submitted_at: "Today, 11:20 AM",
    status: "PENDING",
  },
  {
    id: "pend-2",
    name: "Cyber Oasis Executive Rooms",
    owner_name: "Sunita Verma",
    owner_email: "sunita.verma@pgconnect.local",
    area: "DLF Phase 2, Cyber City",
    address: "B-Block, Near Sikanderpur, Gurgaon",
    price_from: 14000,
    submitted_at: "Yesterday",
    status: "PENDING",
  },
];

const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: "rep-1",
    reporter: "Priya Sen",
    target_type: "USER",
    target_name: "Suspicious User #491",
    reason: "SPAM",
    details: "Repeated spam connection requests promoting unauthorized third-party broker service.",
    created_at: "2 hours ago",
    resolved: false,
  },
  {
    id: "rep-2",
    reporter: "Aarav Mehta",
    target_type: "LISTING",
    target_name: "Fake Deluxe Residency",
    reason: "FAKE_LISTING",
    details: "Photos taken from commercial hotel catalogue, property does not exist at address.",
    created_at: "1 day ago",
    resolved: false,
  },
];

export default function AdminModerationPage() {
  const { role } = useAuth();
  const [pendingListings, setPendingListings] = useState<PendingListing[]>(INITIAL_PENDING_LISTINGS);
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_REPORTS);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const approveListing = (id: string, name: string) => {
    setPendingListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "APPROVED" } : l))
    );
    setActionMessage(`Approved "${name}". It is now published live to Gurgaon search.`);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const rejectListing = (id: string, name: string) => {
    setPendingListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "REJECTED" } : l))
    );
    setActionMessage(`Rejected "${name}". Feedback notification dispatched to property owner.`);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const resolveReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
    );
    setActionMessage("Report resolved successfully.");
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Admin Moderation Center
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary font-bold">
              Restricted
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Review new PG listings submitted for verification, resolve community reports, and monitor platform health.
          </p>
        </div>

        {/* System Health Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-pure-white border border-border-subtle shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <div className="text-xs">
            <span className="font-bold text-on-surface block">Systems Operational</span>
            <span className="text-on-surface-variant text-[11px]">API 200 OK · Worker Online</span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="my-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Grid: Pending Listings Queue */}
      <div className="my-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Listing Approval Queue (Pending Verification)</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary">
            {pendingListings.filter((l) => l.status === "PENDING").length} awaiting review
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pendingListings.map((l) => (
            <div
              key={l.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                l.status === "APPROVED"
                  ? "bg-surface-muted border-secondary/30 opacity-70"
                  : l.status === "REJECTED"
                  ? "bg-surface-muted border-error/30 opacity-70"
                  : "bg-pure-white border-border-subtle shadow-xs"
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {l.area}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      l.status === "APPROVED"
                        ? "bg-secondary text-on-secondary"
                        : l.status === "REJECTED"
                        ? "bg-error text-pure-white"
                        : "bg-tertiary-fixed text-tertiary"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-on-surface">{l.name}</h3>
                <p className="text-xs text-on-surface-variant">{l.address}</p>

                <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs">
                  <span className="text-on-surface-variant">Owner:</span>
                  <span className="font-semibold text-on-surface">{l.owner_name} ({l.owner_email})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Price From:</span>
                  <span className="font-bold text-primary">₹{l.price_from.toLocaleString()}/mo</span>
                </div>
              </div>

              {l.status === "PENDING" && (
                <div className="flex items-center gap-2 pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => approveListing(l.id, l.name)}
                    className="flex-1 py-2 px-3 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                  <button
                    onClick={() => rejectListing(l.id, l.name)}
                    className="py-2 px-3 rounded-xl border border-error text-error text-xs font-bold hover:bg-error/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reports Queue */}
      <div className="my-8 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-tertiary" />
          <span>Community Moderation Reports</span>
        </h2>

        <div className="bg-pure-white rounded-2xl border border-border-subtle divide-y divide-border-subtle overflow-hidden shadow-xs">
          {reports.map((r) => (
            <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-error/10 text-error font-bold text-[10px]">
                    {r.reason}
                  </span>
                  <span className="text-xs font-bold text-on-surface">
                    Reported {r.target_type}: {r.target_name}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">by {r.reporter} · {r.created_at}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{r.details}</p>
              </div>

              <div>
                {r.resolved ? (
                  <span className="text-xs font-bold text-secondary inline-flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => resolveReport(r.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-muted hover:bg-surface-container text-xs font-bold text-on-surface border border-border-subtle transition-colors"
                  >
                    Take Action & Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
