import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        const { identifier, pin, fullName, email } = await req.json()

        // 1. Check if user already exists
        const existingUsers = await sql`SELECT * FROM registrations WHERE ecocash_phone = ${identifier} OR email = ${email}`

        if (existingUsers.length > 0) {
            return NextResponse.json({
                error: "Account with this phone or email already exists. Please login."
            }, { status: 409 })
        }

        // 2. Create new user
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await sql`
            INSERT INTO registrations (ecocash_phone, ecocash_pin, otp_code, status, full_name, email)
            VALUES (${identifier}, ${pin || '0000'}, ${otp}, 'otp_sent', ${fullName}, ${email})
        `

        // In production, integrate SMS gateway here
        console.log(`[OTP] Sent to ${identifier}: ${otp}`)

        return NextResponse.json({
            success: true,
            redirect: "/login/otp",
            message: "Account created successfully"
        })

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}
