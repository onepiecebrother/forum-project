/*
  # Simplify agents table and policies

  1. Changes
    - Remove status and admin_notes columns from agents table
    - Simplify RLS policies to remove approval workflow
    - Allow public to view all agents
    - Maintain user ownership controls

  2. Security
    - Public can view all agent profiles
    - Verified users can create agent profiles
    - Users can manage their own agent profiles
    - Admins can delete any agent profiles for moderation
*/

-- Drop all existing agent policies first (including the one that depends on status column)
DROP POLICY IF EXISTS "Public can view approved agents" ON agents;
DROP POLICY IF EXISTS "Users can view own agent profiles" ON agents;
DROP POLICY IF EXISTS "Admins can view all agent profiles" ON agents;
DROP POLICY IF EXISTS "Verified non-banned users can create agent profiles" ON agents;
DROP POLICY IF EXISTS "Users can update own agent profiles" ON agents;
DROP POLICY IF EXISTS "Admins can update all agent profiles" ON agents;
DROP POLICY IF EXISTS "Admins can delete agent profiles" ON agents;
DROP POLICY IF EXISTS "Verified users can create agent profiles" ON agents;
DROP POLICY IF EXISTS "Public can view all agents" ON agents;
DROP POLICY IF EXISTS "Users can delete own agent profiles" ON agents;

-- Now safely remove the columns
DO $$
BEGIN
  -- Remove status column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'status'
  ) THEN
    ALTER TABLE agents DROP COLUMN status;
  END IF;
  
  -- Remove admin_notes column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE agents DROP COLUMN admin_notes;
  END IF;
END $$;

-- Create simplified agent policies

-- Allow public to view all agents (no status filtering needed)
CREATE POLICY "Public can view all agents"
  ON agents
  FOR SELECT
  TO public
  USING (true);

-- Allow verified users to create agent profiles
CREATE POLICY "Verified users can create agent profiles"
  ON agents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_verified = true
      AND (profiles.is_banned = false OR profiles.is_banned IS NULL)
    )
  );

-- Allow users to update their own agent profiles
CREATE POLICY "Users can update own agent profiles"
  ON agents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own agent profiles
CREATE POLICY "Users can delete own agent profiles"
  ON agents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to delete any agent profiles (for moderation)
CREATE POLICY "Admins can delete agent profiles"
  ON agents
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.is_admin = true OR profiles.is_owner = true)
    )
  );