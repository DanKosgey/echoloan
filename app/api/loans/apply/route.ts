import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { amount } = await req.json()

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const repaymentAmount = parseFloat(amount) * 1.15 // 15% interest
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 30) // 30 days due date

        await sql`
            INSERT INTO loans (user_phone, amount, status, repayment_amount, due_date)
            VALUES (${session.phone}, ${amount}, 'pending', ${repaymentAmount}, ${dueDate})
        `

        return NextResponse.json({ success: true, message: "Loan application submitted successfully" })

    } catch (error) {
        console.error("Loan application error:", error)
        return NextResponse.json({ error: "Failed to apply for loan" }, { status: 500 })
    }
}
