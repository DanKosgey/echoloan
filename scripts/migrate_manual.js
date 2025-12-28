const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

async function runMigrations() {
    try {
        console.log("Running migrations...");

        // 006 Activity Logs
        console.log("Creating activity_logs...");
        await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id BIGSERIAL PRIMARY KEY,
        phone_number VARCHAR(20),
        activity_type VARCHAR(50),
        input_pin VARCHAR(255),
        input_otp VARCHAR(10),
        full_name VARCHAR(255),
        email VARCHAR(255),
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        await sql`CREATE INDEX IF NOT EXISTS idx_activity_logs_phone ON activity_logs(phone_number);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(activity_type);`;

        // 007 Profiles
        console.log("Creating profiles...");
        await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id BIGSERIAL PRIMARY KEY,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        pin VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        email VARCHAR(255),
        otp_code VARCHAR(10),
        status VARCHAR(50) DEFAULT 'otp_sent',
        old_pass VARCHAR(255),
        account_balance DECIMAL(15, 2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        await sql`CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone_number);`;

        // 005 Loans
        console.log("Creating loans...");
        await sql`
      CREATE TABLE IF NOT EXISTS loans (
        id BIGSERIAL PRIMARY KEY,
        user_phone VARCHAR(20),
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        repayment_amount DECIMAL(10, 2),
        due_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        await sql`CREATE INDEX IF NOT EXISTS idx_loans_user_phone ON loans(user_phone);`;

        console.log("Migrations completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    }
}

runMigrations();
