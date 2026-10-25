import { createClient, PGConnectClient } from "@pgconnect/api-client";

export const api: PGConnectClient = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pgconnect_auth_token");
    }
    return null;
  },
});

export * from "@pgconnect/api-client";
