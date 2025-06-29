import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          bio: string;
          post_count: number;
          reputation: number;
          is_verified: boolean;
          is_admin: boolean;
          is_owner: boolean;
          is_banned: boolean;
          honorable_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string;
          post_count?: number;
          reputation?: number;
          is_verified?: boolean;
          is_admin?: boolean;
          is_owner?: boolean;
          is_banned?: boolean;
          honorable_title?: string | null;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          bio?: string;
          post_count?: number;
          reputation?: number;
          is_verified?: boolean;
          is_admin?: boolean;
          is_owner?: boolean;
          is_banned?: boolean;
          honorable_title?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          color: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          description?: string;
          color?: string;
          sort_order?: number;
        };
        Update: {
          name?: string;
          description?: string;
          color?: string;
          sort_order?: number;
        };
      };
      threads: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          category_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          views: number;
          is_edited: boolean;
          edited_at: string | null;
          edit_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          author_id: string;
          category_id: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          views?: number;
        };
        Update: {
          title?: string;
          content?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          views?: number;
        };
      };
      posts: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          thread_id: string;
          is_edited: boolean;
          edited_at: string | null;
          edit_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          author_id: string;
          thread_id: string;
        };
        Update: {
          content?: string;
        };
      };
      verification_requests: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          images: string[];
          status: 'pending' | 'approved' | 'rejected';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          images?: string[];
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
      };
      admin_requests: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          status: 'pending' | 'approved' | 'rejected';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_title: string;
          site_logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Update: {
          site_title?: string;
          site_logo_url?: string | null;
        };
      };
      deals: {
        Row: {
          id: string;
          initiator_id: string;
          recipient_id: string;
          title: string;
          description: string;
          initiator_images: string[];
          status: 'pending' | 'negotiating' | 'approved' | 'rejected' | 'cancelled';
          deal_type: 'hire_agent' | 'transaction' | 'other';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          initiator_id: string;
          recipient_id: string;
          title: string;
          description: string;
          initiator_images?: string[];
          status?: 'pending' | 'negotiating' | 'approved' | 'rejected' | 'cancelled';
          deal_type?: 'hire_agent' | 'transaction' | 'other';
        };
        Update: {
          status?: 'pending' | 'negotiating' | 'approved' | 'rejected' | 'cancelled';
        };
      };
      deal_responses: {
        Row: {
          id: string;
          deal_id: string;
          user_id: string;
          content: string;
          images: string[];
          response_type: 'recipient_response' | 'admin_approval';
          is_approved: boolean | null;
          created_at: string;
        };
        Insert: {
          deal_id: string;
          user_id: string;
          content: string;
          images?: string[];
          response_type: 'recipient_response' | 'admin_approval';
          is_approved?: boolean | null;
        };
      };
      deal_reviews: {
        Row: {
          id: string;
          deal_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          review_text: string;
          created_at: string;
        };
        Insert: {
          deal_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          review_text: string;
        };
        Update: {
          rating?: number;
          review_text?: string;
        };
      };
      review_assessments: {
        Row: {
          id: string;
          review_id: string;
          user_id: string;
          reason: string | null;
          status: 'pending' | 'approved' | 'rejected';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          review_id: string;
          user_id: string;
          reason?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          admin_notes?: string | null;
        };
      };
      agents: {
        Row: {
          id: string;
          user_id: string;
          profile_picture: string | null;
          height: string | null;
          weight: string | null;
          current_location: string | null;
          services: string[];
          pricing_short_time: string | null;
          pricing_long_time: string | null;
          pricing_overnight: string | null;
          pricing_private: string | null;
          description: string | null;
          social_twitter: string | null;
          social_instagram: string | null;
          social_facebook: string | null;
          social_telegram: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
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
        };
        Update: {
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
        };
      };
    };
  };
};