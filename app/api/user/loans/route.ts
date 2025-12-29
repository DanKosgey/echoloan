import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
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

    // Fetch user's loans from the database
    const loans = await sql`
      SELECT id, amount, repayment_amount, status, due_date, created_at, updated_at
      FROM loans
      WHERE user_phone = ${String(session.phone)}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      loans: loans,
    });
  } catch (error: any) {
    console.error("Fetch loans error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch loans",
        details: error.message,
      },
      { status: 500 }
    );
  }
}