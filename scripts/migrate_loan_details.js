require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function runMigrations() {
    console.log('Running loan details migration...')

    try {
        // Add new columns to loans table
        await sql`
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS purpose VARCHAR(100);
        `
        console.log('Added purpose column')

        await sql`
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30;
        `
        console.log('Added duration_days column')

        await sql`
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50);
        `
        console.log('Added employment_status column')

        await sql`
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS monthly_income NUMERIC(15, 2);
        `
        console.log('Added monthly_income column')

        await sql`
            ALTER TABLE loans ADD COLUMN IF NOT EXISTS national_id VARCHAR(50);
        `
        console.log('Added national_id column')

        console.log('Loan details migration completed successfully!')
    } catch (error) {
        console.error('Migration failed:', error)
        process.exit(1)
    }
}

runMigrations()
