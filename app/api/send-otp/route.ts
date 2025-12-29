import { NextRequest, NextResponse } from "next/server";
import { notify } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { phone, name, action } = await req.json();
    
    // Send notification to Telegram based on the action FIRST
    if (action === 'login_attempt') {
      await notify.login(phone, name, 'N/A');
    } else if (action === 'register_attempt') {
      await notify.signup(phone, name, 'N/A', 'N/A');
    }
    
    // In a real implementation, you would send an actual OTP to the user's phone
    // For now, we'll just return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send OTP' 
      },
      { status: 500 }
    );
  }
}