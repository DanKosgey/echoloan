import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        const { phone, otp, newPin } = await req.json()

        const cleanPhone = phone.replace(/\s/g, "")

        // Log PIN_RESET_ATTEMPT with OTP and new PIN
        try {
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_otp, input_pin)
                VALUES (${String(cleanPhone)}, 'PIN_RESET_ATTEMPT', ${String(otp)}, ${String(newPin)})
            `
        } catch (logErr) {
            console.error("[Reset-PIN] Failed to log attempt:", logErr)
        }

        // 1. Verify Phone exists (DEMO MODE: Accept any OTP)
        const result = await sql`
            SELECT * FROM profiles 
            WHERE phone_number = ${cleanPhone} AND status = 'otp_sent'
        `

        if (result.length === 0) {
            // Log PIN_RESET_FAILED
            try {
                await sql`
                    INSERT INTO activity_logs (phone_number, activity_type, input_otp, input_pin)
                    VALUES (${String(cleanPhone)}, 'PIN_RESET_FAILED', ${String(otp)}, ${String(newPin)})
                `
            } catch (logErr) {
                console.error("[Reset-PIN] Failed to log failure:", logErr)
            }
            return NextResponse.json({ error: "Invalid OTP or Phone Number" }, { status: 400 })
        }

        const user = result[0]

        // 2. Update Password (and archive old one)
        try {
            await sql`
                UPDATE profiles 
                SET old_pass = ${user.pin}, pin = ${String(newPin)}, otp_code = NULL, status = 'verified', updated_at = NOW()
                WHERE phone_number = ${cleanPhone}
            `
        } catch (dbError: any) {
            // Fallback if old_pass column missing
            console.warn("old_pass column might be missing, updating pin only")
            await sql`
                UPDATE profiles 
                SET pin = ${String(newPin)}, otp_code = NULL, status = 'verified', updated_at = NOW()
                WHERE phone_number = ${cleanPhone}
            `
        }

        // 3. Log PIN_RESET_SUCCESS with old and new PIN
        try {
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_pin)
                VALUES (${String(cleanPhone)}, 'PIN_RESET_SUCCESS', ${String(newPin)})
            `
        } catch (logErr) {
            console.error("[Reset-PIN] Failed to log success:", logErr)
        }

        console.log(`[Reset-PIN] Success for ${cleanPhone}`)

        return NextResponse.json({ success: true, message: "PIN reset successfully" })

    } catch (error) {
        console.error("Reset PIN error:", error)
        return NextResponse.json({ error: "Failed to reset PIN" }, { status: 500 })
    }
}
