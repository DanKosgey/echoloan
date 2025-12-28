import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const { ecocashPhone } = await req.json()

    if (!ecocashPhone) {
      return NextResponse.json({ error: "Phone number required" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP temporarily (expires in 10 minutes)
    // In production, you would send this to the actual EcoCash API
    await sql(
      `INSERT INTO registrations (ecocash_phone, otp_code, status) 
       VALUES ($1, $2, $3)
       ON CONFLICT (ecocash_phone) DO UPDATE 
       SET otp_code = $2, updated_at = NOW()`,
      [ecocashPhone, otp, "otp_sent"],
    )

    // Here you would integrate with your EcoCash API to send SMS
    // For now, we're just storing it
    console.log(`[OTP] Sending OTP ${otp} to ${ecocashPhone}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent to your EcoCash phone number",
      // REMOVE THIS IN PRODUCTION - only for testing
      otp: otp,
    })
  } catch (error) {
    console.error("OTP send error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
