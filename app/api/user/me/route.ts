import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: Request) {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Fetch user details
        const users = await sql`
            SELECT phone_number as ecocash_phone, full_name, account_balance, status 
            FROM profiles 
            WHERE phone_number = ${session.phone}
        `
        const user = users[0]

        // Fetch user loans (update to check phone_number, though loans might need migration too, but user didn't ask for loans migration yet, keeping as is but ensuring types match)
        const loans = await sql`
            SELECT * FROM loans 
            WHERE user_phone = ${session.phone} 
            ORDER BY created_at DESC
        `

        return NextResponse.json({
            user: {
                ...user,
                loans: loans
            }
        })
    } catch (error) {
        console.error("Fetch user error:", error)
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }
}
