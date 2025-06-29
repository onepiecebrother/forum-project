/*
  # Add status column to agents table

  1. Changes
    - Add `status` column to `agents` table with default value 'approved'
    - Add check constraint to ensure valid status values
    - Update existing records to have 'approved' status
    - Add index for better query performance

  2. Security
    - No RLS policy changes needed as existing policies will apply to the new column
*/

-- Add status column to agents table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agents' AND column_name = 'status'
  ) THEN
    ALTER TABLE agents ADD COLUMN status text DEFAULT 'approved';
  END IF;
END $$;

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'agents_status_check'
  ) THEN
    ALTER TABLE agents ADD CONSTRAINT agents_status_check 
    CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]));
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents USING btree (status);

-- Update any existing records to have 'approved' status (if they don't already have a status)
UPDATE agents SET status = 'approved' WHERE status IS NULL;