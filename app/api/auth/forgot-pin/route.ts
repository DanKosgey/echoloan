import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { phone, action } = await req.json();
    
    // Send notification to Telegram
    if (action) {
      await sendTelegramNotification(`Forgot PIN Request:\nPhone: ${phone}\nAction: ${action}`);
    }
    
    // In a real implementation, you would send a reset PIN link/OTP
    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PIN reset instructions sent' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing forgot PIN:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to process request' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
