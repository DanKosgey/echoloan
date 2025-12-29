import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
    try {
        // Get session
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get("session")

        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const session = await decrypt(sessionCookie.value)
        if (!session?.phone) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 })
        }

        const {
            amount,
            purpose,
            duration,
            employmentStatus,
            monthlyIncome,
            nationalId
        } = await req.json()

        // Validation
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({ error: "Invalid loan amount" }, { status: 400 })
        }

        if (!purpose || !employmentStatus || !monthlyIncome || !nationalId) {
            return NextResponse.json({ error: "Please complete all required fields" }, { status: 400 })
        }

        // Calculate repayment (15% interest)
        const principal = Number(amount)
        const interest = principal * 0.15
        const repaymentAmount = principal + interest

        // Calculate due date based on duration
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + Number(duration || 30))

        // Insert loan application with additional details
        const result = await sql`
            INSERT INTO loans (
                user_phone, 
                amount, 
                repayment_amount, 
                due_date, 
                status,
                purpose,
                duration_days,
                employment_status,
                monthly_income,
                national_id
            )
            VALUES (
                ${String(session.phone)}, 
                ${principal}, 
                ${repaymentAmount}, 
                ${dueDate.toISOString()}, 
                'pending',
                ${String(purpose)},
                ${Number(duration || 30)},
                ${String(employmentStatus)},
                ${Number(monthlyIncome)},
                ${String(nationalId)}
            )
            RETURNING *
        `

        console.log(`[Loan] Application submitted: ${session.phone} - $${principal}`)

        return NextResponse.json({
            success: true,
            loan: result[0],
            message: "Loan application submitted successfully"
        })

    } catch (error: any) {
        console.error("Loan application error:", error)
        return NextResponse.json({
            error: "Failed to process loan application",
            details: error.message
        }, { status: 500 })
    }
}