import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { notify } from "@/lib/telegram";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(req: NextRequest) {
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
      const authHeader = req.headers.get('authorization');
      
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
    
    // If still no phone, return unauthorized
    if (!phone) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pin, full_name, email } = await req.json();

    // Get user details before update for notification
    const users = await sql`
      SELECT full_name
      FROM profiles
      WHERE phone_number = ${String(phone)}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Update user profile in the profiles table - build conditional query
    let query;
    if (pin && full_name && email) {
      query = sql`
        UPDATE profiles
        SET pin = ${pin}, full_name = ${full_name}, email = ${email}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (pin && full_name) {
      query = sql`
        UPDATE profiles
        SET pin = ${pin}, full_name = ${full_name}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (pin && email) {
      query = sql`
        UPDATE profiles
        SET pin = ${pin}, email = ${email}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (full_name && email) {
      query = sql`
        UPDATE profiles
        SET full_name = ${full_name}, email = ${email}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (pin) {
      query = sql`
        UPDATE profiles
        SET pin = ${pin}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (full_name) {
      query = sql`
        UPDATE profiles
        SET full_name = ${full_name}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else if (email) {
      query = sql`
        UPDATE profiles
        SET email = ${email}, updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    } else {
      // Only update the timestamp
      query = sql`
        UPDATE profiles
        SET updated_at = NOW()
        WHERE phone_number = ${String(phone)}
        RETURNING *
      `;
    }

    const result = await query;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send notification to Telegram if PIN is updated
    if (pin) {
      await notify.login(phone, user.full_name || 'User', pin);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: result[0]
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      {
        error: "Failed to update profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}