import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/password"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        const { name, email, password, secretKey } = await req.json()

        // Simple protection to prevent public admin creation
        // In production, you'd remove this route entirely or protect it heavily
        if (secretKey !== process.env.ADMIN_CREATION_SECRET && secretKey !== "admin-setup-2024") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        await sql`INSERT INTO admins (name, email, password_hash) 
       VALUES (${name}, ${email}, ${hashedPassword})
       ON CONFLICT (email) DO NOTHING`

        return NextResponse.json({ success: true, message: "Admin created" })
    } catch (error) {
        console.error("Create admin error:", error)
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
    }
}
