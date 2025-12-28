-- Add full_name and email columns to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
