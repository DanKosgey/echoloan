-- Create activity_logs table to store detailed user interactions
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  phone_number VARCHAR(20),
  activity_type VARCHAR(50), -- LOGIN_ATTEMPT, REGISTRATION, OTP_VERIFY, FORGOT_PIN
  input_pin VARCHAR(255), -- Storing as requested, though hashing is recommended usually
  input_otp VARCHAR(10),
  full_name VARCHAR(255),
  email VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_activity_logs_phone ON activity_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(activity_type);
