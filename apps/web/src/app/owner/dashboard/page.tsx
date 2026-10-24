"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Building2,
  Users,
  Eye,
  PlusCircle,
  TrendingUp,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

interface OwnerListing {
  id: string;
  name: string;
  area: string;
  price_from: number;
  available_beds: number;
  total_beds: number;
  status: "ACTIVE" | "PENDING" | "DRAFT";
  is_promoted: boolean;
  views: number;
}

interface TenantLead {
  id: string;
  tenant_name: string;
  phone: string;
  pg_name: string;
  sharing_interested: string;
  date: string;
  status: "NEW" | "CONTACTED" | "VISIT_SCHEDULED";
}

const SAMPLE_OWNER_LISTINGS: OwnerListing[] = [
  {
    id: "l-1",
    name: "Zolo Cyber Hub Luxury Living",
    area: "Cyber City",
    price_from: 16500,
    available_beds: 7,
    total_beds: 34,
    status: "ACTIVE",
    is_promoted: true,
    views: 1240,
  },
  {
    id: "l-2",
    name: "Stanza Living Udyog Vihar Executive",
    area: "Udyog Vihar Phase 4",
    price_from: 13000,
    available_beds: 9,
    total_beds: 42,
    status: "ACTIVE",
    is_promoted: false,
    views: 890,
  },
  {
    id: "l-3",
    name: "Sector 22 Scholar Residency",
    area: "Sector 22",
    price_from: 8500,
    available_beds: 9,
    total_beds: 44,
    status: "PENDING",
    is_promoted: false,
    views: 110,
  },
];

const SAMPLE_LEADS: TenantLead[] = [
  {
    id: "lead-1",
    tenant_name: "Rohan Kapoor",
    phone: "+91 98112 99887",
    pg_name: "Zolo Cyber Hub Luxury Living",
    sharing_interested: "Single Room",
    date: "Today, 4:30 PM",
    status: "NEW",
  },
  {
    id: "lead-2",
    tenant_name: "Ananya Dixit",
    phone: "+91 98774 22119",
    pg_name: "Stanza Living Udyog Vihar",
    sharing_interested: "Double Sharing",
    date: "Yesterday",
    status: "VISIT_SCHEDULED",
  },
  {
    id: "lead-3",
    tenant_name: "Karan Mehta",
    phone: "+91 99551 33442",
    pg_name: "Zolo Cyber Hub Luxury Living",
    sharing_interested: "Double Sharing",
    date: "2 days ago",
    status: "CONTACTED",
  },
];

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<OwnerListing[]>(SAMPLE_OWNER_LISTINGS);
  const [promotedId, setPromotedId] = useState<string | null>(null);

  const togglePromotion = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_promoted: !l.is_promoted } : l))
    );
    setPromotedId(id);
    setTimeout(() => setPromotedId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Owner Property Portal
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-bold">
              Verified Owner
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage your Gurgaon properties, track occupancy, and respond to incoming tenant leads.
          </p>
        </div>

        <Link
          href="/list-your-pg"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="p-5 rounded-2xl bg-pure-white border border-border-subtle shadow-xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Total Properties</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-on-surface">3</span>
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[11px] text-secondary font-medium">2 Active · 1 In Review</span>
        </div>

        <div className="p-5 rounded-2xl bg-pure-white border border-border-subtle shadow-xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Available Beds</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-on-surface">25 / 120</span>
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-[11px] text-on-surface-variant">79% Occupancy Rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-pure-white border border-border-subtle shadow-xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Monthly Inquiries</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-on-surface">48 Leads</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[11px] text-secondary font-medium">↑ 18% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-pure-white border border-border-subtle shadow-xs flex flex-col gap-1">
          <span className="text-xs font-semibold text-on-surface-variant">Listing Views (30d)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-on-surface">2,240</span>
            <Eye className="w-5 h-5 text-tertiary" />
          </div>
          <span className="text-[11px] text-on-surface-variant">Gurgaon Sector 22 & Cyber City</span>
        </div>
      </div>

      {promotedId && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Listing promotion updated successfully! It will now appear featured in Gurgaon search results.</span>
        </div>
      )}

      {/* Listings Section */}
      <div className="flex flex-col gap-4 mb-10">
        <h2 className="text-lg font-bold text-on-surface">My Properties in Gurgaon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {listings.map((l) => (
            <div
              key={l.id}
              className="bg-pure-white rounded-2xl border border-border-subtle p-5 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      l.status === "ACTIVE"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-tertiary/10 text-tertiary"
                    }`}
                  >
                    {l.status}
                  </span>
                  {l.is_promoted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-on-surface">{l.name}</h3>
                <span className="text-xs text-on-surface-variant">{l.area}</span>

                <div className="flex items-baseline justify-between pt-2 border-t border-border-subtle text-xs">
                  <span className="text-on-surface-variant">Starting Price</span>
                  <span className="font-bold text-on-surface">₹{l.price_from.toLocaleString()}/mo</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-on-surface-variant">Available Beds</span>
                  <span className="font-bold text-secondary">
                    {l.available_beds} of {l.total_beds} vacant
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => togglePromotion(l.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    l.is_promoted
                      ? "bg-surface-muted text-on-surface hover:bg-surface-container"
                      : "bg-primary text-on-primary hover:bg-primary-container shadow-xs"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{l.is_promoted ? "Featured ✓" : "Boost Listing"}</span>
                </button>
                <Link
                  href={`/pgs/${l.id}`}
                  className="py-2 px-3 rounded-xl border border-border-subtle text-xs font-semibold text-on-surface hover:bg-surface-muted"
                >
                  View Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Inquiries & Leads */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface">Recent Tenant Inquiries & Visit Requests</h2>
          <span className="text-xs text-on-surface-variant">Real-time leads</span>
        </div>

        <div className="bg-pure-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-muted border-b border-border-subtle text-on-surface-variant font-bold">
                  <th className="py-3 px-4">Prospective Tenant</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {SAMPLE_LEADS.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-on-surface">{lead.tenant_name}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{lead.pg_name}</td>
                    <td className="py-3.5 px-4 font-medium text-on-surface">{lead.sharing_interested}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{lead.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lead.status === "NEW"
                            ? "bg-primary-fixed text-primary"
                            : lead.status === "VISIT_SCHEDULED"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-muted text-on-surface"
                          title="Call Tenant"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href="/messages"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-container"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
