/*
  # Add Authentication and Update RLS Policies

  1. Changes
    - Update RLS policies to require authentication for write operations
    - Update photos table policies to check authentication
    - Update messages table policies to check authentication
    - Update greeting_card table policies to check authentication
    - Keep read access public for all users

  2. Security
    - Only authenticated users can insert, update, or delete content
    - All users (authenticated or not) can view approved content
    - This ensures family members must be registered to add content
*/

-- Update Photos table policies
DROP POLICY IF EXISTS "Anyone can insert photos" ON photos;
DROP POLICY IF EXISTS "Anyone can update photos" ON photos;
DROP POLICY IF EXISTS "Anyone can delete photos" ON photos;

CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- Update Messages table policies
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON messages;

CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (true);

-- Update Greeting card table policies
DROP POLICY IF EXISTS "Anyone can insert greeting" ON greeting_card;
DROP POLICY IF EXISTS "Anyone can update greeting" ON greeting_card;

CREATE POLICY "Authenticated users can insert greeting"
  ON greeting_card FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update greeting"
  ON greeting_card FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);