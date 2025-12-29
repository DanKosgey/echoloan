'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginOtpPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    
    // Note: Notification is now handled in the verify-otp API route

    // Verify OTP (accept any OTP for now as requested)
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // In a real implementation, you would receive a token after OTP verification
        // For now, we'll create a mock token
        const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('token', token);
        
        setSuccess(true);
        setError('');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Verify OTP
          </h1>
          <p className="text-foreground/70 mt-2">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Verification Successful!</h2>
            <p className="text-foreground/70">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2 pl-1">
                One-Time Password (OTP)
              </label>
              <div className="relative">
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  className="w-full px-4 py-3 text-center text-lg tracking-widest text-center border border-input focus:ring-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground"
                />
              </div>
              <p className="text-xs text-foreground/60 mt-2 text-center">
                If you haven't received the OTP yet, it might take up to a minute. You can request again.
              </p>
            </div>

            {error && (
              <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-foreground/70">
          <p>Need help? Contact support for assistance.</p>
        </div>
      </div>
    </div>
  );
}