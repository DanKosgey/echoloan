-- Add account balance field to registrations table
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS account_balance DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS balance_verified BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_balance_verified ON registrations(balance_verified);
