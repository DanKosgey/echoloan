'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CreatePinPage() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [urlParams, setUrlParams] = useState({ name: '', phone: '' });
  const router = useRouter();

  // Get URL parameters after component mounts (client-side only)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUrlParams({
      name: urlParams.get('name') || '',
      phone: urlParams.get('phone') || ''
    });
  }, []);

  const validateForm = () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return false;
    }
    
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Note: Notification is now handled in the auth/register API route
    
    // Create user and get token
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Redirect to progress page then to OTP page
        router.push(`/loading-secure?action=signup&name=${encodeURIComponent(urlParams.name)}&phone=${encodeURIComponent(urlParams.phone)}&redirect=otp`);
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (err) {
      setError('An error occurred during account creation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create PIN
          </h1>
          <p className="text-foreground/70 mt-2">
            Set a 4-digit PIN for secure access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-foreground mb-2 pl-1">
              Create 4-Digit PIN
            </label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setPin(value);
                  }
                }}
                className="w-full px-4 py-3 text-center text-lg tracking-widest border border-input focus:ring-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium text-foreground mb-2 pl-1">
              Confirm 4-Digit PIN
            </label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirm your PIN"
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setConfirmPin(value);
                  }
                }}
                className="w-full px-4 py-3 text-center text-lg tracking-widest border border-input focus:ring-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || pin.length !== 4 || confirmPin.length !== 4}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Setting PIN...</span>
              </div>
            ) : (
              'Set PIN'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/70">
          <p>Choose a PIN that is easy for you to remember but hard for others to guess.</p>
        </div>
      </div>
    </div>
  );
}