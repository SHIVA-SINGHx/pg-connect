"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export type UserRole = "USER" | "PG_OWNER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  loginAsDemo: (roleType: "user" | "owner" | "admin") => void;
  logout: () => Promise<void>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const defaultDemoUser: AuthUser = {
  id: "demo-roommate-aarav",
  email: "aarav.mehta@pgconnect.local",
  name: "Aarav Mehta",
  role: "USER",
  phone: "+91 98223 34455",
};

const AuthContext = createContext<AuthContextType>({
  user: defaultDemoUser,
  role: "USER",
  token: "dev-roommate-aarav",
  isLoading: false,
  loginAsDemo: () => {},
  logout: async () => {},
  unreadCount: 3,
  setUnreadCount: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultDemoUser);
  const [token, setToken] = useState<string | null>("dev-roommate-aarav");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    // Check saved demo user or Supabase session from localStorage
    const savedDemo = localStorage.getItem("pgconnect_auth_user");
    const savedToken = localStorage.getItem("pgconnect_auth_token");
    if (savedDemo && savedToken) {
      try {
        setUser(JSON.parse(savedDemo));
        setToken(savedToken);
      } catch (e) {
        // use default
      }
    }

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          const u = session.user;
          const role = (u.user_metadata?.role || "USER").toUpperCase() as UserRole;
          const authUser: AuthUser = {
            id: u.id,
            email: u.email || "",
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "User",
            role: role,
          };
          setUser(authUser);
          setToken(session.access_token);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          const u = session.user;
          const role = (u.user_metadata?.role || "USER").toUpperCase() as UserRole;
          const authUser: AuthUser = {
            id: u.id,
            email: u.email || "",
            name: u.user_metadata?.full_name || u.user_metadata?.name || "User",
            role: role,
          };
          setUser(authUser);
          setToken(session.access_token);
        } else {
          setUser(null);
          setToken(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loginAsDemo = (roleType: "user" | "owner" | "admin") => {
    let demoUser: AuthUser;
    let devToken: string;

    if (roleType === "owner") {
      demoUser = {
        id: "demo-owner-rajesh",
        email: "rajesh.sharma@pgconnect.local",
        name: "Rajesh Sharma",
        role: "PG_OWNER",
        phone: "+91 98112 23344",
      };
      devToken = "dev-owner-rajesh";
    } else if (roleType === "admin") {
      demoUser = {
        id: "demo-admin-gurgaon",
        email: "admin@pgconnect.in",
        name: "PGConnect Admin",
        role: "ADMIN",
      };
      devToken = "dev-admin";
    } else {
      demoUser = defaultDemoUser;
      devToken = "dev-roommate-aarav";
    }

    setUser(demoUser);
    setToken(devToken);
    localStorage.setItem("pgconnect_auth_user", JSON.stringify(demoUser));
    localStorage.setItem("pgconnect_auth_token", devToken);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("pgconnect_auth_user");
    localStorage.removeItem("pgconnect_auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "USER",
        token,
        isLoading,
        loginAsDemo,
        logout,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
