"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Bell,
  CheckCircle2,
  Users,
  MessageSquare,
  Home,
  CheckCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "NEW_MESSAGE" | "LISTING_APPROVED";
  title: string;
  body: string;
  created_at: string;
  read: boolean;
  action_href?: string;
  action_label?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "CONNECTION_REQUEST",
    title: "New Roommate Connection Request",
    body: "Priya Sen sent you a connection request. She is a risk consultant at Deloitte looking for a 2-sharing PG in Cyber City.",
    created_at: "10 minutes ago",
    read: false,
    action_href: "/roommates",
    action_label: "View Profile & Accept",
  },
  {
    id: "notif-2",
    type: "NEW_MESSAGE",
    title: "New Message from Kabir",
    body: "Hey Aarav! Have you checked out the Sector 22 Scholar Residency? Seems quiet and very close to our budget.",
    created_at: "1 hour ago",
    read: false,
    action_href: "/messages",
    action_label: "Reply in Chat",
  },
  {
    id: "notif-3",
    type: "CONNECTION_ACCEPTED",
    title: "Connection Accepted!",
    body: "Kabir Malhotra accepted your roommate connection request. You can now chat and coordinate visits together.",
    created_at: "3 hours ago",
    read: true,
    action_href: "/messages",
    action_label: "Start Chat",
  },
  {
    id: "notif-4",
    type: "LISTING_APPROVED",
    title: "Listing Approved & Live!",
    body: "Your listing 'Zolo Cyber Hub Luxury Living' was verified and approved by the admin team. It is now visible to Gurgaon seekers.",
    created_at: "1 day ago",
    read: true,
    action_href: "/pgs",
    action_label: "View Listing",
  },
];

export default function NotificationsPage() {
  const { setUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread" | "requests">("all");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "requests") return n.type === "CONNECTION_REQUEST";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "CONNECTION_REQUEST":
      case "CONNECTION_ACCEPTED":
        return <Users className="w-5 h-5 text-primary" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="w-5 h-5 text-secondary" />;
      case "LISTING_APPROVED":
        return <Home className="w-5 h-5 text-tertiary" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Notifications Feed
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Stay updated on roommate connection requests, new messages, and listing alerts.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-muted hover:bg-surface-container text-xs font-bold text-on-surface transition-colors self-start border border-border-subtle"
        >
          <CheckCheck className="w-4 h-4 text-primary" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 my-6">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "requests", label: "Connection Requests" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === tab.key
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-muted text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-surface-muted rounded-2xl border border-border-subtle">
            <CheckCircle2 className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-on-surface">You are all caught up!</p>
            <p className="text-xs text-on-surface-variant">No notifications in this filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markSingleRead(item.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                item.read
                  ? "bg-pure-white border-border-subtle hover:border-primary/40"
                  : "bg-primary-fixed/20 border-primary/30 shadow-xs"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-pure-white border border-border-subtle shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-on-surface">{item.title}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <Clock className="w-3 h-3" />
                    <span>{item.created_at}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.body}</p>

                {item.action_href && (
                  <div className="pt-2">
                    <Link
                      href={item.action_href}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>{item.action_label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
