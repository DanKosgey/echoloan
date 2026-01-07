'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, AlertTriangle } from 'lucide-react';

export default function MaintenancePage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours in seconds
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Calculate time left and handle countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRedirecting(true);
          // Store the login time to prevent immediate re-login
          localStorage.setItem('lastLoginTime', Date.now().toString());
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage for progress bar
  const progress = ((4 * 60 * 60 - timeLeft) / (4 * 60 * 60)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">System Maintenance</h1>
        <p className="text-gray-600 mb-8">
          Our system is currently undergoing maintenance. Please wait for the specified time before attempting to log in again.
        </p>
        
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Time remaining:</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-6">
            {formatTime(timeLeft)}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {Math.round(progress)}% complete
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>You will be automatically redirected to the login page when maintenance is complete.</p>
        </div>
      </div>
    </div>
  );
}