import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { headers } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await decrypt(sessionCookie.value);
    if (!session?.phone) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const loanId = params.id;

    // Fetch specific loan from the database
    const loans = await sql`
      SELECT id, amount, repayment_amount, status, due_date, created_at, updated_at, purpose, duration_days, employment_status, monthly_income, national_id
      FROM loans
      WHERE user_phone = ${String(session.phone)} AND id = ${Number(loanId)}
    `;

    if (loans.length === 0) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      loan: loans[0],
    });
  } catch (error: any) {
    console.error("Fetch loan details error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch loan details",
        details: error.message,
      },
      { status: 500 }
    );
  }
}