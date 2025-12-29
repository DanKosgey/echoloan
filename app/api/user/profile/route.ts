import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    let phone: string | undefined;
    
    // First, try to get session from cookies (server-side rendering)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (sessionCookie) {
      const session = await decrypt(sessionCookie.value);
      if (session?.phone) {
        phone = session.phone as string;
      }
    }
    
    // If no session from cookies, try to get from Authorization header (client-side fetch)
    if (!phone) {
      const authHeader = request.headers.get('authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
          const session = await decrypt(token);
          if (session?.phone) {
            phone = session.phone as string;
          }
        } catch (error) {
          console.error('Token decryption failed:', error);
        }
      }
    }
    
    // If still no phone, check if there's a token in localStorage-like approach
    // (This won't work server-side, but adding for completeness)
    if (!phone) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user profile data from profiles table
    const profiles = await sql`
      SELECT 
        phone_number as ecocash_phone,
        full_name as first_name,
        '' as last_name,
        email,
        COALESCE(account_balance, 0) as balance,
        COALESCE(account_balance, 0) as savings,  -- Using account_balance as savings for now
        COALESCE(credit_limit, 0) as credit_limit
      FROM profiles
      WHERE phone_number = ${String(phone)}
    `;

    if (profiles.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = profiles[0];

    // Fetch recent transactions
    const transactions = await sql`
      SELECT 
        id,
        COALESCE(description, 'Transaction') as description,
        COALESCE(amount, 0) as amount,
        COALESCE(type, 'credit') as type,
        created_at
      FROM activity_logs
      WHERE user_phone = ${String(phone)}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Convert transaction amounts to positive/negative based on type
    const formattedTransactions = transactions.map(tx => ({
      ...tx,
      amount: tx.type === 'credit' ? Math.abs(tx.amount) : -Math.abs(tx.amount)
    }));

    // Fetch loan count
    const loanCountResult = await sql`
      SELECT COUNT(*) as count
      FROM loans
      WHERE phone_number = ${String(phone)}
    `;
    const loan_count = loanCountResult[0]?.count || 0;
    
    // Fetch max loan amount as credit limit if not available in profile
    const maxLoanResult = await sql`
      SELECT COALESCE(MAX(loan_amount), 0) as max_loan
      FROM loans
      WHERE phone_number = ${String(phone)}
    `;
    const max_loan = maxLoanResult[0]?.max_loan || 0;
    
    // Use the higher of profile credit_limit or max loan amount
    const final_credit_limit = Math.max(Number(profile.credit_limit) || 0, max_loan);

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        balance: Number(profile.balance) || 0,
        savings: Number(profile.savings) || 0,
        credit_limit: final_credit_limit
      },
      loan_count,
      transactions: formattedTransactions
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch profile data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}