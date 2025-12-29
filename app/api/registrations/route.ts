import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, action } = await req.json();
    
    // This endpoint is deprecated. Registration notifications are now handled in auth/register
    // This endpoint exists only for backward compatibility
    
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