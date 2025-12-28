-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id BIGSERIAL PRIMARY KEY,
  user_phone VARCHAR(20) REFERENCES registrations(ecocash_phone), -- Linking by phone for simplicity with current auth
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, repaid
  repayment_amount DECIMAL(10, 2),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching user loans
CREATE INDEX IF NOT EXISTS idx_loans_user_phone ON loans(user_phone);
