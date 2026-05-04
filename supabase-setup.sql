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

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Create policies for comments (anyone can read, anyone can insert)
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Create policies for likes (anyone can read, anyone can insert/delete their own)
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add likes" ON likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can remove their likes" ON likes
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS comments_game_id_idx ON comments(game_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS likes_game_id_idx ON likes(game_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON likes(user_id);
