-- Create registrations table to store verified EcoCash users
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  ecocash_phone VARCHAR(20) NOT NULL,
  ecocash_pin VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6),
  verified_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(ecocash_phone);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
