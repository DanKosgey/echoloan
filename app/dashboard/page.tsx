'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, PiggyBank, TrendingUp, Wallet, Menu, X } from 'lucide-react';

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Check if user is authenticated by checking for token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      router.push('/login');
    }
  }, [router]);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Loans', href: '/loans' },
    { name: 'Cards', href: '/cards' },
    { name: 'Savings', href: '/savings' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  const quickActions = [
    { name: 'Apply Loan', icon: TrendingUp, href: '/loans/apply' },
    { name: 'Send Money', icon: CreditCard, href: '/send' },
    { name: 'Save Money', icon: PiggyBank, href: '/savings' },
    { name: 'Buy Airtime', icon: Wallet, href: '/airtime' },
  ];

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
            {menuItems.slice(0, 4).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-foreground/70">Here's your financial overview</p>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Main Balance</p>
                <h2 className="text-2xl font-bold">ZWL 1,250.00</h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Savings</p>
                <h2 className="text-2xl font-bold">ZWL 500.00</h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Available Credit</p>
                <h2 className="text-2xl font-bold">ZWL 2,000.00</h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <span>{action.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Description</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Salary Deposit</td>
                  <td className="p-4 text-right text-green-500">+ZWL 3,500.00</td>
                  <td className="p-4 text-right">Today</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Electricity Payment</td>
                  <td className="p-4 text-right text-red-500">-ZWL 450.00</td>
                  <td className="p-4 text-right">Yesterday</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Airtime Purchase</td>
                  <td className="p-4 text-right text-red-500">-ZWL 50.00</td>
                  <td className="p-4 text-right">2 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}