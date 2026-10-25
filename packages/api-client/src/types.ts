/**
 * PGConnect API TypeScript Definitions
 * Auto-aligned with backend FastAPI Pydantic v2 schemas.
 */

export type UserRole = "USER" | "PG_OWNER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface UserBase {
  name: string;
  email: string;
  phone?: string | null;
}

export interface UserRead extends UserBase {
  id: string;
  role: UserRole;
  account_status: AccountStatus;
  is_email_verified: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export type GenderPreference = "MALE_ONLY" | "FEMALE_ONLY" | "ANY";
export type ListingStatus = "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "UNLISTED" | "REJECTED";
export type AvailabilityStatus = "AVAILABLE" | "FULL" | "WAITLIST";
export type MediaType = "IMAGE" | "VIDEO" | "FLOOR_PLAN";
export type RoomSharingType = "SINGLE" | "TWIN" | "TRIPLE" | "FOUR_PLUS";

export interface AmenityRead {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface PGMediaRead {
  id: string;
  media_type: MediaType;
  storage_path: string;
  sort_order: number;
}

export interface PGMediaCreate {
  media_type: MediaType;
  storage_path: string;
  sort_order?: number;
}

export interface RoomTypeRead {
  id: string;
  sharing_type: RoomSharingType;
  price_per_month: number;
  total_beds: number;
  available_beds: number;
}

export interface RoomTypeCreate {
  sharing_type: RoomSharingType;
  price_per_month: number;
  total_beds?: number;
  available_beds?: number;
}

export interface PGListingBase {
  name: string;
  description?: string | null;
  area: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  price_from: number;
  price_to?: number | null;
  security_deposit?: number | null;
  gender_preference?: GenderPreference;
  house_rules?: string | null;
  available_from?: string | null;
}

export interface PGListingCreate extends PGListingBase {
  room_types?: RoomTypeCreate[];
  amenity_ids?: string[];
  media?: PGMediaCreate[];
}

export interface PGListingUpdate {
  name?: string | null;
  description?: string | null;
  area?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_from?: number | null;
  price_to?: number | null;
  security_deposit?: number | null;
  gender_preference?: GenderPreference | null;
  house_rules?: string | null;
  available_from?: string | null;
  status?: ListingStatus | null;
}

export interface PGListingRead extends PGListingBase {
  id: string;
  slug: string;
  owner_id: string;
  availability_status: AvailabilityStatus;
  status: ListingStatus;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  media: PGMediaRead[];
  room_types: RoomTypeRead[];
}

export interface PGListingSearchResult {
  items: PGListingRead[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export type Occupation = "STUDENT" | "WORKING_PROFESSIONAL" | "FREELANCER" | "OTHER";
export type FoodPreference = "VEG" | "NON_VEG" | "VEGAN" | "JAIN" | "ANY";
export type SleepSchedule = "EARLY_BIRD" | "NIGHT_OWL" | "FLEXIBLE";
export type SmokingPreference = "NO_SMOKING" | "SMOKER_OK" | "OUTSIDE_ONLY";
export type ProfileVisibility = "PUBLIC" | "PRIVATE" | "CONNECTIONS_ONLY";

export interface RoommateProfileBase {
  bio?: string | null;
  occupation?: Occupation | null;
  company_or_college?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_areas: string[];
  move_in_date?: string | null;
  move_in_flexible?: boolean;
  food_preference?: FoodPreference;
  sleep_schedule?: SleepSchedule;
  smoking_preference?: SmokingPreference;
  has_pets?: boolean;
  ok_with_pets?: boolean;
  is_discoverable?: boolean;
  profile_visibility?: ProfileVisibility;
}

export interface RoommateProfileCreate extends RoommateProfileBase {}

export interface RoommateProfileUpdate {
  bio?: string | null;
  occupation?: Occupation | null;
  company_or_college?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_areas?: string[] | null;
  move_in_date?: string | null;
  move_in_flexible?: boolean | null;
  food_preference?: FoodPreference | null;
  sleep_schedule?: SleepSchedule | null;
  smoking_preference?: SmokingPreference | null;
  has_pets?: boolean | null;
  ok_with_pets?: boolean | null;
  is_discoverable?: boolean | null;
  profile_visibility?: ProfileVisibility | null;
}

export interface RoommateProfileRead extends RoommateProfileBase {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: UserRead | null;
}

export interface MatchScoreDetails {
  budget: number;
  location: number;
  lifestyle: number;
  move_in: number;
}

export interface MatchResult {
  candidate: RoommateProfileRead;
  overall_score: number;
  score_details: MatchScoreDetails;
  matched_areas: string[];
}

export interface MatchResponse {
  matches: MatchResult[];
  total: number;
}

export type InterestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
export type NotificationType =
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "NEW_MESSAGE"
  | "INTEREST_RECEIVED"
  | "LISTING_APPROVED"
  | "LISTING_REJECTED"
  | "SYSTEM";
export type ReportReason = "SPAM" | "HARASSMENT" | "FRAUD" | "INAPPROPRIATE_CONTENT" | "OTHER";

export interface SavedPGRead {
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: PGListingRead;
}

export interface InterestCreate {
  message?: string | null;
  preferred_date?: string | null;
  phone?: string | null;
}

export interface InterestRead {
  id: string;
  user_id: string;
  listing_id: string;
  status: InterestStatus;
  message?: string | null;
  created_at: string;
}

export interface ConnectionCreate {
  receiver_id: string;
}

export interface ConnectionUpdate {
  status: ConnectionStatus;
}

export interface ConnectionRead {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ConnectionStatus;
  created_at: string;
  updated_at: string;
}

export interface MessageCreate {
  body: string;
}

export interface MessageRead {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at?: string | null;
  created_at: string;
}

export interface ConversationRead {
  id: string;
  listing_id?: string | null;
  created_at: string;
  latest_message?: MessageRead | null;
  unread_count: number;
  other_participant?: UserRead;
}

export interface NotificationRead {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  resource_type?: string | null;
  resource_id?: string | null;
  read_at?: string | null;
  created_at: string;
}

export interface ReportCreate {
  reported_user_id?: string | null;
  reported_listing_id?: string | null;
  reason: ReportReason;
  details?: string | null;
}

export interface ReportRead {
  id: string;
  reporter_id: string;
  reported_user_id?: string | null;
  reported_listing_id?: string | null;
  reason: ReportReason;
  details?: string | null;
  resolved_at?: string | null;
  created_at: string;
}
