/*
  # Complete Database Schema Migration
  
  This migration ensures all required tables, columns, and constraints exist
  while handling cases where some objects may already be present.
  
  1. Tables
     - All forum tables with proper relationships
     - Agent profiles and deal management
     - Review and assessment system
  
  2. Security
     - Row Level Security policies
     - Proper access controls
  
  3. Functions and Triggers
     - Auto-update timestamps
     - Post count tracking
     - Edit tracking
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username text UNIQUE NOT NULL,
      avatar_url text,
      bio text DEFAULT '',
      post_count integer DEFAULT 0,
      reputation integer DEFAULT 0,
      is_verified boolean DEFAULT false,
      is_admin boolean DEFAULT false,
      is_owner boolean DEFAULT false,
      is_banned boolean DEFAULT false,
      honorable_title text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add missing columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_owner') THEN
    ALTER TABLE profiles ADD COLUMN is_owner boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_banned') THEN
    ALTER TABLE profiles ADD COLUMN is_banned boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'honorable_title') THEN
    ALTER TABLE profiles ADD COLUMN honorable_title text;
  END IF;
END $$;

-- Create categories table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
    CREATE TABLE categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      description text DEFAULT '',
      color text DEFAULT '#3b82f6',
      sort_order integer DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create threads table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'threads') THEN
    CREATE TABLE threads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      content text NOT NULL,
      author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      is_pinned boolean DEFAULT false,
      is_locked boolean DEFAULT false,
      is_edited boolean DEFAULT false,
      edited_at timestamptz,
      edit_count integer DEFAULT 0,
      views integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add missing columns to threads if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'threads' AND column_name = 'is_edited') THEN
    ALTER TABLE threads ADD COLUMN is_edited boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'threads' AND column_name = 'edited_at') THEN
    ALTER TABLE threads ADD COLUMN edited_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'threads' AND column_name = 'edit_count') THEN
    ALTER TABLE threads ADD COLUMN edit_count integer DEFAULT 0;
  END IF;
END $$;

-- Create posts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
    CREATE TABLE posts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      content text NOT NULL,
      author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
      is_edited boolean DEFAULT false,
      edited_at timestamptz,
      edit_count integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add missing columns to posts if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'is_edited') THEN
    ALTER TABLE posts ADD COLUMN is_edited boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'edited_at') THEN
    ALTER TABLE posts ADD COLUMN edited_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'edit_count') THEN
    ALTER TABLE posts ADD COLUMN edit_count integer DEFAULT 0;
  END IF;
END $$;

-- Create site_settings table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    CREATE TABLE site_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      site_title text DEFAULT 'Elite Forum',
      site_logo_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create verification_requests table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'verification_requests') THEN
    CREATE TABLE verification_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      content text NOT NULL,
      images text[] DEFAULT '{}',
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      admin_notes text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create admin_requests table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_requests') THEN
    CREATE TABLE admin_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      content text NOT NULL,
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      admin_notes text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create agents table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents') THEN
    CREATE TABLE agents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      profile_picture text,
      height text,
      weight text,
      current_location text,
      services text[] DEFAULT '{}',
      pricing_short_time text,
      pricing_long_time text,
      pricing_overnight text,
      pricing_private text,
      description text,
      social_twitter text,
      social_instagram text,
      social_facebook text,
      social_telegram text,
      tags text[] DEFAULT '{}',
      status text DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add missing status column to agents if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agents' AND column_name = 'status') THEN
    ALTER TABLE agents ADD COLUMN status text DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Create deals table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deals') THEN
    CREATE TABLE deals (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      initiator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text NOT NULL,
      deal_type text DEFAULT 'other' CHECK (deal_type IN ('hire_agent', 'transaction', 'other')),
      initiator_images text[] DEFAULT '{}',
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'approved', 'rejected', 'cancelled')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create deal_responses table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deal_responses') THEN
    CREATE TABLE deal_responses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      content text NOT NULL,
      images text[] DEFAULT '{}',
      response_type text NOT NULL CHECK (response_type IN ('recipient_response', 'admin_approval')),
      is_approved boolean,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create deal_reviews table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deal_reviews') THEN
    CREATE TABLE deal_reviews (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
      reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
      review_text text NOT NULL,
      created_at timestamptz DEFAULT now(),
      UNIQUE(deal_id, reviewer_id)
    );
  END IF;
END $$;

-- Create review_assessments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_assessments') THEN
    CREATE TABLE review_assessments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      review_id uuid UNIQUE NOT NULL REFERENCES deal_reviews(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      reason text,
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      admin_notes text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_threads_category_id ON threads(category_id);
CREATE INDEX IF NOT EXISTS idx_threads_author_id ON threads(author_id);
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_thread_id ON posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_location ON agents(current_location);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_deals_initiator_id ON deals(initiator_id);
CREATE INDEX IF NOT EXISTS idx_deals_recipient_id ON deals(recipient_id);
CREATE INDEX IF NOT EXISTS idx_deal_reviews_reviewee_id ON deal_reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_deal_reviews_created_at ON deal_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_reviews_deal_id ON deal_reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_review_assessments_review_id ON review_assessments(review_id);
CREATE INDEX IF NOT EXISTS idx_review_assessments_user_id ON review_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_review_assessments_status ON review_assessments(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Create utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET post_count = GREATEST(0, post_count - 1) WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION track_thread_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.title != NEW.title OR OLD.content != NEW.content THEN
    NEW.is_edited = true;
    NEW.edited_at = now();
    NEW.edit_count = OLD.edit_count + 1;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION track_post_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content != NEW.content THEN
    NEW.is_edited = true;
    NEW.edited_at = now();
    NEW.edit_count = OLD.edit_count + 1;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_threads_updated_at ON threads;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
DROP TRIGGER IF EXISTS update_verification_requests_updated_at ON verification_requests;
DROP TRIGGER IF EXISTS update_admin_requests_updated_at ON admin_requests;
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
DROP TRIGGER IF EXISTS update_review_assessments_updated_at ON review_assessments;
DROP TRIGGER IF EXISTS track_thread_edit_trigger ON threads;
DROP TRIGGER IF EXISTS track_post_edit_trigger ON posts;
DROP TRIGGER IF EXISTS update_post_count_on_thread_insert ON threads;
DROP TRIGGER IF EXISTS update_post_count_on_thread_delete ON threads;
DROP TRIGGER IF EXISTS update_post_count_on_post_insert ON posts;
DROP TRIGGER IF EXISTS update_post_count_on_post_delete ON posts;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at 
  BEFORE UPDATE ON threads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at 
  BEFORE UPDATE ON verification_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_requests_updated_at 
  BEFORE UPDATE ON admin_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON deals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_assessments_updated_at 
  BEFORE UPDATE ON review_assessments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER track_thread_edit_trigger 
  BEFORE UPDATE ON threads 
  FOR EACH ROW EXECUTE FUNCTION track_thread_edit();

CREATE TRIGGER track_post_edit_trigger 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION track_post_edit();

CREATE TRIGGER update_post_count_on_thread_insert 
  AFTER INSERT ON threads 
  FOR EACH ROW EXECUTE FUNCTION update_post_count();

CREATE TRIGGER update_post_count_on_thread_delete 
  AFTER DELETE ON threads 
  FOR EACH ROW EXECUTE FUNCTION update_post_count();

CREATE TRIGGER update_post_count_on_post_insert 
  AFTER INSERT ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_post_count();

CREATE TRIGGER update_post_count_on_post_delete 
  AFTER DELETE ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_post_count();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE TO public USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" 
  ON profiles FOR UPDATE TO public USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Drop existing category policies
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins and owners can manage categories" ON categories;

-- Categories policies
CREATE POLICY "Anyone can view categories" 
  ON categories FOR SELECT TO public USING (true);

CREATE POLICY "Only admins and owners can manage categories" 
  ON categories FOR ALL TO public USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing thread policies
DROP POLICY IF EXISTS "Anyone can view threads" ON threads;
DROP POLICY IF EXISTS "Non-banned users can create threads" ON threads;
DROP POLICY IF EXISTS "Authors can update their threads" ON threads;
DROP POLICY IF EXISTS "Authors can delete their threads" ON threads;
DROP POLICY IF EXISTS "Admins can delete any thread" ON threads;

-- Threads policies
CREATE POLICY "Anyone can view threads" 
  ON threads FOR SELECT TO public USING (true);

CREATE POLICY "Non-banned users can create threads" 
  ON threads FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_banned = false OR is_banned IS NULL))
  );

CREATE POLICY "Authors can update their threads" 
  ON threads FOR UPDATE TO public USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their threads" 
  ON threads FOR DELETE TO public USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any thread" 
  ON threads FOR DELETE TO public USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing post policies
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Non-banned users can create posts" ON posts;
DROP POLICY IF EXISTS "Authors can update their posts" ON posts;
DROP POLICY IF EXISTS "Authors can delete their posts" ON posts;
DROP POLICY IF EXISTS "Admins can delete any post" ON posts;

-- Posts policies
CREATE POLICY "Anyone can view posts" 
  ON posts FOR SELECT TO public USING (true);

CREATE POLICY "Non-banned users can create posts" 
  ON posts FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_banned = false OR is_banned IS NULL))
  );

CREATE POLICY "Authors can update their posts" 
  ON posts FOR UPDATE TO public USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts" 
  ON posts FOR DELETE TO public USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any post" 
  ON posts FOR DELETE TO public USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing site settings policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Only owners can update site settings" ON site_settings;

-- Site settings policies
CREATE POLICY "Anyone can view site settings" 
  ON site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Only owners can update site settings" 
  ON site_settings FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_owner = true)
  );

-- Drop existing verification request policies
DROP POLICY IF EXISTS "Users can create their own verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Users can view their own verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Admins can view all verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Admins can update verification requests" ON verification_requests;

-- Verification requests policies
CREATE POLICY "Users can create their own verification requests" 
  ON verification_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own verification requests" 
  ON verification_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all verification requests" 
  ON verification_requests FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

CREATE POLICY "Admins can update verification requests" 
  ON verification_requests FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing admin request policies
DROP POLICY IF EXISTS "Users can create their own admin requests" ON admin_requests;
DROP POLICY IF EXISTS "Users can view their own admin requests" ON admin_requests;
DROP POLICY IF EXISTS "Owners can view all admin requests" ON admin_requests;
DROP POLICY IF EXISTS "Owners can update admin requests" ON admin_requests;

-- Admin requests policies
CREATE POLICY "Users can create their own admin requests" 
  ON admin_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own admin requests" 
  ON admin_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all admin requests" 
  ON admin_requests FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_owner = true)
  );

CREATE POLICY "Owners can update admin requests" 
  ON admin_requests FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_owner = true)
  );

-- Drop existing agent policies
DROP POLICY IF EXISTS "Public can view all agents" ON agents;
DROP POLICY IF EXISTS "Verified users can create agent profiles" ON agents;
DROP POLICY IF EXISTS "Users can update own agent profiles" ON agents;
DROP POLICY IF EXISTS "Users can delete own agent profiles" ON agents;
DROP POLICY IF EXISTS "Admins can delete agent profiles" ON agents;

-- Agents policies
CREATE POLICY "Public can view all agents" 
  ON agents FOR SELECT TO public USING (true);

CREATE POLICY "Verified users can create agent profiles" 
  ON agents FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_verified = true AND (is_banned = false OR is_banned IS NULL))
  );

CREATE POLICY "Users can update own agent profiles" 
  ON agents FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agent profiles" 
  ON agents FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete agent profiles" 
  ON agents FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing deal policies
DROP POLICY IF EXISTS "Users can view deals they are involved in" ON deals;
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
DROP POLICY IF EXISTS "Non-banned users can create deals" ON deals;
DROP POLICY IF EXISTS "Deal participants can update deals" ON deals;
DROP POLICY IF EXISTS "Admins can update all deals" ON deals;

-- Deals policies
CREATE POLICY "Users can view deals they are involved in" 
  ON deals FOR SELECT TO authenticated USING (
    auth.uid() = initiator_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Admins can view all deals" 
  ON deals FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

CREATE POLICY "Non-banned users can create deals" 
  ON deals FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = initiator_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_banned = false OR is_banned IS NULL))
  );

CREATE POLICY "Deal participants can update deals" 
  ON deals FOR UPDATE TO authenticated USING (
    auth.uid() = initiator_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Admins can update all deals" 
  ON deals FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing deal response policies
DROP POLICY IF EXISTS "Users can view responses for their deals" ON deal_responses;
DROP POLICY IF EXISTS "Admins can view all deal responses" ON deal_responses;
DROP POLICY IF EXISTS "Users can create responses for their deals" ON deal_responses;
DROP POLICY IF EXISTS "Admins can create deal responses" ON deal_responses;

-- Deal responses policies
CREATE POLICY "Users can view responses for their deals" 
  ON deal_responses FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND (initiator_id = auth.uid() OR recipient_id = auth.uid()))
  );

CREATE POLICY "Admins can view all deal responses" 
  ON deal_responses FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

CREATE POLICY "Users can create responses for their deals" 
  ON deal_responses FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM deals WHERE id = deal_id AND (initiator_id = auth.uid() OR recipient_id = auth.uid())) OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
    )
  );

CREATE POLICY "Admins can create deal responses" 
  ON deal_responses FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Drop existing deal review policies
DROP POLICY IF EXISTS "Anyone can view deal reviews" ON deal_reviews;
DROP POLICY IF EXISTS "Deal participants can create reviews for approved deals" ON deal_reviews;
DROP POLICY IF EXISTS "Reviewers can update their own reviews" ON deal_reviews;
DROP POLICY IF EXISTS "Reviewers can delete their own reviews" ON deal_reviews;

-- Deal reviews policies
CREATE POLICY "Anyone can view deal reviews" 
  ON deal_reviews FOR SELECT TO public USING (true);

CREATE POLICY "Deal participants can create reviews for approved deals" 
  ON deal_reviews FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = reviewer_id AND 
    EXISTS (
      SELECT 1 FROM deals 
      WHERE id = deal_id AND status = 'approved' AND 
      (initiator_id = auth.uid() OR recipient_id = auth.uid()) AND
      (initiator_id = reviewee_id OR recipient_id = reviewee_id) AND
      initiator_id != recipient_id
    )
  );

CREATE POLICY "Reviewers can update their own reviews" 
  ON deal_reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can delete their own reviews" 
  ON deal_reviews FOR DELETE TO authenticated USING (auth.uid() = reviewer_id);

-- Drop existing review assessment policies
DROP POLICY IF EXISTS "Users can view their own review assessments" ON review_assessments;
DROP POLICY IF EXISTS "Admins can view all review assessments" ON review_assessments;
DROP POLICY IF EXISTS "Users can create assessments for reviews about them" ON review_assessments;
DROP POLICY IF EXISTS "Admins can update review assessments" ON review_assessments;

-- Review assessments policies
CREATE POLICY "Users can view their own review assessments" 
  ON review_assessments FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all review assessments" 
  ON review_assessments FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

CREATE POLICY "Users can create assessments for reviews about them" 
  ON review_assessments FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM deal_reviews 
      WHERE id = review_id AND reviewee_id = auth.uid() AND rating >= 1 AND rating <= 4
    )
  );

CREATE POLICY "Admins can update review assessments" 
  ON review_assessments FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = true OR is_owner = true))
  );

-- Insert default data if it doesn't exist
INSERT INTO site_settings (site_title) 
SELECT 'Elite Forum' 
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Insert default categories if they don't exist
INSERT INTO categories (name, description, color, sort_order) 
SELECT * FROM (VALUES
  ('General Discussion', 'General topics and conversations', '#3b82f6', 1),
  ('Announcements', 'Important announcements and updates', '#ef4444', 2),
  ('Support', 'Help and support topics', '#10b981', 3),
  ('Off Topic', 'Casual conversations and off-topic discussions', '#8b5cf6', 4)
) AS new_categories(name, description, color, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = new_categories.name);