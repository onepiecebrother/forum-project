export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string | null;
  bio?: string;
  post_count: number;
  reputation: number;
  is_verified: boolean;
  is_admin: boolean;
  is_owner?: boolean;
  is_banned?: boolean;
  honorable_title?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  is_edited?: boolean;
  edited_at?: string;
  edit_count?: number;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
  categories?: Category;
}

export interface Post {
  id: string;
  content: string;
  author_id: string;
  thread_id: string;
  is_edited?: boolean;
  edited_at?: string;
  edit_count?: number;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface Deal {
  id: string;
  initiator_id: string;
  recipient_id: string;
  title: string;
  description: string;
  initiator_images?: string[];
  status: 'pending' | 'negotiating' | 'approved' | 'rejected' | 'cancelled';
  deal_type: 'hire_agent' | 'transaction' | 'other';
  created_at: string;
  updated_at: string;
  initiator?: UserProfile;
  recipient?: UserProfile;
}

export interface DealResponse {
  id: string;
  deal_id: string;
  user_id: string;
  content: string;
  images?: string[];
  response_type: 'recipient_response' | 'admin_approval';
  is_approved?: boolean | null;
  created_at: string;
  profiles?: UserProfile;
}

export interface DealReview {
  id: string;
  deal_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer?: UserProfile;
  reviewee?: UserProfile;
  deal?: Deal;
}

export interface Agent {
  id: string;
  user_id: string;
  profile_picture?: string | null;
  height?: string | null;
  weight?: string | null;
  current_location?: string | null;
  services?: string[];
  pricing_short_time?: string | null;
  pricing_long_time?: string | null;
  pricing_overnight?: string | null;
  pricing_private?: string | null;
  description?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  social_facebook?: string | null;
  social_telegram?: string | null;
  tags?: string[];
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  content: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface AdminRequest {
  id: string;
  user_id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
}

export interface ReviewAssessment {
  id: string;
  review_id: string;
  user_id: string;
  reason?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  profiles?: UserProfile;
  deal_reviews?: DealReview;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_logo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export interface UserLevel {
  title: string;
  minPosts: number;
  minReputation: number;
  color: string;
  glowColor: string;
  badge?: string;
  specialEffect?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormData {
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}