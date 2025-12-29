import { NextRequest } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { phone, action } = await req.json();
    
    // Send notification to Telegram
    if (action) {
      await sendTelegramNotification(`New ${action}:\nPhone: ${phone}`);
    }
    
    // In a real implementation, you would send an actual OTP
    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        otp: '123456' // This is just for testing - never return actual OTP in production
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send OTP' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}