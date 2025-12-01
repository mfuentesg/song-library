-- Add content column for ChordPro lyrics
ALTER TABLE songs ADD COLUMN IF NOT EXISTS content TEXT;

-- Add settings column for capo and other song settings
ALTER TABLE songs ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Rename chord column to key
ALTER TABLE songs RENAME COLUMN chord TO key;
