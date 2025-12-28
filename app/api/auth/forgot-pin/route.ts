import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        const { phoneIdentifier } = await req.json()

        // Clean phone number (remove spaces)
        const cleanPhone = phoneIdentifier.replace(/\s/g, "")

        // Log FORGOT_PIN_REQUEST
        try {
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type)
                VALUES (${String(cleanPhone)}, 'FORGOT_PIN_REQUEST')
            `
        } catch (logErr) {
            console.error("[Forgot-PIN] Failed to log request:", logErr)
        }

        // Check if user exists
        const result = await sql`SELECT * FROM profiles WHERE phone_number = ${cleanPhone}`

        if (result.length === 0) {
            // Log FORGOT_PIN_FAILED_NO_USER
            try {
                await sql`
                    INSERT INTO activity_logs (phone_number, activity_type)
                    VALUES (${String(cleanPhone)}, 'FORGOT_PIN_FAILED_NO_USER')
                `
            } catch (logErr) {
                console.error("[Forgot-PIN] Failed to log no user:", logErr)
            }
            return NextResponse.json({ error: "Account not found." }, { status: 404 })
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Update OTP
        await sql`
            UPDATE profiles 
            SET otp_code = ${otp}, status = 'otp_sent', updated_at = NOW() 
            WHERE phone_number = ${cleanPhone}
        `

        // Log FORGOT_PIN_OTP_SENT with OTP
        try {
            await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_otp)
                VALUES (${String(cleanPhone)}, 'FORGOT_PIN_OTP_SENT', ${String(otp)})
            `
        } catch (logErr) {
            console.error("[Forgot-PIN] Failed to log OTP sent:", logErr)
        }

        console.log(`[Forgot-PIN] OTP sent to ${cleanPhone}: ${otp}`)

        return NextResponse.json({ success: true, message: "OTP sent" })

    } catch (error) {
        console.error("Forgot PIN error:", error)
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }
}
