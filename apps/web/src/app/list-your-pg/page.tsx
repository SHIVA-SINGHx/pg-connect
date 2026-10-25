"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function ListYourPGPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    area: "Sector 22",
    address: "",
    gender: "Unisex",
    singleRent: "",
    twinRent: "",
    tripleRent: "",
    depositMonths: "1",
    noticePeriod: "30 Days",
    mealsIncluded: true,
    hasWifi: true,
    hasPowerBackup: true,
    hasAC: true,
    contactName: "",
    contactPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-on-surface mb-2">Listing Submitted for Review!</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          Thank you for listing <strong>{formData.name || "your PG"}</strong> in Gurgaon. Our physical verification team will review your property details and contact you at {formData.contactPhone || "+91 98765 43210"} within 24 hours.
        </p>
        <Link
          href="/pgs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-container transition-colors"
        >
          <span>Explore Live Listings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          PG Owner Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface">
          List Your PG in Gurgaon (Zero Brokerage)
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Reach thousands of verified corporate employees and students in Cyber City &amp; Sector 22.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          { stepNum: 1, title: "1. Basic Details" },
          { stepNum: 2, title: "2. Rooms & Pricing" },
          { stepNum: 3, title: "3. Amenities & Contact" },
        ].map((s) => (
          <div
            key={s.stepNum}
            className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-colors ${
              step === s.stepNum
                ? "bg-primary text-on-primary border-primary shadow-xs"
                : step > s.stepNum
                ? "bg-secondary-fixed text-on-secondary-fixed border-secondary"
                : "bg-surface-subtle text-on-surface-variant border-border-subtle"
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-pure-white p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-xs flex flex-col gap-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-base font-black text-on-surface">Property Location &amp; Name</h3>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Property / PG Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Residency Co-Living"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Gurgaon Locality *
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="Sector 22">Sector 22 (Near Maruti Gate)</option>
                  <option value="Cyber City">Cyber City / DLF Phase 2</option>
                  <option value="Udyog Vihar">Udyog Vihar (Phase 1-5)</option>
                  <option value="DLF Phase 3">DLF Phase 3 (Pink Town House)</option>
                  <option value="Golf Course Road">Golf Course Road</option>
                  <option value="Sohna Road">Sohna Road</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Target Tenant Type *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="Unisex">Unisex / Co-Living</option>
                  <option value="Male">Boys PG Only</option>
                  <option value="Female">Girls PG Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Complete Street Address &amp; Nearest Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House / Plot No., Sector, Landmark"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: Room Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Rooms & Pricing */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-base font-black text-on-surface">Monthly Rent &amp; Sharing Options</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Single Room Rent (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.singleRent}
                  onChange={(e) => setFormData({ ...formData, singleRent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-bold text-on-surface focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Twin Sharing Rent (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={formData.twinRent}
                  onChange={(e) => setFormData({ ...formData, twinRent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-bold text-on-surface focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Triple Sharing Rent (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 7500"
                  value={formData.tripleRent}
                  onChange={(e) => setFormData({ ...formData, tripleRent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-bold text-on-surface focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Security Deposit
                </label>
                <select
                  value={formData.depositMonths}
                  onChange={(e) => setFormData({ ...formData, depositMonths: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Month Rent</option>
                  <option value="2">2 Months Rent</option>
                  <option value="0">Zero Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Notice Period
                </label>
                <select
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="30 Days">30 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="No Notice">Flexible / No Notice</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-surface-muted text-on-surface text-xs font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Amenities &amp; Contact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Amenities & Contact */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-base font-black text-on-surface">Amenities &amp; Contact Verification</h3>

            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: "Daily Meals (3 times)", key: "mealsIncluded" },
                  { label: "High-Speed WiFi", key: "hasWifi" },
                  { label: "100% Power Backup", key: "hasPowerBackup" },
                  { label: "Split Air Conditioning", key: "hasAC" },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-3 bg-surface-subtle rounded-xl border border-border-subtle cursor-pointer hover:bg-surface-muted transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(formData[item.key])}
                    onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs font-medium text-on-surface">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl bg-surface-muted text-on-surface text-xs font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Property for Verification</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
