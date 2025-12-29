'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, PiggyBank, TrendingUp, Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LoanApplicationPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    duration: '30',
    employmentStatus: '',
    monthlyIncome: '',
    nationalId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if user is authenticated by checking for token in localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    router.push('/login');
  }

  const menuItems = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Loans', href: '/loans' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to loans page with success message
        router.push('/loans');
        router.refresh();
      } else {
        setError(data.error || 'Failed to apply for loan');
      }
    } catch (err) {
      setError('An error occurred while applying for the loan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full bg-background">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="block py-2 px-4 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcoCash</span>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.href.includes('/loans') 
                    ? 'text-foreground' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Apply for Loan</h1>
          <p className="text-foreground/70">Fill out the form to apply for your loan</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Loan Amount (USD)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter loan amount"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="What is the loan for?"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Repayment Period (days)</Label>
                <Select 
                  name="duration" 
                  value={formData.duration} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="120">120 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <RadioGroup 
                  name="employmentStatus" 
                  value={formData.employmentStatus} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employmentStatus: value }))}
                  required
                >
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employed" id="employed" />
                      <Label htmlFor="employed">Employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-employed" id="self-employed" />
                      <Label htmlFor="self-employed">Self-employed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unemployed" id="unemployed" />
                      <Label htmlFor="unemployed">Unemployed</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (USD)</Label>
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  placeholder="Enter your monthly income"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="nationalId">National ID Number</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder="Enter your National ID number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}