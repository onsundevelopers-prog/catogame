-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- ─────────────────────────────────────────────
-- Create uploaded_games table (for Game Portal)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS uploaded_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  play_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending_review',  -- pending_review | approved | rejected
  review_token TEXT,                      -- secret token for admin review link
  reject_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_games ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);
CREATE POLICY "Anyone can add comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Policies for likes
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);
CREATE POLICY "Anyone can add likes" ON likes
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove their likes" ON likes
  FOR DELETE USING (true);

-- Policies for uploaded_games
CREATE POLICY "Anyone can view games" ON uploaded_games
  FOR SELECT USING (true);
CREATE POLICY "Anyone can upload games" ON uploaded_games
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Uploaders can delete their own games" ON uploaded_games
  FOR DELETE USING (uploader_id = current_setting('request.jwt.claims', true)::json->>'sub' OR true);

-- Indexes
CREATE INDEX IF NOT EXISTS comments_game_id_idx ON comments(game_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS likes_game_id_idx ON likes(game_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);
CREATE INDEX IF NOT EXISTS uploaded_games_created_at_idx ON uploaded_games(created_at DESC);
CREATE INDEX IF NOT EXISTS uploaded_games_uploader_idx ON uploaded_games(uploader_id);

-- ─────────────────────────────────────────────
-- Storage bucket for game files
-- Run this in the Supabase SQL editor:
-- ─────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('games', 'games', true)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Anyone can upload game files" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'games');

-- CREATE POLICY "Anyone can read game files" ON storage.objects
--   FOR SELECT USING (bucket_id = 'games');

-- CREATE POLICY "Uploaders can delete their files" ON storage.objects
--   FOR DELETE USING (bucket_id = 'games');
