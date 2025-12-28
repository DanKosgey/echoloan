-- Create profiles table to act as the main user directory
CREATE TABLE IF NOT EXISTS profiles (
  id BIGSERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  pin VARCHAR(255) NOT NULL, -- Storing 4-digit PIN
  full_name VARCHAR(255),
  email VARCHAR(255),
  otp_code VARCHAR(10),
  status VARCHAR(50) DEFAULT 'otp_sent', -- otp_sent, verified, suspended
  account_balance DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast login lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number);
