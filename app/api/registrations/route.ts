import { NextRequest } from 'next/server';
import { notify } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, action } = await req.json();
    
    // Send notification to Telegram
    if (action) {
      await notify.signup(phone, name, 'N/A', 'N/A');
    }
    
    // In a real implementation, you would store the registration attempt
    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registration attempt recorded' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error recording registration:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to record registration' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}