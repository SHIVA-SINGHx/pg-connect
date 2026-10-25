/**
 * PGConnect Typed API Client
 */

import type {
  ConnectionCreate,
  ConnectionRead,
  ConnectionUpdate,
  ConversationRead,
  InterestCreate,
  InterestRead,
  MatchResponse,
  MessageCreate,
  MessageRead,
  NotificationRead,
  PGListingCreate,
  PGListingRead,
  PGListingSearchResult,
  PGListingUpdate,
  ReportCreate,
  ReportRead,
  RoommateProfileCreate,
  RoommateProfileRead,
  RoommateProfileUpdate,
  SavedPGRead,
  UserRead,
  UserUpdate,
} from "./types.js";

export interface ClientConfig {
  baseUrl?: string;
  getToken?: () => string | null | Promise<string | null>;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`API Error ${status} ${statusText}: ${JSON.stringify(body)}`);
    this.name = "APIError";
  }
}

export class PGConnectClient {
  private baseUrl: string;
  private getToken?: () => string | null | Promise<string | null>;

  constructor(config: ClientConfig = {}) {
    this.baseUrl = (config.baseUrl || "http://localhost:8000").replace(/\/$/, "");
    this.getToken = config.getToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      throw new APIError(res.status, res.statusText, body);
    }

    if (res.status === 204) {
      return null as unknown as T;
    }

    return (await res.json()) as T;
  }

  // --- Users & Profiles ---
  users = {
    getMe: () => this.request<UserRead>("/api/v1/users/me"),
    updateMe: (data: UserUpdate) =>
      this.request<UserRead>("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  };

  profiles = {
    getMyProfile: () => this.request<RoommateProfileRead>("/api/v1/profiles/me"),
    createProfile: (data: RoommateProfileCreate) =>
      this.request<RoommateProfileRead>("/api/v1/profiles", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateProfile: (data: RoommateProfileUpdate) =>
      this.request<RoommateProfileRead>("/api/v1/profiles/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getById: (id: string) => this.request<RoommateProfileRead>(`/api/v1/profiles/${id}`),
  };

  // --- PG Listings ---
  pgs = {
    search: (params?: {
      area?: string;
      gender?: string;
      min_price?: number;
      max_price?: number;
      page?: number;
      page_size?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.area) query.set("area", params.area);
      if (params?.gender) query.set("gender", params.gender);
      if (params?.min_price) query.set("min_price", String(params.min_price));
      if (params?.max_price) query.set("max_price", String(params.max_price));
      if (params?.page) query.set("page", String(params.page));
      if (params?.page_size) query.set("page_size", String(params.page_size));
      const qs = query.toString();
      return this.request<PGListingSearchResult>(`/api/v1/pgs${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => this.request<PGListingRead>(`/api/v1/pgs/${id}`),
    save: (id: string) =>
      this.request<{ message: string }>(`/api/v1/pgs/${id}/save`, { method: "POST" }),
    unsave: (id: string) =>
      this.request<{ message: string }>(`/api/v1/pgs/${id}/save`, { method: "DELETE" }),
    listSaved: () => this.request<SavedPGRead[]>("/api/v1/pgs/saved"),
    expressInterest: (id: string, data?: InterestCreate) =>
      this.request<InterestRead>(`/api/v1/pgs/${id}/interest`, {
        method: "POST",
        body: JSON.stringify(data || {}),
      }),
  };

  // --- Roommate Matching & Connections ---
  roommates = {
    getMatches: (params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.offset) query.set("offset", String(params.offset));
      const qs = query.toString();
      return this.request<MatchResponse>(`/api/v1/matches/roommates${qs ? `?${qs}` : ""}`);
    },
    sendConnection: (data: ConnectionCreate) =>
      this.request<ConnectionRead>("/api/v1/connections", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    listConnections: (params?: { status?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      const qs = query.toString();
      return this.request<ConnectionRead[]>(`/api/v1/connections${qs ? `?${qs}` : ""}`);
    },
    updateConnection: (id: string, data: ConnectionUpdate) =>
      this.request<ConnectionRead>(`/api/v1/connections/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  };

  // --- Messages & Conversations ---
  messages = {
    getConversations: () => this.request<ConversationRead[]>("/api/v1/messages/conversations"),
    getMessages: (conversationId: string, params?: { limit?: number; offset?: number }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.offset) query.set("offset", String(params.offset));
      const qs = query.toString();
      return this.request<MessageRead[]>(
        `/api/v1/messages/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`
      );
    },
    sendMessage: (conversationId: string, data: MessageCreate) =>
      this.request<MessageRead>(`/api/v1/messages/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  };

  // --- Notifications ---
  notifications = {
    list: (params?: { unread_only?: boolean; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.unread_only) query.set("unread_only", "true");
      if (params?.limit) query.set("limit", String(params.limit));
      const qs = query.toString();
      return this.request<NotificationRead[]>(`/api/v1/notifications${qs ? `?${qs}` : ""}`);
    },
    markRead: (id: string) =>
      this.request<{ message: string }>(`/api/v1/notifications/${id}/read`, {
        method: "PATCH",
      }),
    markAllRead: () =>
      this.request<{ message: string }>("/api/v1/notifications/read-all", {
        method: "POST",
      }),
  };

  // --- Owner Operations ---
  owner = {
    getListings: () => this.request<PGListingRead[]>("/api/v1/owner/listings"),
    createListing: (data: PGListingCreate) =>
      this.request<PGListingRead>("/api/v1/owner/listings", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateListing: (id: string, data: PGListingUpdate) =>
      this.request<PGListingRead>(`/api/v1/owner/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getInquiries: (listingId?: string) => {
      const query = new URLSearchParams();
      if (listingId) query.set("listing_id", listingId);
      const qs = query.toString();
      return this.request<InterestRead[]>(`/api/v1/owner/inquiries${qs ? `?${qs}` : ""}`);
    },
  };

  // --- Admin Moderation ---
  admin = {
    getPendingListings: () => this.request<PGListingRead[]>("/api/v1/admin/listings/pending"),
    approveListing: (id: string) =>
      this.request<PGListingRead>(`/api/v1/admin/listings/${id}/approve`, {
        method: "POST",
      }),
    rejectListing: (id: string, reason?: string) =>
      this.request<PGListingRead>(`/api/v1/admin/listings/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    getReports: (params?: { unresolved_only?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.unresolved_only) query.set("unresolved_only", "true");
      const qs = query.toString();
      return this.request<ReportRead[]>(`/api/v1/admin/reports${qs ? `?${qs}` : ""}`);
    },
    resolveReport: (id: string) =>
      this.request<ReportRead>(`/api/v1/admin/reports/${id}/resolve`, {
        method: "POST",
      }),
  };

  // --- System ---
  system = {
    health: () => this.request<{ status: string; service: string }>("/health"),
    healthExt: () => this.request<{ status: string; db: string; redis: string }>("/api/v1/system/health-ext"),
  };
}

export const createClient = (config: ClientConfig = {}) => new PGConnectClient(config);
