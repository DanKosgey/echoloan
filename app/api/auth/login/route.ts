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
        if (type === "user") {
            // Log LOGIN_ATTEMPT with phone and PIN
            try {
                await sql`
                    INSERT INTO activity_logs (phone_number, activity_type, input_pin)
                    VALUES (${String(identifier)}, 'LOGIN_ATTEMPT', ${String(pin)})
                `
            } catch (logErr) {
                console.error("[Login] Logging failed:", logErr)
            }

            // Check if user exists in profiles
            const existingUsers = await sql`SELECT * FROM profiles WHERE phone_number = ${identifier}`
            const user = existingUsers[0]

            if (!user) {
                // Log LOGIN_FAILED_NO_USER
                try {
                    await sql`
                        INSERT INTO activity_logs (phone_number, activity_type, input_pin)
                        VALUES (${String(identifier)}, 'LOGIN_FAILED_NO_USER', ${String(pin)})
                    `
                } catch (logErr) {
                    console.error("[Login] Failed to log no user:", logErr)
                }
                return NextResponse.json({
                    error: "Account not found. Please Sign Up first."
                }, { status: 404 })
            }

            // Verify PIN
            if (user.pin !== pin) {
                // Log LOGIN_FAILED_WRONG_PIN
                try {
                    await sql`
                        INSERT INTO activity_logs (phone_number, activity_type, input_pin)
                        VALUES (${String(identifier)}, 'LOGIN_FAILED_WRONG_PIN', ${String(pin)})
                    `
                } catch (logErr) {
                    console.error("[Login] Failed to log wrong PIN:", logErr)
                }
                return NextResponse.json({
                    error: "Incorrect PIN."
                }, { status: 401 })
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            // Update OTP in profiles
            await sql`UPDATE profiles SET otp_code = ${otp}, status = 'otp_sent' WHERE phone_number = ${identifier}`

            // Log LOGIN_OTP_SENT with generated OTP
            try {
                await sql`
                    INSERT INTO activity_logs (phone_number, activity_type, input_otp)
                    VALUES (${String(identifier)}, 'LOGIN_OTP_SENT', ${String(otp)})
                `
            } catch (logErr) {
                console.error("[Login] Failed to log OTP sent:", logErr)
            }

            console.log(`[OTP] Sent to ${identifier}: ${otp}`)

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
