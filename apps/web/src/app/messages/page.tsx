"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Send,
  Building2,
  Users,
  CheckCheck,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  type: "roommate" | "owner";
  subtitle: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Aman Sharma",
    type: "roommate",
    subtitle: "Cyber City · 95% Match",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Hey! Did you check out the 2BHK in DLF Phase 3? It has power backup.",
    time: "10:42 AM",
    unreadCount: 1,
  },
  {
    id: "conv-2",
    name: "Stanza Living Manager",
    type: "owner",
    subtitle: "Cyber Hub Haven",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Your visit is confirmed for tomorrow at 4:30 PM. See you soon!",
    time: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    name: "Pooja Verma",
    type: "roommate",
    subtitle: "Udyog Vihar · 92% Match",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    lastMessage: "Sounds great! Let's connect over a quick call this evening.",
    time: "Oct 21",
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "conv-1": [
      { id: "m1", sender: "them", text: "Hey! Noticed your profile — we have a 95% match for Cyber City.", time: "10:35 AM" },
      { id: "m2", sender: "me", text: "Hi Aman! Yes, I am actively looking for someone to split a flat or twin room.", time: "10:38 AM" },
      { id: "m3", sender: "them", text: "Hey! Did you check out the 2BHK in DLF Phase 3? It has power backup.", time: "10:42 AM" },
    ],
    "conv-2": [
      { id: "m4", sender: "them", text: "Hello! Thank you for scheduling a visit to Stanza Living Cyber Hub Haven.", time: "Yesterday" },
      { id: "m5", sender: "them", text: "Your visit is confirmed for tomorrow at 4:30 PM. See you soon!", time: "Yesterday" },
    ],
    "conv-3": [
      { id: "m6", sender: "them", text: "Sounds great! Let's connect over a quick call this evening.", time: "Oct 21" },
    ],
  });

  const activeConv = CONVERSATIONS.find((c) => c.id === activeConvId) || CONVERSATIONS[0];
  const activeMessages = messages[activeConvId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      time: "Just now",
    };

    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg],
    }));

    setInputText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col">
      <div className="bg-pure-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        {/* Left: Conversation List */}
        <div className="border-r border-border-subtle flex flex-col bg-surface-subtle/50">
          <div className="p-4 border-b border-border-subtle">
            <h2 className="text-lg font-black text-on-surface mb-3">Messages</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-pure-white border border-border-subtle text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/60">
            {CONVERSATIONS.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                    isActive ? "bg-primary-fixed/30" : "hover:bg-pure-white"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-border-subtle"
                    />
                    {c.type === "owner" && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[9px] font-bold">
                        PG
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4 className="font-bold text-sm text-on-surface truncate">{c.name}</h4>
                      <span className="text-[10px] text-on-surface-variant shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-medium truncate mb-1">
                      {c.subtitle}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {c.lastMessage}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Message Thread */}
        <div className="md:col-span-2 flex flex-col bg-pure-white">
          {/* Header */}
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.avatar}
                alt={activeConv.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-border-subtle"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-on-surface">{activeConv.name}</h3>
                  <span className="px-2 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    Verified
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant">{activeConv.subtitle}</span>
              </div>
            </div>

            <div className="text-xs text-secondary font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span>Online</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3 bg-surface-subtle/30">
            {activeMessages.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? "bg-primary text-on-primary rounded-br-xs"
                        : "bg-pure-white text-on-surface border border-border-subtle rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-border-subtle bg-pure-white flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold shadow-xs transition-colors cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
