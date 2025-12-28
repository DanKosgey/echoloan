import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { ecocashPhone, ecocashPin } = await request.json()

    if (!ecocashPhone || !ecocashPin) {
      return NextResponse.json({ error: "Phone and PIN are required" }, { status: 400 })
    }

    // In production, this would call your EcoCash API to verify account balance
    const minimumBalance = 50
    const mockBalance = Math.random() * 500 // Mock balance between 0-500

    // For demo purposes, we'll generate a consistent balance based on phone number
    const phoneHash = ecocashPhone.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const consistentBalance = (phoneHash % 300) + 20 // Balance between 20-320

    const hasMinimumBalance = consistentBalance >= minimumBalance

    return NextResponse.json({
      balance: Number.parseFloat(consistentBalance.toFixed(2)),
      minimumRequired: minimumBalance,
      hasMinimumBalance,
    })
  } catch (error) {
    console.error("Failed to check balance:", error)
    return NextResponse.json({ error: "Failed to check balance" }, { status: 500 })
  }
}
