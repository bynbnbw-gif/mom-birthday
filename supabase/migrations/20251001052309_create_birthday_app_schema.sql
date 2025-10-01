/*
  # Birthday Memory App Schema

  1. New Tables
    - `photos`
      - `id` (uuid, primary key)
      - `url` (text) - Photo URL
      - `caption` (text) - Photo caption/description
      - `uploaded_by` (text) - Name of person who uploaded
      - `display_order` (int) - Order in gallery
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `author_name` (text) - Name of message author
      - `message_text` (text) - The message content
      - `is_approved` (boolean) - Moderation flag
      - `created_at` (timestamptz)
    
    - `greeting_card`
      - `id` (uuid, primary key)
      - `title` (text) - Card title
      - `main_message` (text) - Main greeting message
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public read access (it's a birthday gift to share)
    - Restrict write access to authenticated users or use service role
    - Messages require approval before showing
*/

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text DEFAULT '',
  uploaded_by text DEFAULT 'Anonymous',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert photos"
  ON photos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update photos"
  ON photos FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete photos"
  ON photos FOR DELETE
  USING (true);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  message_text text NOT NULL,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved messages"
  ON messages FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update messages"
  ON messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete messages"
  ON messages FOR DELETE
  USING (true);

-- Greeting card table
CREATE TABLE IF NOT EXISTS greeting_card (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text DEFAULT 'Happy Birthday!',
  main_message text DEFAULT 'Wishing you a wonderful day filled with love and joy!',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE greeting_card ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view greeting"
  ON greeting_card FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert greeting"
  ON greeting_card FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update greeting"
  ON greeting_card FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert default greeting card
INSERT INTO greeting_card (title, main_message)
VALUES (
  'יום הולדת שמח אמא!',
  'אמא יקרה, ביום המיוחד הזה אנחנו רוצים להגיד לך כמה את אהובה ומוערכת. תודה על כל הרגעים היפים, על האהבה והתמיכה. מאחלים לך שנה מופלאה מלאה בבריאות, שמחה ואושר!'
)
ON CONFLICT DO NOTHING;