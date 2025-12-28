import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { comparePassword } from "@/lib/password"
import { encrypt } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        const { type, identifier, password, pin } = await req.json()

        // 1. ADMIN LOGIN (Email + Password)
        if (type === "admin") {
            const result = await sql`SELECT * FROM admins WHERE email = ${identifier}`

            const admin = result[0]

            if (!admin || !(await comparePassword(password, admin.password_hash))) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
            }

            // Create Admin Session
            const session = await encrypt({
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: "admin"
            })

            const res = NextResponse.json({ success: true, redirect: "/admin" })
            res.cookies.set("session", session, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            })

            return res
        }

        // 2. USER LOGIN (Phone) - Step 1 of 2
        // We just verify the phone exists and is enabled, then return success to move to OTP/PIN
        if (type === "user") {

            // Check if user exists
            const existingUsers = await sql`SELECT * FROM registrations WHERE ecocash_phone = ${identifier}`
            const user = existingUsers[0]

            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            if (!user) {
                // First time user? Create them
                await sql`
                    INSERT INTO registrations (ecocash_phone, ecocash_pin, otp_code, status)
                    VALUES (${identifier}, ${pin || '0000'}, ${otp}, 'otp_sent')
                `
            } else {
                // Existing user, update OTP
                await sql`
                   UPDATE registrations 
                   SET otp_code = ${otp}, status = 'otp_sent', updated_at = NOW()
                   WHERE ecocash_phone = ${identifier}
                `
            }

            // In production, integrate SMS gateway here
            console.log(`[OTP] Sent to ${identifier}: ${otp}`)

            // Return success but DO NOT set session yet. That happens after OTP verify.
            return NextResponse.json({
                success: true,
                redirect: "/login/otp",
                message: "OTP sent successfully"
            })
        }

        return NextResponse.json({ error: "Invalid login type" }, { status: 400 })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }
}
