import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PGConnect — Find your space. Find your people.",
  description:
    "Verified PG discovery and roommate matchmaking in Gurgaon (Sector 22, Cyber City, Udyog Vihar). Zero broker fees, lifestyle compatibility matching.",
  keywords: [
    "PG in Gurgaon",
    "Roommates in Gurgaon",
    "Cyber City PG",
    "Sector 22 PG",
    "Udyog Vihar PG",
    "Zero Brokerage PG",
  ],
};

import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 bg-pure-white border-b border-border-subtle" />}>
            <Navbar />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
