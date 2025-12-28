import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const { ecocashPhone, ecocashPin, otp } = await req.json()

    if (!ecocashPhone || !ecocashPin || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql(
      `SELECT * FROM registrations 
       WHERE ecocash_phone = $1 AND otp_code = $2 AND status = 'otp_sent'`,
      [ecocashPhone, otp],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid OTP or phone number" }, { status: 401 })
    }

    const phoneHash = ecocashPhone.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const balance = (phoneHash % 300) + 20 // Balance between 20-320

    await sql(
      `UPDATE registrations 
       SET ecocash_pin = $1, status = 'verified', verified_at = NOW(), account_balance = $2, updated_at = NOW()
       WHERE ecocash_phone = $3`,
      [ecocashPin, balance, ecocashPhone],
    )

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
