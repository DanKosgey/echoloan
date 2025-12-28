-- Add old_pass column to profiles table for analytics and history
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS old_pass VARCHAR(255);
